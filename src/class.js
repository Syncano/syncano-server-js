import QueryBuilder from './query-builder'
import {buildInstanceURL} from './utils'

/**
 * Syncano account query builder
 * @property {Function}
 */
class Class extends QueryBuilder {
  url(className) {
    const {instanceName} = this.instance
    const baseUrl = `${buildInstanceURL(instanceName)}/classes/`

    return className ? `${baseUrl}${className}/` : baseUrl
  }

  /**
   * Create Syncano class
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const instance = await class.create({name: 'class_name'})
   */
  create(params) {
    const fetch = this.fetch.bind(this)

    return new Promise((resolve, reject) => {
      const headers = {
        'X-API-KEY': this.accountKey
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(params)
      }
      fetch(this.url(), options, headers)
        .then(resolve)
        .catch(reject)
    })
  }

  /**
   * Delete Syncano class
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * await syncanoClass.delete('class_name')
   */
  delete(className) {
    const fetch = this.fetch.bind(this)

    return new Promise((resolve, reject) => {
      const headers = {
        'X-API-KEY': this.accountKey
      }
      const options = {
        method: 'DELETE'
      }
      fetch(this.url(className), options, headers)
        .then(resolve)
        .catch(reject)
    })
  }
}

export default Class
