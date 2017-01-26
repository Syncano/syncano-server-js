import querystring from 'querystring'
import Data from './data'

/**
 * Syncano users query builder
 * @property {Function}
 */
class Users extends Data {
  url(id) {
    const {instanceName, className} = this.instance
    const url = `https://api.syncano.rocks/v2/instances/${instanceName}/users/${id ? id + '/' : ''}`
    const query = querystring.stringify(this.query)

    return query ? `${url}?${query}` : url
  }
}

export default Users
