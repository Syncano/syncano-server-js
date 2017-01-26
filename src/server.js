import Data from './data'

export default function connect(options = {}) {
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

  return {
    data: new Proxy(new Data(), {
      get(target, className) {
        target.instance = instance(className)

        return target
      }
    })
  }
}
