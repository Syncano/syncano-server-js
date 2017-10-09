import nock from 'nock'
import Server from '../../src'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import should from 'should/as-function'
import Event from '../../src/event'
import {getRandomString} from '../utils'

chai.use(chaiAsPromised)
chai.should()

describe('Event', () => {
  const instanceName = 'testInstance'
  let api
  let event

  beforeEach(() => {
    const server = new Server({
      token: 'testKey',
      instanceName,
      socket: 'test_socket'
    })
    event = server.event
    api = nock('https://api.syncano.rocks')
  })

  describe('#emit', () => {
    it('should be able to emit event with custom socket name', () => {
      api
        .post(`/v2/instances/${instanceName}/triggers/emit/`, {
          signal: 'socket_name.email_sent'
        })
        .reply(200)

      return event.emit('socket_name.email_sent')
    })

    it('should be able to emit event with environment socket name', () => {
      api
        .post(`/v2/instances/${instanceName}/triggers/emit/`, {
          signal: 'test_socket.email_sent'
        })
        .reply(200)

      return event.emit('email_sent')
    })
  })

  describe('_splitSignal', () => {
    const socketName = getRandomString()
    const signalName = getRandomString()

    it('_splitSignal properly spliting signalString with socket', () => {
      const {socket, signal} = Event._splitSignal(`${socketName}.${signalName}`)
      should(socket).be.equal(socketName)
      should(signal).be.equal(signalName)
    })

    it('_splitSignal properly spliting signalString without socket', () => {
      const {socket, signal} = Event._splitSignal(`${signalName}`)
      should(socket).be.undefined()
      should(signal).be.equal(signalName)
    })
  })
})
