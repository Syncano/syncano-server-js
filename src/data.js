import querystring from 'querystring'
import QueryBuilder from './query-builder'
import {NotFoundError} from './errors'

/**
 * Syncano server
 * @property {Function} query Instance of syncano DataObject
 */
class Data extends QueryBuilder {
  url(id) {
    const {instanceName, className} = this.instance
    const url = `https://api.syncano.rocks/v2/instances/${instanceName}/classes/${className}/objects/${id ? id + '/' : ''}`
    const query = querystring.stringify(this.query)

    return query ? `${url}?${query}` : url
  }

  /**
   * List objects matching query.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * // Get all users
   * const users = await data.users.list()
   * @example {@lang javascript}
   * // Get 10 users
   * const users = await data.users.take(10).list()
   */
  list() {
    let result = []
    const {baseUrl} = this
    const fetch = this.fetch.bind(this)
    const pageSize = this.query.page_size || 0

    return new Promise((resolve, reject) => {
      function saveAndLoadNext(response) {
        result = result.concat(response.objects)

        const loadNext =
          (pageSize === 0 || pageSize > result.length) &&
          response.next

        if (loadNext) {
          fetch(`${baseUrl}${response.next}`)
            .then(saveAndLoadNext)
            .catch(err => reject(err))
        } else {
          if (pageSize !== 0) {
            result = result.slice(0, pageSize)
          }

          resolve(result)
        }
      }

      fetch(this.url())
        .then(saveAndLoadNext)
        .catch(err => reject(err))
    })
  }

  /**
   * Get first element matching query or return null.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const users = await data.users.where('name', 'John').first()
   */
  first() {
    return this.take(1).list().then(response => response[0] || null)
  }

  /**
   * Get first element matching query or throw error.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const users = await data.users.where('name', 'John').firstOrFail()
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
   * const users = await data.users.find(4)
   * @example {@lang javascript}
   * const users = await data.users.find([20, 99, 125])
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
   * const users = await data.users.findOrFail(4)
   * @example {@lang javascript}
   * const users = await data.users.findOrFail([20, 99, 125])
   * @example {@lang javascript}
   * // Will throw error if at lest one of records was not found
   * const users = await data.users.findOrFail([20, 99, 125], true)
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
   * const users = await data.users.take(500).list()
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
   * const users = await data.users.orderBy('created_at', 'DESC').list()
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
   * const users = await data.users.where('name', 'eq' 'John').list()
   * @example {@lang javascript}
   * const users = await data.users.where('name', 'John').list()
   * @example {@lang javascript}
   * const users = await data.users.where('created_at', 'gt' '2016-02-13').list()
   */
  where(column, operator, value) {
    const whereOperator = value ? `_${operator}` : '_eq'
    const whereValue = value === undefined ? operator : value

    const currentQuery = JSON.parse(this.query.query || '{}')
    const nextQuery = {[column]: {[whereOperator]: whereValue}}
    const query = Object.assign(currentQuery, nextQuery)

    return this.withQuery({query: JSON.stringify(query)})
  }

  /**
   * Create new object.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const users = await data.users.create({
   *   name: 'John Doe',
   *   email: 'john.doe@example.com'
   *   username: 'john.doe'
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
   * data.users.update(55, { last_name: 'Jane' })
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
   * data.users.delete(55)
   */
  delete(id) {
    return this.fetch(this.url(id), {
      method: 'DELETE'
    })
  }
}

export default Data
