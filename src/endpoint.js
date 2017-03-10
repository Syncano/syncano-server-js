import QueryBuilder from './query-builder'

/**
 * Syncano account query builder
 * @property {Function}
 */
export default class Endpoint extends QueryBuilder {
  url(endpoint) {
    const {instanceName, spaceHost} = this.instance
    return `https://${instanceName}.${spaceHost}/${endpoint}/`
  }

  parseBody(body) {
    const isBodyAnObject = typeof body === 'object'
    return isBodyAnObject ? JSON.stringify({...body}) : body
  }

  client(endpoint, body = {}, options = {}) {
    const fetch = this.fetch.bind(this)

    return fetch(this.url(endpoint), {
      method: 'POST',
      body: this.parseBody(body),
      ...options
    })
  }

  post() {
    return this.client(...arguments)
  }
}
