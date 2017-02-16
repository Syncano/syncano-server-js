import Data from './data'
import Users from './users'
import Account from './account'
import Instance from './instance'
import Event from './event'
import Endpoint from './endpoint'

export default function server(options = {}) {
  const genInstanceConfig = className => {
    let config = {...options, className}

    if (global.CONFIG) {
      config = Object.assign({}, {
        token: CONFIG.SYNCANO_API_KEY,
        instanceName: CONFIG.SYNCANO_INSTANCE_NAME
      }, options)
    }

    return config
  }

  const instanceConfig = genInstanceConfig()

  const users = new Users()
  users.instance = instanceConfig
  const event = new Event()
  event.instance = instanceConfig
  const endpoint = new Endpoint()
  endpoint.instance = instanceConfig

  const account = new Account({accountKey: options.accountKey})
  const instance = new Instance({accountKey: options.accountKey})

  return {
    users,
    account,
    instance,
    event,
    endpoint,
    data: new Proxy(new Data(), {
      get(target, className) {
        const data = new Data()

        data.instance = genInstanceConfig(className)

        return data
      }
    })
  }
}
