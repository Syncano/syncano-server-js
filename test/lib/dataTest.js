import nock from 'nock';
import should from 'should/as-function';
import Syncano from 'syncano'
import SyncanoORM from '../../src';

// import { NotFoundError } from '../../src/errors';

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
        should(objects).deepEqual([{
          className: 'users',
          id: 3,
          instanceName: 'testInstance',
          name: 'John Doe'
        }])
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
        should(object).deepEqual({ id: 3, name: 'John Doe' })
      })
    });
  });
});
