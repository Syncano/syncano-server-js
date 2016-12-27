import should from 'should/as-function'
import nock from 'nock'
import Syncano from '../../src/syncano'
import Instance from '../../src/models/instance'
import {ValidationError} from '../../src/errors'
import {instanceName, testEndpoint, testBaseUrl, testName} from './utils'

describe('Meta', () => {
  let model = null
  let meta = null

  beforeEach(() => {
    model = Syncano().Instance({ name: instanceName })
    meta = model.getMeta()
  })

  describe('#resolveEndpointPath()', () => {
    it('is a function of the "meta" property', () => {
      should(meta).have.property('resolveEndpointPath').which.is.Function()
    })

    it('should throw error when endpoint is not found', () => {
      should(meta.resolveEndpointPath(testEndpoint, model)).be.rejectedWith(/endpoint/)
    })

    it('should throw error when path properties are missing', () => {
      should(meta.resolveEndpointPath('detail', null)).be.rejectedWith(/path properties/)
    })

    it('shoud return path', () => {
      const path = meta.resolveEndpointPath('detail', model)
      should(path).equal(`/v2/instances/${instanceName}/`)
    })
  })

  describe('#findAllowedMethod()', () => {
    it('is a function of the "meta" property', () => {
      should(meta).have.property('findAllowedMethod').which.is.Function()
    })

    it('should throw error when unsupported methods are passed', () => {
      should(meta.findAllowedMethod('list', 'UPDATE')).be.rejectedWith(/Unsupported/)
    })

    it('should return supported method', () => {
      const method = meta.findAllowedMethod('list', 'GET')
      should(method).equal('get')
    })
  })
})

describe('Model', () => {
  let model = null
  let modelSingle = null
  let api = null

  beforeEach(() => {
    model = Syncano({ name: instanceName, baseUrl: testBaseUrl }).Instance
    modelSingle = Instance
    api = nock(testBaseUrl)
            .filteringRequestBody(() => {
              return '*'
            })
  })

  describe('#please()', () => {
    it('should be a method of the model', () => {
      should(model).have.property('please').which.is.Function()
    })

    it('should return QuerySet object', () => {
      const qs = model.please()
      should(qs).be.type('object')
    })
  })

  describe('#isNew()', () => {
    it('should be a method of the model', () => {
      should(modelSingle()).have.property('isNew').which.is.Function()
    })

    it('should return true if no "links" property is fond on the model', () => {
      should(modelSingle().isNew()).equal(true)
    })

    it('should return false if "links" property is fond on the model', () => {
      should(modelSingle({ links: {} }).isNew()).equal(false)
    })
  })

  describe('#validate()', () => {
    it('should be a method of the model', () => {
      should(modelSingle()).have.property('validate').which.is.Function()
    })

    it('should enable validation', () => {
      should(modelSingle.setConstraints({})().validate()).not.be.ok()
      should(modelSingle().validate()).have.property('name').which.is.Array()
      should(modelSingle({ name: testName}).validate()).not.be.ok()
    })
  })

  describe('#save()', () => {
    it('should be a method of the model', () => {
      should(modelSingle()).have.property('save').which.is.Function()
    })

    it('should check if required data is present', () => {
      should(modelSingle().save()).rejectedWith(ValidationError)
    })

    it('should save model', () => {
      api.post('/v2/instances/', '*').reply(201, {
        name: instanceName,
        links: {}
      })

      model({name: instanceName}).save().then(instance => {
        should(instance).be.an.Object()
        should(instance).have.property('name').which.is.String().equal(instanceName)
      })
    })

    it.skip('should update model', () => {
      api.put(`/v2/instances/${instanceName}/`, '*').reply(201, {
        name: instanceName,
        links: {}
      })

      model({name: instanceName, links: {a: 1}}).save().then(instance => {
        should(instance).be.an.Object()
        should(instance).have.property('name').which.is.String().equal(instanceName)
      })
    })

    it('should throw error when server response is error', () => {
      api.post('/v2/instances/', '*').reply(404)
      should(model({name: instanceName}).save()).rejectedWith(Error)
    })
  })

  describe('#delete()', () => {
    it('should be a method of the model', () => {
      should(modelSingle()).have.property('delete').which.is.Function()
    })

    it.skip('should delete model record', () => {
      api.delete(`/v2/instances/${instanceName}/`, '*').reply(204)
      should(model({name: instanceName}).delete()).be.fulfilled()
    })

    it('should throw error when server response is error', () => {
      api.delete(`/v2/instances/${instanceName}/`, '*').reply(404)
      should(model({name: instanceName}).delete()).rejectedWith(Error)
    })
  })
})
