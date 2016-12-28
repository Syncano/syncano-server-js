import Data from './data'
import Syncano from './syncano'

export default function connect(options) {
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
      get(target, property) {
        target._query = instance.DataObject.please.bind(DataObject, { className: property })

        return target
      }
    })
  }
}
