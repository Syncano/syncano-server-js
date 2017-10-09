import should from 'should/as-function'
import Server from '../../src/server'

describe('Response', () => {
  const {response} = new Server({
    token: 'testKey',
    instanceName: 'testInstance'
  })

  let res = null

  beforeEach(() => {
    res = response()
  })

  it('init without error', () => {
    should(res).not.throw()
  })

  it('has _content property set to null', () => {
    should(res)
      .have.property('_content')
      .which.is.null()
  })

  it('has _status property set to 200', () => {
    should(res)
      .have.property('_status')
      .which.is.equal(200)
  })

  it('has _mimetype property set to text/plain', () => {
    should(res)
      .have.property('_mimetype')
      .which.is.equal('text/plain')
  })

  it('has _headers property set to {}', () => {
    should(res)
      .have.property('_headers')
      .which.is.Object()
  })

  it('should use setResponse to return response', done => {
    const {response: r} = new Server({
      token: 'testKey',
      instanceName: 'testInstance',
      setResponse: () => done(),
      HttpResponse: () => {}
    })

    r('hello')
  })

  describe('#header()', () => {
    it('should be a method of the model', () => {
      should(response)
        .have.property('header')
        .which.is.Function()
    })

    it('should add X-TEST to _headers', () => {
      response.header('X-TEST', 'Hello World')

      should(response)
        .have.property('_headers')
        .which.is.deepEqual({
          'X-TEST': 'Hello World'
        })
    })
  })

  describe('#json()', () => {
    it('should be a method of the model', () => {
      should(response)
        .have.property('json')
        .which.is.Function()
    })

    it('should change mimetype to application/json', () => {
      should(response.json())
        .have.property('_mimetype')
        .which.is.equal('application/json')
    })

    it('should parse content to json', () => {
      should(response.json({hello: 'World'}))
        .have.property('_content')
        .which.is.equal('{"hello":"World"}')
    })
  })
})
