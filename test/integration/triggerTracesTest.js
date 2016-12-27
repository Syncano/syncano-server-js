import should from 'should/as-function'
import Syncano from '../../src/syncano'
import {ValidationError} from '../../src/errors'
import {suffix, credentials} from './utils'

describe.skip('TriggerTrace', function () {
  this.timeout(15000)

  let connection = null
  let Instance = null
  let Model = null
  const instanceName = suffix.getHyphened('script')
  const scriptName = suffix.get('script')
  const className = suffix.get('class')
  const triggerData = {
    instanceName,
    label: 'my trigger',
    description: 'my description',
    signal: 'post_create',
    class: className
  }
  const classData = {
    name: className,
    instanceName,
    description: 'test'
  }
  const data = {
    instanceName,
    triggerId: null,
    id: null
  }

  before(() => {
    connection = Syncano(credentials.getCredentials())
    Instance = connection.Instance
    Model = connection.TriggerTrace

    return Instance.please().create({name: instanceName}).then(() => {
      return connection.Script.please().create({
        instanceName,
        label: scriptName,
        runtime_name: 'python_library_v4.2',
        source: 'print "x"'
      }).then(script => {
        triggerData.script = script.id
        return connection.Class(classData).save()
      }).then(() => {
        return connection.Trigger(triggerData).save()
      }).then(trigger => {
        data.triggerId = trigger.id
        return connection.DataObject({instanceName, className}).save()
      }).then(() => {
        return Model.please().first(data)
      }).then(trace => {
        data.id = trace.id
      })
    })
  })

  after(() => {
    return Instance.please().delete({name: instanceName})
  })

  it('should be validated', () => {
    should(Model().save()).be.rejectedWith(ValidationError)
  })

  it('should require "instanceName"', () => {
    should(Model({triggerId: 1}).save()).be.rejectedWith(/instanceName/)
  })

  it('should require "triggerId"', () => {
    should(Model({instanceName}).save()).be.rejectedWith(/triggerId/)
  })

  describe('#please()', () => {
    it('should be able to list objects', () => {
      return Model.please().list(data).then(objects => {
        should(objects).be.an.Array()
      })
    })

    it('should be able to get an object', () => {
      return Model.please().get(data).then(object => {
        should(object).be.a.Object()
        should(object).have.property('id').which.is.Number()
        should(object).have.property('status').which.is.String()
        should(object).have.property('instanceName').which.is.String().equal(data.instanceName)
        should(object).have.property('triggerId').which.is.Number().equal(data.triggerId)
        should(object).have.property('executed_at').which.is.Date()
        should(object).have.property('duration').which.is.Number()
        should(object).have.property('links').which.is.Object()
        should(object).have.property('result').which.is.Object()
      })
    })

    it('should be able to get first object (SUCCESS)', () => {
      return Model.please().first(data).then(object => {
        should(object).be.an.Object()
      })
    })

    it('should be able to change page size', () => {
      return Model.please(data).pageSize(1).then(objects => {
        should(objects).be.an.Array().with.length(1)
      })
    })

    it('should be able to get raw data', () => {
      return Model.please().list(data).raw().then(response => {
        should(response).be.a.Object()
        should(response).have.property('objects').which.is.Array()
        should(response).have.property('next').which.is.null()
        should(response).have.property('prev').which.is.null()
      })
    })
  })
})
