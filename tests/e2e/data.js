/* eslint-disable no-unused-expressions */
import fs from 'fs'
import nodeFetch from 'node-fetch'
import FormData from 'form-data'
import {expect} from 'chai'

import Server from '../../src'
import {getRandomString, createTestInstance, deleteTestInstance, checkStatus, buildInstanceURL} from '../utils'

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

  it('can create single object', function (done) {
    data[testClassName]
      .create(
        {test: 'single', test2: 'secret', 'field_string': dummyStringFieldValue})
      .then(() => done())
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })

  it('can create multiple objects', function (done) {
    data[testClassName]
      .create([
        {test: 'batch1', test2: 'secret'},
        {test: 'batch2', test2: 'secret'},
        {test: 'batch3', test2: 'secret'},
        {test: 'batch4', test2: 'secret'}
      ])
      .then(() => done())
      .catch(err => {
        console.log('ERROR: ', err)
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

  it('can update single object', function (done) {
    data[testClassName]
      .update(1, {test: 'Updated', test2: 'secret'})
      .then(() => done())
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })

  it('can update multiple objects', function (done) {
    data[testClassName]
      .update([
        [2, {test: 'Updated1', test2: 'secret'}],
        [3, {test: 'Updated2', test2: 'secret'}],
        [4, {test: 'Updated3', test2: 'secret'}],
        [5, {test: 'Updated4', test2: 'secret'}]
      ])
      .then(() => done())
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })

  it('can update multiple objects by query', function (done) {
    data[testClassName]
      .where('id', 'gte', 4)
      .update({test: 'Query update', test2: 'secret query update'})
      .then(() => done())
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })

  it('can delete single object', function (done) {
    data[testClassName]
      .delete(1)
      .then(() => done())
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })

  it('can delete multiple objects', function (done) {
    data[testClassName]
      .delete([2, 3])
      .then(() => done())
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })

  it('can delete multiple objects by query', function (done) {
    data[testClassName]
      .where('id', 'gte', 4)
      .delete()
      .then(() => done())
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })

  it('can be sorted', function (done) {
    let firstObject = null
    let secondObject = null

    // Create objects
    Promise.all([
      data[testClassName].create({field_string: 'abcdef'}),
      data[testClassName].create({field_string: 'cdefgh'}),
      data[testClassName].create({field_string: 'bcdefg'})
    ])
    .then(objects => {
      [firstObject, secondObject] = objects

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
  it('can be created with file field', function (done) {
    const form = new FormData();
    form.append('field_file', fs.createReadStream(__dirname + '/assets/test.jpg'));

    data[testClassName].create(form)
    .then((res) => {
      expect(res['field_file']['type']).to.be.equal('file')
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

  it.skip('can be listed with one filter', function (done) {})
  it.skip('can be listed with two filters', function (done) {})
  it.skip('can be listed with order', function (done) {})
})
