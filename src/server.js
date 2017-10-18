import Data from './data'
import Users from './users'
import Account from './account'
import Instance from './instance'
import Event from './event'
import Socket from './socket'
import Response from './response'
import Logger from './logger'
import Channel from './channel'
import Class from './class'
import Settings from './settings'
import Validator from 'syncano-validator'

const server = (ctx = {}) => {
  ctx.args = ctx.args || {}
  ctx.meta = ctx.meta || {}
  ctx.meta.metadata = ctx.meta.metadata || {}

  const settings = new Settings(ctx)
  const getConfig = className => Object.assign({className}, settings)
  const config = getConfig()

  const response = new Response(config)

  validateParameters(ctx, response)

  return {
    _class: new Class(config),
    users: new Users(config),
    event: new Event(config),
    channel: new Channel(config),
    socket: new Socket(config),
    response,
    account: new Account(config),
    instance: new Instance(config),
    logger: new Logger(config),
    data: new Proxy(new Data(settings), {
      get(target, className) {
        return new Data(getConfig(className))
      }
    })
  }

  function validateParameters(ctx, response) {
    const validator = new Validator(ctx)

    validator.validateRequest().catch(err => {
      response.json(
        {
          message: err
        },
        400
      )

      process.exit(0)
    })
  }
}

export default server
