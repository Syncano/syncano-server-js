import {expect} from 'chai'

import server from '../../src'
import {getRandomString} from '../utils'

describe('Instance', function () {
  let instance = null
  const testInstanceName = getRandomString()

  before(function () {
    instance = server({accountKey: process.env.E2E_ACCOUNT_KEY}).instance
  })

  it('can create instance', function (done) {
    return instance.create({name: testInstanceName})
      .then(instance => {
        expect(instance.name).to.be.equal(testInstanceName)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('can delete instance', function (done) {
    return instance.delete({name: testInstanceName})
      .then(resp => {
        expect(resp).to.be.empty  // eslint-disable-line no-unused-expressions
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
