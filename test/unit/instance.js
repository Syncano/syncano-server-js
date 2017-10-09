import nock from 'nock'
import Server from '../../src'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
chai.should()

describe('Instance', () => {
  const instanceName = 'testInstance'
  let api
  let instance

  beforeEach(() => {
    const server = new Server({
      token: 'testKey',
      instanceName
    })
    instance = server.instance
    api = nock('https://api.syncano.rocks')
  })

  describe('#create', () => {
    it('should create syncano instance', () => {
      api.post(`/v2/instances/`, {name: 'my-insta'}).reply(200)

      return instance.create({name: 'my-insta'}).should.be.fulfilled
    })
  })

  describe('#delete', () => {
    it('should delete syncano instance', () => {
      api.delete(`/v2/instances/my-insta/`).reply(200)

      return instance.delete('my-insta').should.be.fulfilled
    })
  })
})
