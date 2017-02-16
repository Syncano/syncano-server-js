import QueryBuilder from './query-builder'
import {buildLocalInstanceURL} from './utils'

/**
 * Syncano account query builder
 * @property {Function}
 */
export default class Endpoint extends QueryBuilder {
  url(endpoint) {
    const {instanceName} = this.instance
    return `${buildLocalInstanceURL(instanceName)}/${endpoint}/`
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
