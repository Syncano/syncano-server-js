import QueryBuilder from './query-builder'
import {buildInstanceURL} from './utils'

/**
 * Syncano account query builder
 * @property {Function}
 */
class Channel extends QueryBuilder {
  url() {
    const {instanceName} = this.instance
    return `${buildInstanceURL(instanceName)}/channels/default/publish/`
  }

  /**
   * Publish to channel
   *
   * @returns {Promise}
   *
   * @example {@lang javascript}
   * const instance = await channel.publish('room_name', payload={})
   */
  publish(room, payload) {
    const fetch = this.fetch.bind(this)

    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        body: JSON.stringify({room, payload})
      }
      fetch(this.url(), options)
        .then(resolve)
        .catch(reject)
    })
  }
}

export default Channel
