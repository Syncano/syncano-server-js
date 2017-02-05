import QueryBuilder from './query-builder'
import {buildInstanceURL} from './utils'

/**
 * Syncano account query builder
 * @property {Function}
 */
class Instance extends QueryBuilder {
  url() {
    const {instanceName} = this.instance
    return `${buildInstanceURL(instanceName)}/triggers/emit/`
  }

  /**
   * Emit event
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const instance = await event.emit('signal_name', payload={})
   */
  emit(signal, payload) {
    const fetch = this.fetch.bind(this)
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        body: JSON.stringify({signal, payload})
      }
      fetch(this.url(), options)
        .then(resp => resolve(resp))
        .catch(err => reject(err))
    })
  }

}

export default Instance
