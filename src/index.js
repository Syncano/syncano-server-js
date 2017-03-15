import server from './server'

const initializedServer = server()

const users = initializedServer.users
const account = initializedServer.account
const instance = initializedServer.instance
const event = initializedServer.event
const socket = initializedServer.socket
const logger = initializedServer.logger
const response = initializedServer.response
const data = initializedServer.data

export {
  users,
  account,
  instance,
  event,
  socket,
  logger,
  response,
  data,
  server
}
