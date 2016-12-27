import should from 'should/as-function'
import Syncano from '../../src/syncano'
import {suffix, credentials, createCleaner} from './utils'

describe('Plan', function () {
  this.timeout(15000)

  const cleaner = createCleaner()
  let connection = null
  let Model = null
  let Instance = null
  const instanceName = suffix.getHyphened('Plan')

  before(() => {
    connection = Syncano(credentials.getCredentials())
    Instance = connection.Instance
    Model = connection.Plan

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

    it('should be able to get a Model', () => {
      return Model.please().get({ name: 'paid-commitment'}).then(Model => {
        should(Model).be.an.Object()
        should(Model).have.property('name').equal('paid-commitment')
        should(Model).have.property('options').which.is.Object()
        should(Model).have.property('pricing').which.is.Object()
        should(Model).have.property('links').which.is.Object()
      })
    })
  })
})
