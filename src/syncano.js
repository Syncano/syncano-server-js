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
  
  list() {
    return this.query.list().raw()
  }
  
  first() {
    return this.query
      .pageSize(1)
      .list()
      .raw()
      .then(({ objects }) => objects[0] || null)
  }
  
  firstOrFail() {
    return new Promise((resolve, reject) => {
      this
        .first()
        .then(object => object ? resolve(object) : reject(new NotFoundError))
    })
  }
  
  find(ids) {
    if (Array.isArray(ids)) {
      return this.where('id', 'in', ids).list()
    }
    
    return this.where('id', 'eq', ids).first()
  }
  
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
  
  all() {
    let result = []
    
    return new Promise((resolve, reject) => {
      function saveAndLoadNext(response) {
        result = result.concat(response)
        
        if(response.hasNext()) {
          response
            .next()
            .then(saveAndLoadNext)
            .catch(err => reject(err))
        } else {
          resolve(result)
        }
      }
      
      this.query
        .list()
        .then(saveAndLoadNext)
        .catch(err => reject(err))
    });
  }
  
  take(count) {
    return this.call('pageSize', count)
  }
  
  filter(filters) {
    return this.call('filter', filters)
  }
  
  orderBy(column, direction = 'asc') {
    direction = direction.toLowerCase()
    direction = direction === 'desc' ? '-' : ''
    
    return this.call('orderBy', `${direction}${column}`)
  }
  
  where(column, operator, value) {
    const whereOperator = value ? `_${operator}` : '_eq'
    const whereValue = value === undefined ? operator : value
    
    const currentQuery = JSON.parse(this.query.query.query || '{}')
    const nextQuery = { [column]: { [whereOperator]: whereValue } }
    
    const lookup = Object.assign({}, currentQuery, nextQuery)
    
    return this.call('filter', lookup)
  }
}

function NotFoundError(message = 'No results for given query.') {
  this.stack = (new Error()).stack
  this.name = 'NotFoundError'
  this.message = message
}

NotFoundError.prototype = Error.prototype

let data = new Proxy(new Data(), {
  get: function(target, property) {
    target._query = DataObject.please.bind(DataObject, { className: property })
    
    return target
  }
})

data.users_base
  // .orderBy('name', 'desc')
  // .where('name', 'in', ['react', 'css'])
  // .take(50)
  // .list()
  .all()
  .then((response) => {
    console.log(response.length, 'response') // eslint-disable-line
  })
  .catch(err => {
    console.log(err.message) // eslint-disable-line
  })
