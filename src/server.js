import Data from './data'

export default function connect(instance) {
  const { DataObject } = instance

  return {
    data: new Proxy(new Data(), {
      get: function(target, property) {
        target._query = instance.DataObject.please.bind(DataObject, { className: property })

        return target
      }
    })
  }
}
