import should from 'should/as-function'
import sinon from 'sinon'
import _ from 'lodash'
import Syncano from '../../src/syncano'
import Request from '../../src/request'

describe('Request', () => {
  let config = null
  let request = null
  let stubs = null

  beforeEach(() => {
    const methods = [
      'type',
      'accept',
      'timeout',
      'set',
      'query',
      'send',
      'attach',
      'field',
      'end',
      'on'
    ]

    stubs = _.reduce(methods, (result, method) => {
      result[`_${method}`] = (method === 'end') ? sinon.stub().yields(null, {ok: true}) : sinon.spy()
      result[method] = (...args) => {
        result[`_${method}`](...args)
        return result
      }
      return result
    }, {_init: sinon.spy()})

    config = Syncano({
      accountKey: '123'
    })

    request = Request
      .setRequestHandler((...args) => {
        stubs._init(...args)
        return stubs
      })
      .setConfig(config)()
  })

  describe('#buildUrl()', () => {
    it('should check "path" type', () => {
      should(request.buildUrl(1)).be.rejectedWith(/path/)
    })

    it('should ignore already joined path', () => {
      const expected = `${config.getBaseUrl()}v1/api/`
      const outcome = request.buildUrl(expected)

      should(outcome).be.equal(expected)
    })

    it('should joined path with base url', () => {
      const path = 'v1/api/'
      const expected = `${config.getBaseUrl()}${path}`
      const outcome = request.buildUrl(path)

      should(outcome).be.equal(expected)
    })
  })

  describe('#makeRequest()', () => {
    it('should validate "methodName" attribute', () => {
      should(request.makeRequest(null, '')).be.rejectedWith('Invalid request method: "null".')
      should(request.makeRequest('DUMMY', '')).be.rejectedWith('Invalid request method: "DUMMY".')
    })

    it('should validate "path" attribute', () => {
      should(request.makeRequest('GET', '')).be.rejectedWith('"path" is required.')
    })

    it('should change request type if attachment is present', () => {
      request.makeRequest('GET', '/v2/', {payload: {
        a: Syncano.file(1),
        b: Syncano.file(2),
        c: 2,
        d: 3
      }}, () => {})

      should(stubs._init.calledOnce).be.true()
      should(stubs._type.withArgs('form').calledOnce).be.true()
      should(stubs._timeout.calledOnce).be.true()
      should(stubs._query.calledOnce).be.true()
      should(stubs._send.calledOnce).be.false()
      should(stubs._end.calledOnce).be.true()
      should(stubs._attach.callCount).be.equal(2)
      should(stubs._field.callCount).be.equal(2)
    })

    it.skip('should set proper headers if user key is present', () => {
      request.getConfig().setUserKey('321')
      request.makeRequest('GET', '/v2/', {}, () => {})

      should(stubs._init.calledOnce).be.true()
      should(stubs._type.calledOnce).be.true()
      should(stubs._timeout.calledOnce).be.true()
      should(stubs._query.calledOnce).be.true()
      should(stubs._send.calledOnce).be.true()
      should(stubs._end.calledOnce).be.true()
      should(stubs._attach.callCount).be.equal(0)
    })

    it.skip('should set proper headers if api key is present', () => {
      request.getConfig().setApiKey('321')
      request.makeRequest('GET', '/v2/', {}, () => {})

      should(stubs._init.calledOnce).be.true()
      should(stubs._type.calledOnce).be.true()
      should(stubs._accept.calledOnce).be.true()
      should(stubs._timeout.calledOnce).be.true()
      should(stubs._set.calledOnce).be.true()
      should(stubs._query.calledOnce).be.true()
      should(stubs._send.calledOnce).be.true()
      should(stubs._end.calledOnce).be.true()
      should(stubs._attach.callCount).be.equal(0)

      const spyCall = stubs._set.getCall(0).args[0]

      should(spyCall).be.an.Object()
      should(spyCall).have.property('X-API-KEY').which.is.String().equal('321')
    })

    it.skip('should set proper headers if social token is present', () => {
      request.getConfig().setSocialToken('456').setAccountKey('123')
      request.makeRequest('GET', '/v2/', {}, () => {})

      should(stubs._init.calledOnce).be.true()
      should(stubs._type.calledOnce).be.true()
      should(stubs._accept.calledOnce).be.true()
      should(stubs._timeout.calledOnce).be.true()
      should(stubs._set.calledOnce).be.true()
      should(stubs._query.calledOnce).be.true()
      should(stubs._send.calledOnce).be.true()
      should(stubs._end.calledOnce).be.true()
      should(stubs._attach.callCount).be.equal(0)

      const spyCall = stubs._set.getCall(0).args[0]
      should(spyCall).be.an.Object()
      should(spyCall).have.property('Authorization').which.is.String().equal('Token 456')
    })

    it.skip('should set proper headers if accunt key is present', () => {
      request.getConfig().setAccountKey('111')
      request.makeRequest('GET', '/v2/', {}, () => {})

      should(stubs._init.calledOnce).be.true()
      should(stubs._type.calledOnce).be.true()
      should(stubs._accept.calledOnce).be.true()
      should(stubs._timeout.calledOnce).be.true()
      should(stubs._set.calledOnce).be.true()
      should(stubs._query.calledOnce).be.true()
      should(stubs._send.calledOnce).be.true()
      should(stubs._end.calledOnce).be.true()
      should(stubs._attach.callCount).be.equal(0)

      const spyCall = stubs._set.getCall(0).args[0]
      should(spyCall).be.an.Object()
      should(spyCall).have.property('X-API-KEY').which.is.String().equal('111')
    })

    it.skip('should set defaults', () => {
      request.makeRequest('GET', '/v2/', {}, () => {})

      should(stubs._init.withArgs('GET', 'https://api.syncano.io/v2/').calledOnce).be.true()
      should(stubs._timeout.withArgs(15000).calledOnce).be.true()
      should(stubs._query.calledOnce).be.true()
      should(stubs._send.calledOnce).be.true()
      should(stubs._end.calledOnce).be.true()
      should(stubs._attach.callCount).be.equal(0)
    })
  })

  describe('#setRequestHandler()', () => {
    it('should allow to set request handler', () => {
      const handler = 1
      const request = Request()

      should(request.getRequestHandler()).be.a.Function()
      request.setRequestHandler(handler)
      should(request.getRequestHandler()).be.equal(handler)
    })
  })

  describe('#getRequestHandler()', () => {
    it('should allow to get request handler', () => {
      should(Request().getRequestHandler()).be.a.Function()
    })
  })

  describe('#setRequestHandler() (STATIC)', () => {
    it('should allow to set request handler', () => {
      const handler = 1
      const request = Request.setRequestHandler(handler)

      should(request.getRequestHandler()).be.equal(handler)
    })
  })

  describe('#getRequestHandler() (STATIC)', () => {
    it('should allow to get request handler', () => {
      should(Request.getRequestHandler()).be.a.Function()
    })
  })
})
