import Server from '../../src'
import {getRandomString, createTestInstance, deleteTestInstance} from '../utils'

describe('Users', function() {
  let users = null
  const instanceName = getRandomString()

  before(function (done) {
    const ctx = {
      meta: {
        socket: 'test-socket',
        token: process.env.E2E_ACCOUNT_KEY
      }
    }
    createTestInstance(instanceName)
      .then(instanceObj => {
        ctx.meta.instance = instanceObj.name
        users = new Server(ctx).users
        done()
      })
      .catch(err => {
        console.log(err)
        err.response.text().then(text => {
          console.log(text)
          done(err)
        })
      })
  })

  after(function(done) {
    deleteTestInstance(instanceName)
      .then(() => {
        done()
      })
      .catch(() => {
        done()
      })
  })

  it('list', function(done) {
    users
      .list()
      .then(() => done())
      .catch(err => {
        console.log('ERROR: ', err)
        done(err)
      })
  })
})
