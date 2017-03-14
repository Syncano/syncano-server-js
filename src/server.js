import Data from './data'
import Users from './users'
import Account from './account'
import Instance from './instance'
import Event from './event'
import Socket from './socket'
import Response from './response'
import {
  getToken,
  getInstanceName,
  getHost,
  getSpaceHost,
  SYNCANO_API_VERSION
} from './settings'

export default function server(options = {}) {
  const genInstanceConfig = className => {
    const config = Object.assign({}, {
      token: getToken(),
      instanceName: getInstanceName(),
      host: getHost(),
      spaceHost: getSpaceHost(),
      apiVersion: SYNCANO_API_VERSION,
      className
    }, options)

    return config
  }

  const instanceConfig = genInstanceConfig()

  const users = new Users()
  users.instance = instanceConfig
  const event = new Event()
  event.instance = instanceConfig
  const socket = new Socket()
  socket.instance = instanceConfig

  const account = new Account({accountKey: options.accountKey})
  const instance = new Instance({accountKey: options.accountKey})

  return {
    users,
    account,
    instance,
    event,
    response: Response,
    socket: socket.connect.bind(socket),
    data: new Proxy(new Data(), {
      get(target, className) {
        const data = new Data()
        data.instance = genInstanceConfig(className)
        return data
      }
    })
  }
}
