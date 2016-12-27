import should from 'should/as-function'
import _ from 'lodash'
import Syncano from '../../src/syncano'
import {ValidationError} from '../../src/errors'
import {suffix, credentials, createCleaner} from './utils'

describe('Class', function () {
  this.timeout(15000)

  const cleaner = createCleaner()
  let connection = null
  let Model = null
  let Instance = null
  const instanceName = suffix.getHyphened('Class')
  const className = suffix.get('class')
  const data = {
    name: className,
    instanceName,
    description: 'test'
  }
  let objects = null

  before(() => {
    connection = Syncano(credentials.getCredentials())
    Instance = connection.Instance
    Model = connection.Class

    objects = [
      Model({name: `${className}_1`, instanceName}),
      Model({name: `${className}_2`, instanceName})
    ]

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
    should(Model({name: className}).save()).be.rejectedWith(/instanceName/)
  })

  it('should validate "name"', () => {
    should(Model({name: {}, instanceName}).save()).be.rejectedWith(/name/)
  })

  it('should validate "description"', () => {
    should(Model({name: {}, instanceName, description: 1337}).save()).be.rejectedWith(/description/)
  })

  it('should validate "schema"', () => {
    should(Model({name: {}, instanceName, schema: 1337}).save()).be.rejectedWith(/schema/)
  })

  it('should validate "group"', () => {
    should(Model({name: {}, instanceName, group: 'some_group'}).save()).be.rejectedWith(/group/)
  })

  it('should validate "group_permissions"', () => {
    should(Model({name: {}, instanceName, group_permissions: 'dunno'}).save()).be.rejectedWith(/group_permissions/)
  })

  it('should validate "other_permissions"', () => {
    should(Model({name: {}, instanceName, other_permissions: 'dunno'}).save()).be.rejectedWith(/other_permissions/)
  })

  it('should validate "metadata"', () => {
    should(Model({name: {}, instanceName, metadata: 'dunno'}).save()).be.rejectedWith(/metadata/)
  })

  it('should be able to save via model instance', () => {
    return Model(data).save()
      .then(cleaner.mark)
      .then(cls => {
        should(cls).be.a.Object()
        should(cls).have.property('name').which.is.String().equal(data.name)
        should(cls).have.property('instanceName').which.is.String().equal(data.instanceName)
        should(cls).have.property('description').which.is.String().equal(data.description)
        should(cls).have.property('created_at').which.is.Date()
        should(cls).have.property('updated_at').which.is.Date()
        should(cls).have.property('links').which.is.Object()
        should(cls).have.property('metadata').which.is.Object()
      })
  })

  it('should be able to update via model instance', () => {
    return Model(data).save()
      .then(cleaner.mark)
      .then(cls => {
        should(cls).have.property('name').which.is.String().equal(data.name)
        should(cls).have.property('instanceName').which.is.String().equal(data.instanceName)
        should(cls).have.property('description').which.is.String().equal(data.description)

        cls.description = 'new description'
        return cls.save()
      })
      .then(cls => {
        should(cls).have.property('name').which.is.String().equal(data.name)
        should(cls).have.property('instanceName').which.is.String().equal(data.instanceName)
        should(cls).have.property('description').which.is.String().equal('new description')
      })
  })

  it('should be able to delete via model instance', () => {
    return Model(data).save()
      .then(cls => {
        should(cls).have.property('name').which.is.String().equal(data.name)
        should(cls).have.property('instanceName').which.is.String().equal(data.instanceName)
        should(cls).have.property('description').which.is.String().equal(data.description)

        return cls.delete()
      })
  })

  describe('#please()', () => {
    it('should be able to list classes', () => {
      return Model.please().list({instanceName}).then(classes => {
        should(classes).be.an.Array()
      })
    })

    it('should be able to list classes as template', () => {
      return Model.please().create(data)
        .then(cleaner.mark)
        .then(() => {
          return Model.please().list({instanceName}).templateResponse('objects_html_table').then(response => {
            should(response).be.html()
          })
        })
    })

    it('should be able to create a class', () => {
      return Model.please().create(data)
        .then(cleaner.mark)
        .then(cls => {
          should(cls).be.a.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls).have.property('description').which.is.String()
          should(cls).have.property('created_at').which.is.Date()
          should(cls).have.property('updated_at').which.is.Date()
          should(cls).have.property('links').which.is.Object()
          should(cls).have.property('metadata').which.is.Object()
          should(cls).have.property('schema').which.is.Array()
        })
    })

    it('should be able to bulk create a classes', () => {
      const classes = [
        Model(data),
        Model(_.assign({}, data, {name: `${className}_1`}))
      ]

      return Model.please().bulkCreate(classes)
        .then(cleaner.mark)
        .then(cls => {
          should(cls).be.an.Array().with.length(2)
        })
    })

    it('should be able to get a class', () => {
      return Model.please().create(data)
        .then(cleaner.mark)
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)

          return cls
        })
        .then(() => {
          return Model
            .please()
            .get(data)
            .request()
        })
        .then(([cls, response]) => {
          should(response).be.an.Object()
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls).have.property('description').which.is.String()
          should(cls).have.property('created_at').which.is.Date()
          should(cls).have.property('updated_at').which.is.Date()
          should(cls).have.property('links').which.is.Object()
          should(cls).have.property('metadata').which.is.Object()
          should(cls).have.property('schema').which.is.Array()
        })
    })

    it('should be able to delete a class', () => {
      return Model.please().create(data)
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          return cls
        })
        .then(() => {
          return Model
            .please()
            .delete(data)
            .request()
        })
    })

    it('should be able to get or create a class (CREATE)', () => {
      return Model.please().getOrCreate({name: className, instanceName}, {description: 'test'})
        .then(cleaner.mark)
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls).have.property('description').which.is.String().equal('test')
          should(cls).have.property('created_at').which.is.Date()
          should(cls).have.property('updated_at').which.is.Date()
          should(cls).have.property('links').which.is.Object()
          should(cls).have.property('metadata').which.is.Object()
        })
    })

    it('should be able to get or create a class (GET)', () => {
      return Model.please().create({name: className, instanceName, description: 'test'})
        .then(cleaner.mark)
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls).have.property('description').which.is.String().equal('test')

          return Model.please().getOrCreate({name: className, instanceName}, {description: 'newTest'})
        })
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls.description).which.is.String().equal('test')
        })
    })

    it('should be able to update a class', () => {
      return Model.please().create({name: className, description: 'test', instanceName})
        .then(cleaner.mark)
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls).have.property('description').which.is.String().equal('test')

          return Model.please().update({name: className, instanceName}, {description: 'newTest'})
        })
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls.description).which.is.String().equal('newTest')
        })
    })

    it('should be able to update or create class (UPDATE)', () => {
      return Model.please().create({name: className, instanceName, description: 'test'})
        .then(cleaner.mark)
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls).have.property('description').which.is.String().equal('test')

          return Model.please().updateOrCreate({name: className, instanceName}, {description: 'newTest'})
        })
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls).have.property('description').which.is.String().equal('newTest')
        })
    })

    it('should be able to update or create class (CREATE)', () => {
      const properties = {name: className, instanceName}
      const object = {description: 'updateTest'}
      const defaults = {
        description: 'createTest',
        metadata: {test: 1}
      }

      return Model.please().updateOrCreate(properties, object, defaults)
        .then(cleaner.mark)
        .then(cls => {
          should(cls).be.an.Object()
          should(cls).have.property('name').which.is.String().equal(className)
          should(cls).have.property('instanceName').which.is.String().equal(instanceName)
          should(cls).have.property('description').which.is.String().equal('createTest')
          should(cls).have.property('created_at').which.is.Date()
          should(cls).have.property('updated_at').which.is.Date()
          should(cls).have.property('links').which.is.Object()
          should(cls).have.property('metadata').which.is.Object()
        })
    })

    it('should be able to get first class (SUCCESS)', () => {
      return Model.please().bulkCreate(objects)
        .then(cleaner.mark)
        .then(() => {
          return Model.please().first({instanceName})
        })
        .then(cls => {
          should(cls).be.an.Object()
        })
    })

    it('should be able to change page size', () => {
      return Model.please().bulkCreate(objects)
        .then(cleaner.mark)
        .then(classes => {
          should(classes).be.an.Array().with.length(2)
          return Model.please({instanceName}).pageSize(1)
        })
        .then(classes => {
          should(classes).be.an.Array().with.length(1)
        })
    })

    it('should be able to change ordering', () => {
      let asc = null

      return Model.please().bulkCreate(objects)
        .then(cleaner.mark)
        .then(classes => {
          should(classes).be.an.Array().with.length(2)
          return Model.please({instanceName}).ordering('asc')
        })
        .then(classes => {
          should(classes).be.an.Array().with.length(2)
          asc = classes
          return Model.please({instanceName}).ordering('desc')
        }).then(desc => {
          const ascNames = _.map(asc, 'name')
          const descNames = _.map(desc, 'name')
          descNames.reverse()

          should(desc).be.an.Array().with.length(2)

          _.forEach(ascNames, (ascName, index) => {
            should(ascName).be.equal(descNames[index])
          })
        })
    })

    it('should be able to get raw data', () => {
      return Model.please().list({instanceName}).raw().then(response => {
        should(response).be.a.Object()
        should(response).have.property('objects').which.is.Array()
        should(response).have.property('next').which.is.null()
        should(response).have.property('prev').which.is.null()
      })
    })
  })
})
