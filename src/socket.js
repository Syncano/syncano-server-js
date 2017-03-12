import QueryBuilder from './query-builder'

/**
 * Connection between scokets.
 * @property {Function}
 * @example {@lang javascript}
 * const Tags = socket('tags')
 * const latestTags = await Tags.get('list', { sort: 'latest' })
 * const createdTag = await Tags.post('create', { name: 'nature' })
 */
export default class Socket extends QueryBuilder {
  url(endpoint) {
    const {instanceName, spaceHost} = this.instance

    return `https://${instanceName}.${spaceHost}/${this.socketName}/${endpoint}/`
  }

  connect(socketName) {
    this.socketName = socketName

    return this
  }

  parseBody(body) {
    const isBodyAnObject = typeof body === 'object'

    return isBodyAnObject ? JSON.stringify({...body}) : body
  }

  post(endpoint, body = {}, options = {}) {
    const fetch = this.fetch.bind(this)

    return fetch(this.url(endpoint), {
      method: 'POST',
      body: this.parseBody(body),
      ...options
    })
  }

  get(endpoint, data = {}, options = {}) {
    return this.post(endpoint, {...data, _method: 'GET'}, options)
  }

  delete(endpoint, data = {}, options = {}) {
    return this.post(endpoint, {...data, _method: 'DELETE'}, options)
  }

  put(endpoint, data = {}, options = {}) {
    return this.post(endpoint, {...data, _method: 'PUT'}, options)
  }

  patch(endpoint, data = {}, options = {}) {
    return this.post(endpoint, {...data, _method: 'PATCH'}, options)
  }
}
