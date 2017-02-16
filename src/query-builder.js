import nodeFetch from 'node-fetch'
import {checkStatus, parseJSON} from './utils'
import {getHost} from './settings'

export default class QueryBuilder {
  constructor() {
    this.baseUrl = `https://${getHost()}`
  }

  fetch(url, options) {
    return nodeFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.instance.token
      },
      ...options
    })
      .then(checkStatus)
      .then(parseJSON)
  }

  localFetch(url, options) {
    return nodeFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.instance.token
      },
      ...options
    })
      .then(checkStatus)
  }

  nonInstanceFetch(url, options, headers) {
    return nodeFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      ...options
    })
      .then(checkStatus)
      .then(parseJSON)
  }

  get query() {
    return this._query || {}
  }

  withQuery(query) {
    this._query = Object.assign({}, this.query, query)

    return this
  }
}
