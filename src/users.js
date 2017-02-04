import querystring from 'querystring'
import Data from './data'
import {buildInstanceURL} from './utils'

/**
 * Syncano users query builder
 * @property {Function}
 */
class Users extends Data {
  url(id) {
    const {instanceName} = this.instance
    const url = `${buildInstanceURL(instanceName)}/users/${id ? id + '/' : ''}`
    const query = querystring.stringify(this.query)

    return query ? `${url}?${query}` : url
  }
}

export default Users
