import QueryBuilder from './query-builder'

/**
 * Syncano account query builder
 * @property {Function}
 */
class Instance extends QueryBuilder {
  url() {
    const instConf = this.instance
    return `https://${instConf.host}/${instConf.apiVersion}/instances/${instConf.instanceName}/triggers/emit/`
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
