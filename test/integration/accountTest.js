import should from 'should/as-function'
import _ from 'lodash'
import Syncano from '../../src/syncano'
import {suffix, credentials} from './utils'

describe('Account', function () {
  this.timeout(15000)

  let connection = null
  let Instance = null
  let Model = null
  const username = suffix.getHyphened('account')
  const email = `${username}@internal.com`
  const data = {
    email,
    username,
    password: username,
    instanceName: username,
    first_name: 'first_name_test',
    last_name: 'last_name_test'
  }

  before(() => {
    connection = Syncano(credentials.getCredentials())
    Instance = connection.Instance
    Model = connection.Account

    return Instance.please().create({name: username})
  })

  after(() => {
    return Instance.please().delete({name: username})
  })

  it('has "register" method', () => {
    should(Model).have.property('register').which.is.Function()
  })

  it('has "login" method', () => {
    should(Model).have.property('login').which.is.Function()
  })

  it('has "update" method', () => {
    should(Model).have.property('update').which.is.Function()
  })

  it('has "getUserDetails" method', () => {
    should(Model).have.property('getUserDetails').which.is.Function()
  })

  it('has "activate" method', () => {
    should(Model).have.property('activate').which.is.Function()
  })

  it('has "changePassword" method', () => {
    should(Model).have.property('changePassword').which.is.Function()
  })

  it('has "resetPassword" method', () => {
    should(Model).have.property('resetPassword').which.is.Function()
  })

  it('has "confirmPasswordReset" method', () => {
    should(Model).have.property('confirmPasswordReset').which.is.Function()
  })

  it('has "setPassword" method', () => {
    should(Model).have.property('setPassword').which.is.Function()
  })

  it('has "resetKey" method', () => {
    should(Model).have.property('resetKey').which.is.Function()
  })

  it('has "socialLogin" method', () => {
    should(Model).have.property('socialLogin').which.is.Function()
  })

  it('has "resendEmail" method', () => {
    should(Model).have.property('resendEmail').which.is.Function()
  })

  describe('#register()', () => {
    it('should register a new user', () => {
      return Model.register(data).then(user => {
        should(user).be.an.Object()
        should(user).have.property('id').which.is.Number()
        should(user).have.property('first_name').which.is.String().equal(data.first_name)
        should(user).have.property('last_name').which.is.String().equal(data.last_name)
        should(user).have.property('account_key').which.is.String()
        should(user).have.property('email').which.is.String().equal(data.email)
        should(user).have.property('is_active').which.is.false()
        should(user).have.property('has_password').which.is.true()
      })
    })
  })

  describe('#login()', () => {
    it('should login user', () => {
      return Model.login(data, false).then(user => {
        should(user).be.an.Object()
        should(user).have.property('id').which.is.Number()
        should(user).have.property('first_name').which.is.String().equal(data.first_name)
        should(user).have.property('last_name').which.is.String().equal(data.last_name)
        should(user).have.property('account_key').which.is.String()
        should(user).have.property('email').which.is.String().equal(data.email)
        should(user).have.property('is_active').which.is.false()
        should(user).have.property('has_password').which.is.true()
      })
    })
  })

  describe('#update()', () => {
    it('should update user data', () => {
      return Model.update(_.assign({}, data, {first_name: 'a', last_name: 'b'}), false).then(user => {
        should(user).be.an.Object()
        should(user).have.property('first_name').which.is.String().equal('a')
        should(user).have.property('last_name').which.is.String().equal('b')
      })
    })
  })

  describe('#getUserDetails()', () => {
    it('should get user data', () => {
      return Model.getUserDetails().then(user => {
        should(user).be.an.Object()
        should(user).have.property('id').which.is.Number()
        should(user).have.property('first_name').which.is.String().equal('a')
        should(user).have.property('last_name').which.is.String().equal('b')
        should(user).have.property('is_active').which.is.false()
        should(user).have.property('email').which.is.String()
        should(user).have.property('has_password').which.is.true()
      })
    })
  })
})
