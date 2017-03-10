import QueryBuilder from './query-builder'

/**
 * Syncano account query builder
 * @property {Function}
 */
export default class Socket extends QueryBuilder {
  url(socket) {
    const {instanceName, spaceHost} = this.instance
    return `https://${instanceName}.${spaceHost}/${socket}/`
  }

  parseBody(body) {
    const isBodyAnObject = typeof body === 'object'
    return isBodyAnObject ? JSON.stringify({...body}) : body
  }

  client(socket, body = {}, options = {}) {
    const fetch = this.fetch.bind(this)

    return fetch(this.url(socket), {
      method: 'POST',
      body: this.parseBody(body),
      ...options
    })
  }

  post() {
    return this.client(...arguments)
  }
}
