/* eslint-disable no-unused-expressions */
import {expect} from 'chai'
import Server from '../../src'
import {getRandomString, createTestInstance, deleteTestInstance} from '../utils'

global.META = {
  socket: 'test-socket'
}

describe('Data object', function () {
  let data = null
  let dummyStringFieldValue = getRandomString()
  const testClassName = getRandomString()
  const testSocketName = getRandomString()
  const instanceName = getRandomString()

  before(function (done) {
    createTestInstance(instanceName)
      .then(instanceObj => {
        process.env.SYNCANO_INSTANCE_NAME = instanceObj.name
        process.env.SYNCANO_API_KEY = process.env.E2E_ACCOUNT_KEY
        return new Server()._class.create({
          name: testClassName,
          schema: [
            {type: 'string', name: 'field_string', filter_index: true, order_index: true},
            {type: 'text', name: 'field_text'},
            {type: 'integer', name: 'field_integer'},
            {type: 'float', name: 'field_float'},
            {type: 'array', name: 'field_array'},
            {type: 'file', name: 'field_file'}
          ]
        })
      })
      .then(classObj => {
        data = new Server().data
        done()
      })
      .catch(err => {
        console.log(err)
        err.response.text()
          .then(text => {
            console.log(text)
            done(err)
          })
      })
  })

  after(function (done) {
    deleteTestInstance(instanceName)
      .then(() => {
        done()
      })
      .catch(() => {
        done()
      })
  })

  it('can be created', function (done) {
    data[testClassName].create({field_string: dummyStringFieldValue})
      .then(dataObj => {
        expect(dataObj.field_string).to.be.equal(dummyStringFieldValue)
        expect(dataObj.revision).to.be.equal(1)
        expect(dataObj).to.not.be.empty
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })

  it('can be listed', function (done) {
    data[testClassName]
      .where('field_string', dummyStringFieldValue)
      .first()
      .then(dataObj => {
        expect(dataObj).to.not.be.empty
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('can be deleted', function (done) {
    data[testClassName]
      .where('field_string', dummyStringFieldValue)
      .first()
      .then(dataObj => {
        expect(dataObj).to.not.be.empty
        return data[testClassName].delete(dataObj.id)
      })
      .then(() => {
        return data[testClassName]
          .where('field_string', dummyStringFieldValue)
          .first()
      })
      .then((resp) => {
        expect(resp).to.be.null
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('can be sorted', function (done) {

    let firstObject = null;
    let secondObject = null;

    // Create objects
    Promise.all([
      data[testClassName].create({field_string: 'abcdef'}),
      data[testClassName].create({field_string: 'cdefgh'}),
      data[testClassName].create({field_string: 'bcdefg'})
    ])
    .then(objects => {
      firstObject = objects[0]
      secondObject = objects[1]

      return data[testClassName]
        .orderBy('field_string')
        .list()
    })
    .then((sortedObjects) => {
      expect(sortedObjects[0]['field_string']).to.be.equal('abcdef')
      expect(sortedObjects[1]['field_string']).to.be.equal('bcdefg')
      expect(sortedObjects[2]['field_string']).to.be.equal('cdefgh')
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it.skip('can be updated', function (done) {})
  it.skip('can be deleted', function (done) {})
  it.skip('can be updated by adding to array field', function (done) {})
  it.skip('can be updated by deleting from array field', function (done) {})
  it.skip('can be created with relation', function (done) {})
  it.skip('can be created with reference', function (done) {})
  it.skip('can be created with reference', function (done) {})
  it.skip('can be created with file field', function (done) {})
  it.skip('can be listed with one filter', function (done) {})
  it.skip('can be listed with two filters', function (done) {})
  it.skip('can be listed with order', function (done) {})

})
