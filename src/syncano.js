const Syncano = require("syncano")

let { DataObject } = Syncano({
  accountKey: "",
  defaults: {
    instanceName: ""
  }
})

class Data {
  get query() {
    return this._query()
  }

  set query(query) {
    this._query = query
  }

  call(fn, paramteres) {
    this.query = this.query[fn].bind(this.query, paramteres)

    return this
  }

  /**
   * List objects matching query.
   */
  list() {
    const pageSize = this.query.query.page_size || 0
    let result = []

    return new Promise((resolve, reject) => {
      function saveAndLoadNext(response) {
        result = result.concat(response)

        const loadNext =
          (pageSize === 0 || pageSize > result.length)
          && response.hasNext()

        if (loadNext) {
          response
            .next()
            .then(saveAndLoadNext)
            .catch(err => reject(err))
        } else {
          if (pageSize !== 0) {
            result = result.slice(0, pageSize)
          }

          resolve(result)
        }
      }

      this.query
        .list()
        .then(saveAndLoadNext)
        .catch(err => reject(err))
    });
  }

  /**
   * Get first element matching query or return null.
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
   */
  firstOrFail() {
    return new Promise((resolve, reject) => {
      this
        .first()
        .then(object => object ? resolve(object) : reject(new NotFoundError))
    })
  }

  /**
   * Get single object by id or objects list if ids passed as array.
   */
  find(ids) {
    if (Array.isArray(ids)) {
      return this.where('id', 'in', ids).list()
    }

    return this.where('id', 'eq', ids).first()
  }

  /**
   * Same as #find method but throws error for no results.
   */
  findOrFail(ids) {
    return new Promise((resolve, reject) => {
      this
        .find(ids)
        .then(response => {
          const shouldThrow = Array.isArray(ids) ? !response.objects.length : response;

          return shouldThrow ? resolve(response) : reject(new NotFoundError)
        })
    })
  }

  /**
   * Number of objects to get.
   */
  take(count) {
    return this.call('pageSize', count)
  }

  /**
   * Filter objects using MongoDB style query.
   */
  filter(filters) {
    return this.call('filter', filters)
  }

  /**
   * Set order of fetched objects.
   */
  orderBy(column, direction = 'asc') {
    direction = direction.toLowerCase()
    direction = direction === 'desc' ? '-' : ''

    return this.call('orderBy', `${direction}${column}`)
  }

  /**
   * Filter rows.
   */
  where(column, operator, value) {
    const whereOperator = value ? `_${operator}` : '_eq'
    const whereValue = value === undefined ? operator : value

    const currentQuery = JSON.parse(this.query.query.query || '{}')
    const nextQuery = { [column]: { [whereOperator]: whereValue } }

    const lookup = Object.assign({}, currentQuery, nextQuery)

    return this.call('filter', lookup)
  }

  create(object) {
    return this.query.create(object)
  }
}

function NotFoundError(message = 'No results for given query.') {
  this.stack = (new Error()).stack
  this.name = 'NotFoundError'
  this.message = message
}

NotFoundError.prototype = Error.prototype

const data = new Proxy(new Data(), {
  get: function(target, property) {
    target._query = DataObject.please.bind(DataObject, { className: property })

    return target
  }
})

data.tag
  .create({ name: 'riot' })
  .then((response) => {
    console.log(response, 'response') // eslint-disable-line
  })
  .catch(err => {
    console.log(err.message) // eslint-disable-line
  })
