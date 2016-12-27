import should from 'should/as-function'
import Syncano from '../../src/syncano'
import {ValidationError} from '../../src/errors'
import {suffix, credentials, createCleaner} from './utils'

describe('Socket', function () {
  this.timeout(15000)

  const cleaner = createCleaner()
  let connection = null
  let Model = null
  let Instance = null
  const instanceName = suffix.getHyphened('Socket')
  const name = suffix.get('socket')
  const installUrl = 'https://raw.githubusercontent.com/Syncano/custom-socket-test/master/socket.yml'
  const data = {
    instanceName,
    name,
    zip_file: Syncano.file(`${__dirname}/files/socket.zip`)
  }

  before(() => {
    connection = Syncano(credentials.getCredentials())
    Instance = connection.Instance
    Model = connection.Socket

    return Instance.please().create({name: instanceName})
  })

  after(() => {
    return Instance.please().delete({name: instanceName})
  })

  afterEach(() => {
    return cleaner.clean()
  })

  it('should be validated', () => {
    should(Model().save()).be.rejectedWith(ValidationError)
  })

  it('should require "instanceName"', () => {
    should(Model({}).save()).be.rejectedWith(/instanceName/)
  })

  it('should require "name"', () => {
    should(Model({ instanceName }).save()).be.rejectedWith(/name/)
  })

  it('should validate "zip_file"', () => {
    should(Model({ instanceName, name, zip_file: ''}).save()).be.rejectedWith(/zip_file/)
  })

  it('should be able to save via model instance', () => {
    return Model(data).save()
      .then(cleaner.mark)
      .then(socket => {
        should(socket).be.an.Object()
        should(socket).have.property('instanceName').which.is.String().equal(instanceName)
        should(socket).have.property('name').which.is.String().equal(name)
        should(socket).have.property('status').which.is.String()
        should(socket).have.property('status_info').which.is.String()
        should(socket).have.property('links').which.is.Object()
        should(socket).have.property('config').which.is.Object()
        should(socket).have.property('metadata').which.is.Object()
        should(socket).have.property('zip_file').which.is.String()
      })
  })

  it('should be able to delete via model instance', () => {
    return Model(data).save()
      .then(socket => {
        return socket.delete()
      })
  })

  describe('#please()', () => {
    it('should be able to list Models', () => {
      return Model.please().list({instanceName}).then(Models => {
        should(Models).be.an.Array()
      })
    })

    it('should be able to create a Model', () => {
      return Model.please().create(data)
        .then(cleaner.mark)
        .then(socket => {
          should(socket).be.an.Object()
          should(socket).have.property('instanceName').which.is.String().equal(instanceName)
          should(socket).have.property('name').which.is.String().equal(name)
          should(socket).have.property('status').which.is.String()
          should(socket).have.property('status_info').which.is.String()
          should(socket).have.property('links').which.is.Object()
          should(socket).have.property('config').which.is.Object()
          should(socket).have.property('metadata').which.is.Object()
          should(socket).have.property('zip_file').which.is.String()
        })
    })

    it.skip('should be able to install socket from url', () => {
      return Model.please().installFromUrl({instanceName}, 'mysocket', installUrl)
        .then(socket => {
          should(socket).be.an.Object()
          should(socket).have.property('instanceName').which.is.String().equal(instanceName)
          should(socket).have.property('name').which.is.String().equal(name)
          should(socket).have.property('status').which.is.String()
          should(socket).have.property('status_info').which.is.String()
          should(socket).have.property('links').which.is.Object()
          should(socket).have.property('config').which.is.Object()
          should(socket).have.property('metadata').which.is.Object()
          should(socket).have.property('zip_file').which.is.String()
        })
    })

    it('should be able to delete a Model', () => {
      return Model.please().create(data)
        .then(socket => {
          return Model.please().delete(socket)
        })
    })

    it('should be able to get a Model', () => {
      return Model.please().create(data)
        .then(cleaner.mark)
        .then(socket => {
          return Model.please().get(socket)
        })
        .then(socket => {
          should(socket).be.an.Object()
          should(socket).have.property('instanceName').which.is.String().equal(instanceName)
          should(socket).have.property('name').which.is.String().equal(name)
          should(socket).have.property('status').which.is.String()
          should(socket).have.property('status_info').which.is.String()
          should(socket).have.property('links').which.is.Object()
          should(socket).have.property('config').which.is.Object()
          should(socket).have.property('metadata').which.is.Object()
          should(socket).have.property('zip_file').which.is.String()
        })
    })
  })
})
