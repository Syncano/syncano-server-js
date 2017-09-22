import should from 'should/as-function'
import Event from '../../src/event'
import {getRandomString} from '../utils'

describe('Event', () => {
  const socketName = getRandomString()
  const signalName = getRandomString()

  it('_splitSignal properly spliting signalString with socket', () => {
    const {socket, signal} = Event._splitSignal(`${socketName}.${signalName}`)
    should(socket).be.equal(socketName)
    should(signal).be.equal(signalName)
  })

  it('_splitSignal properly spliting signalString without socket', () => {
    const {socket, signal} = Event._splitSignal(`${signalName}`)
    should(socket).be.undefined
    should(signal).be.equal(signalName)
  })
})
