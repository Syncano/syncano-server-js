import QueryBuilder from './query-builder'

/**
 * Syncano account query builder
 * @property {Function}
 */
export default class Endpoint extends QueryBuilder {
  url(endpoint) {
    const instConf = this.instance
    return `https://${instConf.instanceName}.${instConf.spaceHost}/${endpoint}/`
  }

  parseBody(body) {
    if (typeof body === 'object') {
      const data = {
        ...body
      }
      return JSON.stringify(data)
    }
    return body
  }

  client(endpoint, body = {}, options = {}) {
    const fetch = this.localFetch.bind(this)
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
