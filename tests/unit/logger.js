import should from 'should/as-function'
import Server from '../../src/server'

describe('Logger', () => {
  let logger
  let log = null

  beforeEach(() => {
    const server = new Server({
      token: 'testKey',
      instanceName: 'testInstance'
    })

    logger = server.logger
    log = logger()
  })

  it('init without error', () => {
    should(log).not.throw()
  })

  it('has _start property set to Date', () => {
    should(log).have.property('_start').which.is.null()
  })

  it('has _callback property set to undefined', () => {
    should(log).have.property('_callback').which.is.undefined()
  })

  describe('#listen()', () => {
    it('should be a method of the model', () => {
      should(logger).have.property('listen').which.is.Function()
    })

    it('should throw when callback was not passed', () => {
      should(logger.listen).throw(/Callback must be a function./)
    })

    it('should save callback', () => {
      logger.listen(() => {})

      should(logger).have.property('_callback').which.is.Function()
    })
  })

  describe('#levels()', () => {
    it('should be a method of the model', () => {
      should(logger).have.property('levels').which.is.Function()
    })

    it('should throw when array was not passed', () => {
      should(logger.levels).throw(/Levels must be array of strings\./)
    })
  })

  describe('#debug()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('debug').which.is.Function()
    })
  })

  describe('#error()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('error').which.is.Function()
    })
  })

  describe('#info()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('info').which.is.Function()
    })
  })

  describe('#warn()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('warn').which.is.Function()
    })
  })
})
