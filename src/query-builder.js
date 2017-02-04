import nodeFetch from 'node-fetch'
import {checkStatus, parseJSON} from './utils'
import {SYNCANO_HOST} from './settings'

export default class QueryBuilder {
  constructor() {
    this.baseUrl = `https://${SYNCANO_HOST}`
  }

  fetch(url, options) {
    const request = nodeFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.instance.token
      },
      ...options
    })
      .then(checkStatus)
      .then(parseJSON)

    return request
  }

  nonInstanceFetch(url, options, headers) {
    const request = nodeFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      ...options
    })
      .then(checkStatus)
      .then(parseJSON)

    return request
  }

  get query() {
    return this._query || {}
  }

  withQuery(query) {
    this._query = Object.assign({}, this.query, query)

    return this
  }
}
