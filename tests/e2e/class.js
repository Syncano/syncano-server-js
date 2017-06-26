/* eslint-disable no-unused-expressions */
import {expect} from 'chai'

import Server from '../../src'
import {getRandomString, createTestInstance, deleteTestInstance} from '../utils'

global.META = {
  socket: 'test-socket'
}

describe('Class', function () {
  let _class = null
  const testClassName = getRandomString()
  const instanceName = getRandomString()

  before(function (done) {
    createTestInstance(instanceName)
      .then(instanceObj => {
        process.env.SYNCANO_INSTANCE_NAME = instanceObj.name
        process.env.SYNCANO_API_KEY = process.env.E2E_ACCOUNT_KEY
        _class = new Server()._class
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
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

  it('can create a class', function (done) {
    _class.create({name: testClassName, schema: [{"type": "string", "name": "parameter_name"}]})
      .then(res => {
        expect(res.name).to.be.equal(testClassName)
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })

  it('can delete a class', function (done) {
    _class.delete(testClassName)
      .then(classObj => {
        expect(classObj).to.be.empty
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })
})
