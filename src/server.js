import Data from './data'
import Users from './users'
import Account from './account'
import Instance from './instance'

export default function server(options = {}) {
  const instanceConfig = className => {
    let config = {...options, className}

    if (global.CONFIG) {
      config = Object.assign({}, {
        token: CONFIG.SYNCANO_API_KEY,
        instanceName: CONFIG.SYNCANO_INSTANCE_NAME
      }, options)
    }

    return config
  }

  const users = new Users()
  users.instance = instanceConfig()

  const account = new Account({accountKey: options.accountKey})
  const instance = new Instance({accountKey: options.accountKey})

  return {
    users,
    account,
    instance,
    data: new Proxy(new Data(), {
      get(target, className) {
        const data = new Data()

        data.instance = instanceConfig(className)

        return data
      }
    })
  }
}
