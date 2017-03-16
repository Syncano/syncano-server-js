import {getRandomString, createTestInstance, deleteTestInstance} from '../utils'

describe('Socket', function () {
  const instanceName = getRandomString()

  before(function (done) {
    createTestInstance(instanceName)
      .then(instanceObj => {
        if (!global.CONFIG) {
          global.CONFIG = {}
        }
        global.CONFIG.SYNCANO_INSTANCE_NAME = instanceObj.name
        global.CONFIG.SYNCANO_API_KEY = process.env.E2E_ACCOUNT_KEY
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
  })

  // it('can call event', function (done) {
  //   socket.post('openweathermap/get-three-hours-forecast', {city: 'bergen'})
  //     .then(resp => resp.json())
  //     .then(data => {
  //       console.log("XXX", data)
  //       done()
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       done(err)
  //     })
  // })
})
