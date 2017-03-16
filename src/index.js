import Server from './server'

const server = new Server()

const users = server.users
const account = server.account
const instance = server.instance
const event = server.event
const socket = server.socket
const logger = server.logger
const response = server.response
const data = server.data

export {
  users,
  account,
  instance,
  event,
  socket,
  logger,
  response,
  data,
  Server
}
