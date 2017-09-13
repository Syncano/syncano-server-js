import nodeFetch from 'node-fetch'
import {checkStatus, parseJSON} from './utils'
import {getHost} from './settings'

export default class QueryBuilder {
  constructor() {
    this.baseUrl = `https://${getHost()}`
  }

  fetch(url, options, headers = {}) {
    const headersToSend = Object.assign({
      'content-type': 'application/json',
      'x-api-key': this.instance.token
    }, headers)

    return nodeFetch(url, {
      headers: headersToSend,
      ...options
    })
      .then(parseJSON)
      .then(checkStatus)
  }

  nonInstanceFetch(url, options, headers) {
    return nodeFetch(url, {
      headers: {
        'content-type': 'application/json',
        ...headers
      },
      ...options
    })
      .then(parseJSON)
      .then(checkStatus)
  }

  get query() {
    return this._query || {}
  }

  get relationships() {
    return this._relationships || []
  }

  get mappedFields() {
    return this._mappedFields || []
  }

  withQuery(query) {
    this._query = Object.assign({}, this.query, query)

    return this
  }

  withRelationships(relationships) {
    this._relationships = this.relationships.concat(relationships)

    return this
  }

  withMappedFields(fields) {
    this._mappedFields = Object.assign({}, this.mappedFields, ...fields)

    return this
  }
}
