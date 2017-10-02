import nock from 'nock'
import Server from '../../src'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
chai.should()

describe('Channel', () => {
  const instanceName = 'testInstance'
  let api
  let channel

  beforeEach(() => {
    const server = new Server({
      token: 'testKey',
      instanceName
    })
    channel = server.channel
    api = nock('https://api.syncano.rocks')
  })

  describe('#publish', () => {
    it('should be able to publish new event', () => {
      api
        .post(`/v2/instances/${instanceName}/channels/default/publish/`, {
          room: 'add_user',
          payload: {
            name: 'John'
          }
        })
        .matchHeader('x-api-key', 'testKey')
        .reply(200)

      return channel.publish('add_user', {name: 'John'}).should.be.fulfilled
    })
  })
})
