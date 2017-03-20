import Server from './server'

export const {
  users,
  account,
  instance,
  channel,
  event,
  socket,
  logger,
  response,
  data
} = new Server()

export default Server
