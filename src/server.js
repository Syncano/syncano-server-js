import Data from './data'
import Users from './users'

export default function server(options = {}) {
  const instance = className => {
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
  users.instance = instance()

  return {
    users,
    data: new Proxy(new Data(), {
      get(target, className) {
        target.instance = instance(className)

        return target
      }
    })
  }
}
