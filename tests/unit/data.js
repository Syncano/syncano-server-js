import nock from 'nock'
import should from 'should/as-function'
import Server from '../../src/server'

import {NotFoundError} from '../../src/errors'

describe('Data', () => {
  const testUrl = 'https://api.syncano.rocks'
  const instanceName = 'testInstance'
  let data = null
  let api = null

  beforeEach(() => {
    const server = new Server({
      token: 'testKey',
      instanceName
    })
    data = server.data
    api = nock(testUrl).filteringRequestBody(() => '*')
  })

  it('has #_query property', () => {
    should(data.tag).have.property('query').which.is.Object()
  })

  describe('#list()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('list').which.is.Function()
    })

    it('should be able to fetch objects list', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({page_size: 10}) // eslint-disable-line camelcase
        .reply(200, {
          objects: [{name: 'John Doe', id: 3}],
          next: null
        })

      data.users.take(10).list().then(objects => {
        should(objects).be.Array().length(1)
        should(objects).have.propertyByPath(0, 'name').which.is.String()
        should(objects).have.propertyByPath(0, 'id').which.is.Number()
      })
    })

    it('should return [] when no objects were not found', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({page_size: 5}) // eslint-disable-line camelcase
        .reply(200, {objects: [], next: null})

      data.users.take(5).list().then(objects => {
        should(objects).be.Array().empty()
      })
    })
  })

  describe('#first()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('first').which.is.Function()
    })

    it('should be able to fetch single object', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({page_size: 1}) // eslint-disable-line camelcase
        .reply(200, {objects: [{name: 'John Doe', id: 3}]})

      data.users.first().then(object => {
        should(object).be.Object()
        should(object).have.property('name').which.is.String()
        should(object).have.property('id').which.is.Number()
      })
    })

    it('should return null when object was not found', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({page_size: 1}) // eslint-disable-line camelcase
        .reply(200, {objects: []})

      data.users.first().then(object => should(object).be.null())
    })
  })

  describe('#firstOrFail()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('firstOrFail').which.is.Function()
    })

    it('should be able to fetch single object', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({page_size: 1}) // eslint-disable-line camelcase
        .reply(200, {objects: [{name: 'John Doe', id: 3}]})

      data.users.firstOrFail().then(object => {
        should(object).be.Object()
        should(object).have.property('name').which.is.String()
        should(object).have.property('id').which.is.Number()
      })
    })

    it('should throw error when object was not found', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({page_size: 1}) // eslint-disable-line camelcase
        .reply(404)

      should(data.users.firstOrFail()).rejectedWith(NotFoundError)
    })
  })

  describe('#find()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('find').which.is.Function()
    })

    it('should be able to fetch single object', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          query: JSON.stringify({id: {_eq: 7}}),
          page_size: 1 // eslint-disable-line camelcase
        })
        .reply(200, {objects: [{name: 'John Doe', id: 7}]})

      data.users.find(7).then(object => {
        should(object).be.Object()
        should(object).have.property('name').which.is.String()
        should(object).have.property('id').which.is.Number()
      })
    })

    it('should be able to fetch objects list', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          query: JSON.stringify({id: {_in: [7, 8]}})
        })
        .reply(200, {objects: [
          {name: 'John Doe', id: 7},
          {name: 'Jane Doe', id: 8}
        ], next: null})

      data.users.find([7, 8]).then(objects => {
        should(objects).be.Array().length(2)
        should(objects).have.propertyByPath(0, 'name').which.is.String()
        should(objects).have.propertyByPath(0, 'id').which.is.Number()
        should(objects).have.propertyByPath(1, 'name').which.is.String()
        should(objects).have.propertyByPath(1, 'id').which.is.Number()
      })
    })

    it('should return null when object was not found', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          query: JSON.stringify({id: {_eq: 5}}),
          page_size: 1 // eslint-disable-line camelcase
        })
        .reply(200, {objects: [], next: null})

      data.users.find(5).then(object => should(object).be.null())
    })

    it('should return [] when no objects were found', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          query: JSON.stringify({id: {_in: [7, 8]}})
        })
        .reply(200, {objects: [], next: null})

      data.users.find([7, 8]).then(objects => should(objects).be.Array().empty())
    })
  })

  describe('#findOrFail()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('findOrFail').which.is.Function()
    })

    it('should be able to fetch single object', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          query: JSON.stringify({id: {_eq: 7}}),
          page_size: 1 // eslint-disable-line camelcase
        })
        .reply(200, {objects: [{name: 'John Doe', id: 7}]})

      data.users.find(7).then(object => {
        should(object).be.Object()
        should(object).have.property('name').which.is.String()
        should(object).have.property('id').which.is.Number()
      })
    })

    it('should be able to fetch objects list', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          query: JSON.stringify({id: {_in: [7, 8]}})
        })
        .reply(200, {objects: [
          {name: 'John Doe', id: 7},
          {name: 'Jane Doe', id: 8}
        ], next: null})

      data.users.find([7, 8]).then(objects => {
        should(objects).be.Array().length(2)
        should(objects).have.propertyByPath(0, 'name').which.is.String()
        should(objects).have.propertyByPath(0, 'id').which.is.Number()
        should(objects).have.propertyByPath(1, 'name').which.is.String()
        should(objects).have.propertyByPath(1, 'id').which.is.Number()
      })
    })

    it('should throw error when object was not found', () => {
      api.get(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          page_size: 1, // eslint-disable-line camelcase
          query: JSON.stringify({id: {_eq: 5}})
        })
        .reply(404)

      should(data.users.findOrFail(5)).rejectedWith(NotFoundError)
    })
  })

  describe('#take()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('take').which.is.Function()
    })

    it('should add page_size parameter to the query', () => {
      const query = data.users.take(7)

      should(query).have.propertyByPath('query', 'page_size').which.is.equal(7)
    })
  })

  describe('#orderBy()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('orderBy').which.is.Function()
    })

    it('should add order_by parameter to the query', () => {
      const query = data.users.orderBy('name', 'DESC')

      should(query).have.propertyByPath('_query', 'order_by').equal('-name')
    })
  })

  describe('#where()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('where').which.is.Function()
    })

    it('should add query parameter to the query', () => {
      const query = data.users.where('name', 'John')

      should(query).have.propertyByPath('_query', 'query').which.is.String()
    })
  })

  describe('#with()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('with').which.is.Function()
    })

    it('should add query parameter to the query', () => {
      const query = data.users.with('posts')

      should(query).have.propertyByPath('_relationships', 0).which.is.String()
    })
  })

  describe('#create()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('create').which.is.Function()
    })

    it('should be able to create object', () => {
      const user = {name: 'John'}

      api.post(`/v2/instances/${instanceName}/classes/users/objects/`, '*')
        .query(user)
        .reply(200, user)

      data.users.create(user).then(object => {
        should(object).be.Object()
        should(object).have.property('name').equal('John')
      })
    })
  })

  describe('#update()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('update').which.is.Function()
    })

    it('should be able to update object by id', () => {
      const id = 9900
      const firstName = 'Jane'

      api.patch(`/v2/instances/${instanceName}/classes/users/objects/${id}/`, '*')
        .query({id})
        .reply(200, {id, first_name: firstName}) // eslint-disable-line camelcase

      data.users.update(id, {
        first_name: 'Jane' // eslint-disable-line camelcase
      }).then(object => {
        should(object).be.Object()
        should(object).have.property('id').equal(id)
        should(object).have.property('first_name').equal(firstName)
      })
    })
  })

  describe('#delete()', () => {
    it('should be a method of the model', () => {
      should(data.users).have.property('delete').which.is.Function()
    })

    it('should be able to delete object by id', () => {
      const id = 9900

      api.delete(`/v2/instances/${instanceName}/classes/users/objects/${id}/`, '*')
        .query({id})
        .reply(200, {id})

      data.users.delete(id).then(object => {
        should(object).be.Object()
        should(object).have.property('id').equal(id)
      })
    })
  })
})
