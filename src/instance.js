import QueryBuilder from './query-builder'
import {buildSyncanoURL} from './utils'

/**
 * Syncano account query builder
 * @property {Function}
 */
class Instance extends QueryBuilder {
  constructor(options) {
    super()
    this.accountKey = options.accountKey
  }
  url(instanceName) {
    if (instanceName) {
      return `${buildSyncanoURL()}/instances/${instanceName}/`
    }
    return `${buildSyncanoURL()}/instances/`
  }

  /**
   * Create Syncano instance
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const instance = await instance.create({name: 'new-instance', description: 'description'})
   */
  create(params) {
    const fetch = this.nonInstanceFetch.bind(this)
    return new Promise((resolve, reject) => {
      const headers = {
        'X-API-KEY': this.accountKey
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(params)
      }
      fetch(this.url(), options, headers)
        .then(resp => resolve(resp))
        .catch(err => reject(err))
    })
  }

  /**
   * Delete Syncano instance
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * await instance.delete({name: 'new-instance'})
   */
  delete(params) {
    const fetch = this.nonInstanceFetch.bind(this)
    return new Promise((resolve, reject) => {
      const headers = {
        'X-API-KEY': this.accountKey
      }
      const options = {
        method: 'DELETE'
      }
      fetch(this.url(params.name), options, headers)
        .then(resp => resolve(resp))
        .catch(err => reject(err))
    })
  }
}

export default Instance
