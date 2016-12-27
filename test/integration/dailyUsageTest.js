import should from 'should/as-function'
import Syncano from '../../src/syncano'
import {suffix, credentials} from './utils'

describe('DailyUsage', function () {
  this.timeout(15000)

  let connection = null
  let Model = null
  let Instance = null
  const instanceName = suffix.getHyphened('Usage')

  before(() => {
    connection = Syncano(credentials.getCredentials())
    Instance = connection.Instance
    Model = connection.DailyUsage

    return Instance.please().create({name: instanceName})
  })

  after(() => {
    return Instance.please().delete({name: instanceName})
  })
  describe('#please()', () => {
    it('should be able to list Models', () => {
      return Model.please().list().then(Models => {
        should(Models).be.an.Array()
      })
    })
  })
})
