import should from 'should/as-function'
import Syncano from '../../src/syncano'
import {suffix, credentials} from './utils'

describe('Usage', function () {
  this.timeout(15000)

  let connection = null
  let Model = null
  let Instance = null
  const instanceName = suffix.getHyphened('Usage')

  before(() => {
    connection = Syncano(credentials.getCredentials())
    Instance = connection.Instance
    Model = connection.Usage

    return Instance.please().create({name: instanceName})
  })

  after(() => {
    return Instance.please().delete({name: instanceName})
  })

  describe('#please()', () => {
    it('should be able to get a Model', () => {
      return Model.please().get()
        .then(Model => {
          should(Model).have.property('links').which.is.Object()
          should(Model.links).have.property('hourly').which.is.String().equal('/v2/usage/hourly/')
          should(Model.links).have.property('daily').which.is.String().equal('/v2/usage/daily/')
        })
    })
  })
})
