import should from 'should/as-function'
import Syncano from '../../src/syncano'
import {suffix, credentials, createCleaner} from './utils'

describe('Subscription', function () {
  this.timeout(15000)

  const cleaner = createCleaner()
  let connection = null
  let Model = null
  let Instance = null
  const instanceName = suffix.getHyphened('Subscription')

  before(() => {
    connection = Syncano(credentials.getCredentials())
    Instance = connection.Instance
    Model = connection.Subscription

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
      return Model.please().list().then(Models => {
        return Model.please().get({id: Models[0].id })
      })
      .then(Model => {
        should(Model).have.property('id').which.is.Number()
        should(Model).have.property('start').which.is.String()
        should(Model).have.property('end').which.is.String()
        should(Model).have.property('commitment').which.is.Object()
        should(Model).have.property('pricing').which.is.Object()
        should(Model).have.property('plan').which.is.String().equal('builder')
      })
    })
  })
})
