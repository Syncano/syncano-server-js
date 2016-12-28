import { NotFoundError } from './errors'
import Collection from './collection'

/**
 * Syncano server
 * @property {Function} query Instance of syncano DataObject
 */
class Data {
  get query() {
    return this._query()
  }

  set query(query) {
    this._query = query
  }

  /**
   * Call method on current query.
   *
   * @returns {Object}
   */
  call(fn, paramteres) {
    this.query = this.query[fn].bind(this.query, paramteres)

    return this
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
    const pageSize = this.query.query.page_size || 0
    let result = []

    return new Promise((resolve, reject) => {
      function saveAndLoadNext(response) {
        result = result.concat(response)

        const loadNext =
          (pageSize === 0 || pageSize > result.length) &&
          response.hasNext()

        if (loadNext) {
          response
            .next()
            .then(saveAndLoadNext)
            .catch(err => reject(err))
        } else {
          if (pageSize !== 0) {
            result = result.slice(0, pageSize)
          }
          const data = new Collection(result)
          resolve(data.raw())
        }
      }

      this.query
        .list()
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
    return this.query
      .pageSize(1)
      .list()
      .raw()
      .then(({ objects }) => objects[0] || null)
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
   */
  findOrFail(ids) {
    return new Promise((resolve, reject) => {
      this
        .find(ids)
        .then(response => {
          const shouldThrow = Array.isArray(ids) ? !response.objects.length : response
          return shouldThrow ? resolve(response) : reject(new NotFoundError())
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
    return this.call('pageSize', count)
  }

  /**
   * Filter objects using MongoDB style query.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const users = await data.users.filter({
   *   name: { _eq: 'John' }
   * }).list()
   */
  filter(filters) {
    return this.call('filter', filters)
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

    return this.call('orderBy', `${direction}${column}`)
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
   * const users = await data.users.where('created_at', 'gt' '13-02-2016').list()
   */
  where(column, operator, value) {
    const whereOperator = value ? `_${operator}` : '_eq'
    const whereValue = value === undefined ? operator : value

    const currentQuery = JSON.parse(this.query.query.query || '{}')
    const nextQuery = { [column]: { [whereOperator]: whereValue } }

    const lookup = Object.assign({}, currentQuery, nextQuery)

    return this.call('filter', lookup)
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
  create(object) {
    return this.query.create(object)
  }

  /**
   * Update object in database.
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * data.users.update(55, { last_name: 'Jane' })
   */
  update(id, data) {
    return this.query.update({ id }, data)
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
    return this.query.delete({ id })
  }
}

export default Data
