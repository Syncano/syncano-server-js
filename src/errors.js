function NotFoundError(message = 'No results for given query.') {
  this.stack = (new Error()).stack
  this.name = 'NotFoundError'
  this.message = message
}

NotFoundError.prototype = Error.prototype

export default {
  NotFoundError
}