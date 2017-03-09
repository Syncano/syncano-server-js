import querystring from 'querystring'
import QueryBuilder from './query-builder'
import {NotFoundError} from './errors'
import {buildInstanceURL} from './utils'
/**
 * Syncano server
 * @property {Function} query Instance of syncano DataObject
 */
class Data extends QueryBuilder {
  url(id) {
    const {instanceName, className} = this.instance
    let url = `${buildInstanceURL(instanceName)}/classes/${className}/objects/${id ? id + '/' : ''}`

    if (this._url !== undefined) {
      url = this._url
    }

    const query = querystring.stringify(this.query)

    return query ? `${url}?${query}` : url
  }

  /**
   * List objects matching query.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * // Get all posts
   * const posts = await data.posts.list()
   * @example {@lang javascript}
   * // Get 10 posts
   * const posts = await data.posts.take(10).list()
   */
  list() {
    let result = []
    const self = this
    const {baseUrl, relationships, instance} = this
    const fetch = this.fetch.bind(this)
    const pageSize = this.query.page_size || 0

    return new Promise((resolve, reject) => {
      request(this.url())

      function request(url) {
        fetch(url)
          .then(saveToResult)
          .then(loadNextPage)
          .then(resolveRelatedModels)
          .then(replaceCustomTypesWithValue)
          .then(resolveIfFinished)
          .catch(err => reject(err))
      }

      function saveToResult(response) {
        result = result.concat(response.objects)

        return response
      }

      function loadNextPage(response) {
        const hasNextPageMeta = response.next
        const hasNotEnoughResults = pageSize === 0 || pageSize > result.length

        if (hasNextPageMeta && hasNotEnoughResults) {
          request(`${baseUrl}${response.next}`)
        } else {
          return true
        }
      }

      function resolveRelatedModels(shouldResolve) {
        if (shouldResolve === false) {
          return
        }

        return new Promise((resolve, reject) => {
          if (relationships.length === 0) {
            resolve(true)
          }

          const resolvers = relationships.map(reference => {
            return new Promise((resolve, reject) => {
              const empty = {
                target: reference,
                items: []
              }

              if (result[0] === undefined) {
                resolve(empty)
              }

              if (result[0][reference] === undefined) {
                throw new Error(`Invalid reference name "${reference}"`)
              }

              // Search for rows with references
              const references = result
                .filter(row => row[reference])
                .map(row => {
                  return row[reference]
                })

              // No references so resolve with empty array
              if (references.length === 0) {
                resolve(empty)
              }

              const {target} = references[0]
              const ids = references.map(item => item.value)

              const load = new Data()

              if (target === 'user') {
                load._url = `${buildInstanceURL(instance.instanceName)}/users/`
              }

              load.instance = self.instance
              load.instance.className = target

              load.where('id', 'in', ids).list().then(items => {
                resolve({target: reference, items})
              }).catch(reject)
            })
          })

          Promise.all(resolvers)
            .then(models => {
              result = result.map(item => {
                models.forEach(({target, items}) => {
                  const related = items.find(obj =>
                    item[target] && obj.id === item[target].value
                  )

                  item[target] = related || item[target]
                })

                return item
              })

              resolve(true)
            })
            .catch(reject)
        })
      }

      function replaceCustomTypesWithValue(shouldResolve) {
        if (shouldResolve === false) {
          return
        }

        result = result.map(item => {
          Object.keys(item).forEach(key => {
            const value = item[key]
            const isObject = value instanceof Object && !Array.isArray(value)
            const hasType = isObject && value.type !== undefined
            const hasTarget = isObject && value.target !== undefined
            const hasValue = isObject && value.value !== undefined

            if (isObject && hasType && hasTarget && hasValue) {
              item[key] = value.value
            }
          })

          return item
        })

        return true
      }

      function resolveIfFinished(shouldResolve) {
        if (shouldResolve) {
          if (pageSize !== 0) {
            result = result.slice(0, pageSize)
          }

          resolve(result)
        }
      }
    })
  }

  /**
   * Get first element matching query or return null.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const posts = await data.posts.where('status', 'published').first()
   */
  first() {
    return this.take(1).list().then(response => response[0] || null)
  }

  /**
   * Get first element matching query or throw erro'status', 'in', ['draft', 'published']se}
   *
   * @example {@lang javascript}
   * const posts = await data.posts.where('status', 'published').firstOrFail()
   */
  firstOrFail() {
    return new Promise((resolve, reject) => {
      this
        .first()
        .then(object => object ? resolve(object) : reject(new NotFoundError()))
        .catch(() => {
          reject(new NotFoundError())
        })
    })
  }

  /**
   * Get single object by id or objects list if ids passed as array.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const posts = await data.posts.find(4)
   * @example {@lang javascript}
   * const posts = await data.posts.find([20, 99, 125])
   */
  find(ids) {
    if (Array.isArray(ids)) {
      return this.where('id', 'in', ids).list()
    }

    return this.where('id', 'eq', ids).first()
  }

  /**
   * Same as #find method but throws error for no results.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const posts = await data.posts.findOrFail(4)
   * @example {@lang javascript}
   * const posts = await data.posts.findOrFail([20, 99, 125])
   * @example {@lang javascript}
   * // Will throw error if at lest one of records was not found
   * const posts = await data.posts.findOrFail([20, 99, 125], true)
   */
  findOrFail(ids) {
    return new Promise((resolve, reject) => {
      this
        .find(ids)
        .then(response => {
          const shouldThrow = Array.isArray(ids) ? response.length !== ids.length : response === null

          return shouldThrow ? reject(new NotFoundError()) : resolve(response)
        })
        .catch(() => {
          reject(new NotFoundError())
        })
    })
  }

  /**
   * Number of objects to get.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const posts = await data.posts.take(500).list()
   */
  take(count) {
    return this.withQuery({page_size: count}) // eslint-disable-line camelcase
  }

  /**
   * Set order of fetched objects.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const posts = await data.posts.orderBy('created_at', 'DESC').list()
   */
  orderBy(column, direction = 'asc') {
    direction = direction.toLowerCase()
    direction = direction === 'desc' ? '-' : ''

    return this.withQuery({
      order_by: `${direction}${column}` // eslint-disable-line camelcase
    })
  }

  /**
   * Filter rows.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const posts = await data.posts.where('status', 'in', ['draft', 'published']).list()
   * @example {@lang javascript}
   * const posts = await data.posts.where('status', 'published').list()
   * @example {@lang javascript}
   * const posts = await data.posts.where('created_at', 'gt' '2016-02-13').list()
   * @example {@lang javascript}
   * const posts = await data.posts.where('user.id', 30).list()
   * @example {@lang javascript}
   * const posts = await data.posts.where('user.full_name', 'contains', 'John').list()
   */
  where(column, operator, value) {
    const whereOperator = value ? `_${operator}` : '_eq'
    const whereValue = value === undefined ? operator : value

    const currentQuery = JSON.parse(this.query.query || '{}')

    const nextQuery = column.split('.').reverse()
      .reduce((child, item) => ({
        [item]: child === null ? {
          [whereOperator]: whereValue
        } : {
          _is: child
        }
      }), null)

    const query = Object.assign(currentQuery, nextQuery)

    return this.withQuery({query: JSON.stringify(query)})
  }

  /**
   * Expand references and relationships.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * data.posts.with('author').list()
   * @example {@lang javascript}
   * data.posts.with(['author', 'last_editor']).list()
   */
  with(...models) {
    const relationships = Array.isArray(models[0]) ? models[0] : models

    return this.withRelationships(relationships)
  }

  /**
   * Create new object.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const posts = await data.posts.create({
   *   title: 'Example post title',
   *   content: 'Lorem ipsum dolor sit amet.'
   * })
   */
  create(body) {
    return this.fetch(this.url(), {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  /**
   * Update object in database.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * data.posts.update(55, { content: 'No more lorem ipsum!' })
   */
  update(id, body) {
    return this.fetch(this.url(id), {
      method: 'PATCH',
      body: JSON.stringify(body)
    })
  }

  /**
   * Remove object from database.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * data.posts.delete(55)
   */
  delete(id) {
    return this.fetch(this.url(id), {
      method: 'DELETE'
    })
  }
}

export default Data
