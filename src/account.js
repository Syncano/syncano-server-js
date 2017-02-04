import QueryBuilder from './query-builder'
import {buildSyncanoURL} from './utils'

/**
 * Syncano account query builder
 * @property {Function}
 */
class Account extends QueryBuilder {
  url() {
    return `${buildSyncanoURL()}/account/`
  }

  /**
   * Get details of Syncano account
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const account = await account.get('0aad29dd0be2bcebb741525b9c5901e55cf43e98')
   */
  get(authKey) {
    const fetch = this.nonInstanceFetch.bind(this)
    return new Promise((resolve, reject) => {
      const headers = {
        'X-API-KEY': authKey
      }
      fetch(this.url(), {}, headers)
        .then(resp => resolve(resp))
        .catch(err => reject(err))
    })
  }
}

export default Account
