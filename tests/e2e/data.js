import nodeFetch from 'node-fetch'
import {checkStatus, parseJSON} from '../../src/utils'
import {getRandomString, createTestInstance, deleteTestInstance} from '../utils'
import Server from '../../src/server'


describe('Data', function () {
  const instanceName = getRandomString()
  let data = null

  before(function (done) {
    createTestInstance(instanceName)
      .then(instanceObj => {
        if (!global.CONFIG) {
          global.CONFIG = {}
        }
        global.CONFIG.SYNCANO_INSTANCE_NAME = instanceObj.name
        global.CONFIG.SYNCANO_API_KEY = process.env.E2E_ACCOUNT_KEY
        const server = new Server({
          token: process.env.E2E_ACCOUNT_KEY,
          instanceName: instanceObj.name
        })
        data = server.data
        const testClass = {
          name: 'tests',
          schema: [
            {type: 'string', name: 'test'},
            {type: 'string', name: 'test2'}
          ]
        }

        nodeFetch(`https://api.syncano.io/v2/instances/${instanceObj.name}/classes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.E2E_ACCOUNT_KEY
          },
          body: JSON.stringify(testClass)
        })
          .then(checkStatus)
          .then(done())
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
  })
  it('can create multiple objects', function (done) {
    data.tests
      .create([
        {test: 'batch1', test2: 'secret'},
        {test: 'batch2', test2: 'secret'},
        {test: 'batch3', test2: 'secret'},
        {test: 'batch4', test2: 'secret'}
      ])
      .then(() => {
        done()
      })
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })
  it('can create single object', function (done) {
    data.tests
      .create(
        {test: 'single', test2: 'secret'})
      .then(() => {
        done()
      })
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })
  it('can update single object', function (done) {
    data.tests
      .update(1, {test: 'updated', test2: 'secret'})
      .then(() => {
        done()
      })
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })
  it('can update multiple objects', function (done) {
    data.tests
      .update([
        [2, {test: 'Updated1', test2: 'secret'}],
        [3, {test: 'Updated2', test2: 'secret'}],
        [4, {test: 'Updated3', test2: 'secret'}],
        [5, {test: 'Updated4', test2: 'secret'}]
      ])
      .then(() => {
        done()
      })
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })
  it('can delete single object', function (done) {
    data.tests
      .delete(1)
      .then(() => {
        done()
      })
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })
  it('can delete multiple objects', function (done) {
    data.tests
      .delete([2, 3, 4, 5])
      .then(() => {
        done()
      })
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })
})
