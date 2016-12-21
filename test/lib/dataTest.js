import nock from 'nock';
import should from 'should/as-function';
import Syncano from 'syncano'
import SyncanoORM from '../../src';

import { NotFoundError } from '../../src/errors';

describe('Data', function() {
  const testUrl = 'https://api.syncano.rocks';
  const instanceName = 'testInstance';
  let instance = null;
  let data = null;
  let api = null;

  beforeEach(function() {
    instance = Syncano({
      accountKey: 'testKey',
      defaults: { instanceName }
    })
    instance.setBaseUrl(testUrl);
    data = new SyncanoORM(instance);
    api = nock(testUrl).filteringRequestBody(() => '*');
  });


  it('has #_query property', function() {
    should(data.users).have.property('_query').which.is.Function();
  });

  describe('#call()', function() {
    it('should be a method of the model', function() {
      should(data.users).have.property('call').which.is.Function();
    });

    it('should be able to call instance methods', function() {
      const query = data.users.call('pageSize', 40)

      should(query)
        .have.property('query')
        .have.property('query')
        .have.property('page_size')
        .equal(40)
    });
  });

  describe('#list()', function() {
    it('should be a method of the model', function() {
      should(data.users).have.property('list').which.is.Function();
    });

    it('should be able to fetch objects list', function() {
      api.get(`/v1.1/instances/${instanceName}/classes/users/objects/`, '*')
        .query({ page_size: 10 })
        .reply(200, {
          objects: [ { name: 'John Doe', id: 3 } ],
          next: null
        });

      data.users.take(10).list().then(objects => {
        should(objects).be.Array().length(1)
        should(objects).have.propertyByPath(0, 'name').which.is.String();
        should(objects).have.propertyByPath(0, 'id').which.is.Number();
      })
    });

    it('should return [] when no objects were not found', function() {
      api.get(`/v1.1/instances/${instanceName}/classes/users/objects/`, '*')
        .query({ page_size: 5 })
        .reply(200, { objects: [], next: null });

      data.users.take(5).list().then(objects => {
        should(objects).be.Array().empty()
      })
    });
  });

  describe('#first()', function() {
    it('should be a method of the model', function() {
      should(data.users).have.property('first').which.is.Function();
    });

    it('should be able to fetch single object', function() {
      api.get(`/v1.1/instances/${instanceName}/classes/users/objects/`, '*')
        .query({ page_size: 1 })
        .reply(200, { objects: [{ name: 'John Doe', id: 3 }] });

      data.users.first().then(object => {
        should(object).be.Object()
        should(object).have.property('name').which.is.String();
        should(object).have.property('id').which.is.Number();
      })
    });

    it('should return null when object was not found', function() {
      api.get(`/v1.1/instances/${instanceName}/classes/users/objects/`, '*')
        .query({ page_size: 1 })
        .reply(200, { objects: [] });

      data.users.first().then(object => should(object).be.Null())
    });
  });

  describe('#firstOrFail()', function() {
    it('should be a method of the model', function() {
      should(data.users).have.property('firstOrFail').which.is.Function();
    });

    it('should be able to fetch single object', function() {
      api.get(`/v1.1/instances/${instanceName}/classes/users/objects/`, '*')
        .query({ page_size: 1 })
        .reply(200, { objects: [{ name: 'John Doe', id: 3 }] });

      data.users.first().then(object => {
        should(object).be.Object()
        should(object).have.property('name').which.is.String();
        should(object).have.property('id').which.is.Number();
      })
    });

    it('should throw error when object was not found', function() {
      api.get(`/v1.1/instances/${instanceName}/classes/users/objects/`, '*')
        .query({ page_size: 1 })
        .reply(404);

      should(data.users.first()).rejectedWith(NotFoundError)
    });
  });

  describe('#find()', function() {
    it('should be a method of the model', function() {
      should(data.users).have.property('find').which.is.Function();
    });

    it('should be able to fetch single object', function() {
      api.get(`/v1.1/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          query: JSON.stringify({ id: { _eq: 7 }}),
          page_size: 1
        })
        .reply(200, { objects: [{ name: 'John Doe', id: 7 }] });

      data.users.find(7).then(object => {
        should(object).be.Object()
        should(object).have.property('name').which.is.String();
        should(object).have.property('id').which.is.Number();
      })
    });

    it('should be able to fetch objects list', function() {
      api.get(`/v1.1/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          query: JSON.stringify({ id: { _in: [7, 8] }})
        })
        .reply(200, { objects: [
          { name: 'John Doe', id: 7 },
          { name: 'Jane Doe', id: 8 }
        ], next: null });

      data.users.find([7, 8]).then(objects => {
        should(objects).be.Array().length(2)
        should(objects).have.propertyByPath(0, 'name').which.is.String();
        should(objects).have.propertyByPath(0, 'id').which.is.Number();
        should(objects).have.propertyByPath(1, 'name').which.is.String();
        should(objects).have.propertyByPath(1, 'id').which.is.Number();
      })
    });

    it('should return null when object was not found', function() {
      api.get(`/v1.1/instances/${instanceName}/classes/users/objects/`, '*')
        .query({
          query: JSON.stringify({ id: { _eq: 5 }}),
          page_size: 1
        })
        .reply(200, { objects: [], next: null });

      data.users.find(5).then(object => should(object).be.Null())
    });
  });
});
