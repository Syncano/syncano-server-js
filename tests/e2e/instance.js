import {expect} from 'chai'

import Server from '../../src'
import {getRandomString} from '../utils'

describe('Instance', function () {
  let instance = null
  const testInstanceName = getRandomString()

  this.timeout(5000)

  before(function () {
    instance = new Server({accountKey: process.env.E2E_ACCOUNT_KEY}).instance
  })

  it('can create instance', function (done) {
    instance.create({name: testInstanceName})
      .then(instance => {
        expect(instance.name).to.be.equal(testInstanceName)
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })

  it('can delete instance', function (done) {
    instance.delete(testInstanceName)
      .then(resp => {
        expect(resp).to.be.empty  // eslint-disable-line no-unused-expressions
        done()
      })
      .catch(err => {
        console.log(err)
        done(err)
      })
  })
})
