import Server from '../src'

const accountConnection = new Server({accountKey: process.env.E2E_ACCOUNT_KEY})

export const getRandomString = () => {
  return Math.random().toString(36).replace(/[^a-z]/g, '').substring(2, 12)
}

export const createTestInstance = instanceName => {
  return accountConnection.instance.create({name: instanceName})
}

export const deleteTestInstance = instanceName => {
  return accountConnection.instance.delete(instanceName)
}
