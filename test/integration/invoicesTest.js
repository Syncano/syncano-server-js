import should from 'should/as-function'
import Syncano from '../../src/syncano'
import {suffix, credentials, createCleaner} from './utils'

describe('Invoice', function () {
  this.timeout(15000)

  const cleaner = createCleaner()
  let connection = null
  let Model = null
  let Instance = null
  const instanceName = suffix.getHyphened('Invoice')

  before(() => {
    connection = Syncano(credentials.getCredentials())
    Instance = connection.Instance
    Model = connection.Invoice

    return Instance.please().create({name: instanceName})
  })

  after(() => {
    return Instance.please().delete({name: instanceName})
  })

  afterEach(() => {
    return cleaner.clean()
  })

  describe('#please()', () => {
    it('should be able to list Models', () => {
      return Model.please().list().then(Models => {
        should(Models).be.an.Array()
      })
    })
  })
})
