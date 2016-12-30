import Data from './data'
import Syncano from './syncano'

export default function connect(options = {}) {
  if (global.CONFIG) {
    options = Object.assign({}, {
      token: CONFIG.SYNCANO_API_KEY,
      instance: CONFIG.SYNCANO_INSTANCE_NAME
    }, options)
  }

  const instance = Syncano({
    apiKey: options.token,
    defaults: {
      instanceName: options.instance
    }
  })

  const { DataObject } = instance

  return {
    setBaseUrl: url => {
      instance.setBaseUrl(url)

      return this
    },

    data: new Proxy(new Data(), {
      get(target, className) {
        target._query = instance.DataObject.please.bind(DataObject, { className })

        return target
      }
    })
  }
}
