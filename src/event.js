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

    const options = {
      method: 'POST',
      body: JSON.stringify({signal, payload})
    }

    return fetch(this.url(), options)
  }

}

export default Instance
