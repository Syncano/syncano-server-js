import nock from 'nock'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import should from 'should/as-function'
import Server from '../../src/server'
import FormData from 'form-data'

import {NotFoundError} from '../../src/errors'

chai.use(chaiAsPromised)
chai.should()

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
    api = nock(testUrl)
  })

  it('has #_query property', () => {
    should(data.tag)
      .have.property('query')
      .which.is.Object()
  })

  describe('#list()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('list')
        .which.is.Function()
    })

    it('should be able to fetch objects list', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({page_size: 10}) // eslint-disable-line camelcase
        .reply(200, {
          objects: [{name: 'John Doe', id: 3}],
          next: null
        })

      return data.users
        .take(10)
        .list()
        .then(objects => {
          should(objects)
            .be.Array()
            .length(1)
          should(objects)
            .have.propertyByPath(0, 'name')
            .which.is.String()
          should(objects)
            .have.propertyByPath(0, 'id')
            .which.is.Number()
        })
    })

    it('should return [] when no objects were not found', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({page_size: 5}) // eslint-disable-line camelcase
        .reply(200, {objects: [], next: null})

      return data.users
        .take(5)
        .list()
        .then(objects => {
          should(objects)
            .be.Array()
            .empty()
        })
    })
  })

  describe('#first()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('first')
        .which.is.Function()
    })

    it('should be able to fetch single object', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({page_size: 1}) // eslint-disable-line camelcase
        .reply(200, {objects: [{name: 'John Doe', id: 3}]})

      return data.users.first().should.become({name: 'John Doe', id: 3})
    })

    it('should return null when object was not found', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({page_size: 1}) // eslint-disable-line camelcase
        .reply(200, {objects: []})

      return data.users.first().should.become(null)
    })
  })

  describe('#firstOrFail()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('firstOrFail')
        .which.is.Function()
    })

    it('should be able to fetch single object', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({page_size: 1}) // eslint-disable-line camelcase
        .reply(200, {objects: [{name: 'John Doe', id: 3}]})

      return data.users.firstOrFail().should.become({name: 'John Doe', id: 3})
    })

    it('should throw error when object was not found', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({page_size: 1}) // eslint-disable-line camelcase
        .reply(404)

      return data.users.firstOrFail().should.rejectedWith(NotFoundError)
    })
  })

  describe('#firstOrCreate()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('firstOrCreate')
        .which.is.Function()
    })

    it('should be able to fetch single existing object', () => {
      const query = {username: 'john.doe'}
      const user = {name: 'John'}

      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          query: JSON.stringify({username: {_eq: 'john.doe'}}),
          page_size: 1 // eslint-disable-line camelcase
        })
        .reply(200, {objects: [{name: 'John Doe', id: 3}], next: null})

      return data.users
        .firstOrCreate(query, user)
        .should.become({name: 'John Doe', id: 3})
    })

    it('should create and return object when it was not found', () => {
      const query = JSON.stringify({username: {_eq: 'john.doe'}})
      const user = {username: 'john.doe', name: 'John'}

      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({query, page_size: 1})
        .reply(404)
        .post('/v2/instances/testInstance/classes/users/objects/', user)
        .query({query, page_size: 1})
        .reply(200, user)

      return data.users
        .firstOrCreate({username: user.username}, {name: user.name})
        .should.become({name: 'John', username: 'john.doe'})
    })
  })

  describe('#updateOrCreate()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('updateOrCreate')
        .which.is.Function()
    })

    it('should be able to update existing object', () => {
      const query = JSON.stringify({username: {_eq: 'john.doe'}})
      const user = {username: 'john.doe', name: 'John'}

      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({query, page_size: 1})
        .reply(200, {objects: [{name: 'John Doe', id: 3}], next: null})
        .post('/v2/instances/testInstance/classes/users/objects/', user)
        .query({query, page_size: 1})
        .reply(200, user)

      return data.users
        .updateOrCreate({username: user.username}, {name: user.name})
        .should.become({name: 'John', username: 'john.doe'})
    })

    it('should create object when it was not found', () => {
      const query = JSON.stringify({username: {_eq: 'john.doe'}})
      const user = {username: 'john.doe', name: 'John'}

      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({query, page_size: 1})
        .reply(404)
        .post('/v2/instances/testInstance/classes/users/objects/', user)
        .query({query, page_size: 1})
        .reply(200, user)

      return data.users
        .updateOrCreate({username: user.username}, {name: user.name})
        .should.become({name: 'John', username: 'john.doe'})
    })
  })

  describe('#find()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('find')
        .which.is.Function()
    })

    it('should be able to fetch single object', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          query: JSON.stringify({id: {_eq: 7}}),
          page_size: 1 // eslint-disable-line camelcase
        })
        .reply(200, {objects: [{name: 'John Doe', id: 7}]})

      return data.users.find(7).should.become({name: 'John Doe', id: 7})
    })

    it('should be able to fetch objects list', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          query: JSON.stringify({id: {_in: [7, 8]}})
        })
        .reply(200, {
          objects: [{name: 'John Doe', id: 7}, {name: 'Jane Doe', id: 8}],
          next: null
        })

      return data.users
        .find([7, 8])
        .should.become([{name: 'John Doe', id: 7}, {name: 'Jane Doe', id: 8}])
    })

    it('should return null when object was not found', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          query: JSON.stringify({id: {_eq: 5}}),
          page_size: 1 // eslint-disable-line camelcase
        })
        .reply(200, {objects: [], next: null})

      return data.users.find(5).should.become(null)
    })

    it('should return [] when no objects were found', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          query: JSON.stringify({id: {_in: [7, 8]}})
        })
        .reply(200, {objects: [], next: null})

      return data.users.find([7, 8]).should.become([])
    })
  })

  describe('#findOrFail()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('findOrFail')
        .which.is.Function()
    })

    it('should be able to fetch single object', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          query: JSON.stringify({id: {_eq: 7}}),
          page_size: 1 // eslint-disable-line camelcase
        })
        .reply(200, {objects: [{name: 'John Doe', id: 7}]})

      return data.users.find(7).should.become({name: 'John Doe', id: 7})
    })

    it('should be able to fetch objects list', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          query: JSON.stringify({id: {_in: [7, 8]}})
        })
        .reply(200, {
          objects: [{name: 'John Doe', id: 7}, {name: 'Jane Doe', id: 8}],
          next: null
        })

      return data.users
        .find([7, 8])
        .should.become([{name: 'John Doe', id: 7}, {name: 'Jane Doe', id: 8}])
    })

    it('should throw error when object was not found', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          page_size: 1, // eslint-disable-line camelcase
          query: JSON.stringify({id: {_eq: 5}})
        })
        .reply(404)

      return data.users.findOrFail(5).should.be.rejectedWith(NotFoundError)
    })
  })

  describe('#take()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('take')
        .which.is.Function()
    })

    it('should add page_size parameter to the query', () => {
      const query = data.users.take(7)

      should(query)
        .have.propertyByPath('query', 'page_size')
        .which.is.equal(7)
    })
  })

  describe('#orderBy()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('orderBy')
        .which.is.Function()
    })

    it('should add order_by parameter to the query', () => {
      const query = data.users.orderBy('name', 'DESC')

      should(query)
        .have.propertyByPath('_query', 'order_by')
        .equal('-name')
    })
  })

  describe('#where()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('where')
        .which.is.Function()
    })

    it('should add query parameter to the query', () => {
      const query = data.users.where('name', 'John')

      should(query)
        .have.propertyByPath('_query', 'query')
        .which.is.String()
    })
  })

  describe('#with()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('with')
        .which.is.Function()
    })

    it('should add query parameter to the query', () => {
      const query = data.users.with('posts')

      should(query)
        .have.propertyByPath('_relationships', 0)
        .which.is.String()
    })

    it('should extend reference with object', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/posts/objects/`)
        .reply(200, {
          objects: [
            {
              title: 'Awesome post',
              author: {
                value: 1,
                target: 'user'
              }
            }
          ]
        })
        .get(`/v2/instances/${instanceName}/users/`)
        .query({
          query: JSON.stringify({id: {_in: [1]}})
        })
        .reply(200, {objects: [{id: 1, name: 'John'}]})

      return data.posts
        .with('author')
        .list()
        .should.become([
          {
            title: 'Awesome post',
            author: {
              id: 1,
              name: 'John'
            }
          }
        ])
    })
  })

  describe('#create()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('create')
        .which.is.Function()
    })

    it('should be able to create object', () => {
      const user = {name: 'John'}

      api
        .post('/v2/instances/testInstance/classes/users/objects/', user)
        .reply(200, user)

      return data.users.create(user).should.become({name: 'John'})
    })

    it('should be able to create multiple single objects', () => {
      const users = [{name: 'John'}, {name: 'Jane'}]

      api
        .post(`/v2/instances/${instanceName}/batch/`, {
          requests: [
            {
              method: 'POST',
              path: `/v2/instances/${instanceName}/classes/users/objects/`,
              body: JSON.stringify({name: 'John'})
            },
            {
              method: 'POST',
              path: `/v2/instances/${instanceName}/classes/users/objects/`,
              body: JSON.stringify({name: 'Jane'})
            }
          ]
        })
        .reply(200, users)

      return data.users
        .create(users)
        .should.become([[{name: 'John'}, {name: 'Jane'}]])
    })

    it('should be able to create object from FormData', () => {
      const user = new FormData()

      user.append('name', 'John')

      api
        .post('/v2/instances/testInstance/classes/users/objects/', body =>
          body.includes('name')
        )
        .reply(200, {name: 'John'})

      return data.users.create(user).should.become({name: 'John'})
    })
  })

  describe('#update()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('update')
        .which.is.Function()
    })

    it('should be able to update object by id', () => {
      const id = 9900
      const user = {first_name: 'Jane'}

      api
        .patch(`/v2/instances/${instanceName}/classes/users/objects/${id}/`)
        .reply(200, {id, ...user})

      return data.users.update(id, user).should.become({id, ...user})
    })

    it('should be able to update multiple objects', () => {
      const users = [[1, {name: 'Jane'}], [2, {name: 'John'}]]

      api
        .post(`/v2/instances/${instanceName}/batch/`, {
          requests: [
            {
              method: 'PATCH',
              path: `/v2/instances/${instanceName}/classes/users/objects/1/`,
              body: JSON.stringify({name: 'Jane'})
            },
            {
              method: 'PATCH',
              path: `/v2/instances/${instanceName}/classes/users/objects/2/`,
              body: JSON.stringify({name: 'John'})
            }
          ]
        })
        .reply(200, [{name: 'Jane'}, {name: 'John'}])

      return data.users
        .update(users)
        .should.become([[{name: 'Jane'}, {name: 'John'}]])
    })

    it('should be able to update objects by query', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          query: JSON.stringify({likes: {_gt: 100}})
        })
        .reply(200, {objects: [{likes: 200, id: 1}], next: null})
        .post(`/v2/instances/${instanceName}/batch/`, {
          requests: [
            {
              method: 'PATCH',
              path: `/v2/instances/${instanceName}/classes/users/objects/1/`,
              body: JSON.stringify({status: 'liked'})
            }
          ]
        })
        .reply(200, [1])

      return data.users
        .where('likes', '>', 100)
        .update({status: 'liked'})
        .should.become([[1]])
    })
  })

  describe('#delete()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('delete')
        .which.is.Function()
    })

    it('should be able to delete object by id', () => {
      const id = 9900

      api
        .delete(`/v2/instances/${instanceName}/classes/users/objects/${id}/`)
        .reply(200, {id})

      return data.users.delete(id).should.become({id})
    })

    it('should be able to delete objects by array of ids', () => {
      const ids = [1, 2]

      api
        .post(`/v2/instances/${instanceName}/batch/`, {
          requests: [
            {
              method: 'DELETE',
              path: `/v2/instances/${instanceName}/classes/users/objects/1/`
            },
            {
              method: 'DELETE',
              path: `/v2/instances/${instanceName}/classes/users/objects/2/`
            }
          ]
        })
        .reply(200, ids)

      return data.users.delete(ids).should.become([[1, 2]])
    })

    it('should be able to delete objects by query', () => {
      const ids = [1, 4]

      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({
          query: JSON.stringify({likes: {_gt: 100}})
        })
        .reply(200, {
          objects: [{likes: 200, id: 1}, {likes: 300, id: 4}],
          next: null
        })
        .post(`/v2/instances/${instanceName}/batch/`, {
          requests: [
            {
              method: 'DELETE',
              path: `/v2/instances/${instanceName}/classes/users/objects/1/`
            },
            {
              method: 'DELETE',
              path: `/v2/instances/${instanceName}/classes/users/objects/4/`
            }
          ]
        })
        .reply(200, ids)

      return data.users
        .where('likes', '>', 100)
        .delete()
        .should.become([[1, 4]])
    })
  })

  describe('#fields()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('fields')
        .which.is.Function()
    })

    it('should be able to whitelist fields', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .reply(200, {objects: [{name: 'John', id: 2}]})

      return data.users
        .fields('name')
        .list()
        .should.become([{name: 'John'}])
    })

    it('should be able to map field names', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .reply(200, {objects: [{name: 'John', id: 2}]})

      return data.users
        .fields('name as author')
        .list()
        .should.become([{author: 'John'}])
    })
  })

  describe('#pluck()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('pluck')
        .which.is.Function()
    })

    it('should be able to take column values', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .reply(200, {objects: [{name: 'John', id: 2}, {name: 'Jane', id: 3}]})

      return data.users.pluck('name').should.become(['John', 'Jane'])
    })
  })

  describe('#value()', () => {
    it('should be a method of the model', () => {
      should(data.users)
        .have.property('value')
        .which.is.Function()
    })

    it('should be able to take column value of single record', () => {
      api
        .get(`/v2/instances/${instanceName}/classes/users/objects/`)
        .query({page_size: 1})
        .reply(200, {objects: [{name: 'John', id: 2}]})

      return data.users.value('name').should.become('John')
    })
  })
})
