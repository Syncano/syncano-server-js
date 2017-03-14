import should from 'should/as-function'
import Server from '../../src/server'

describe('Logger', () => {
  const {logger} = new Server({
    token: 'testKey',
    instanceName: 'testInstance'
  })

  let log = null

  beforeEach(() => {
    log = logger()
  })

  it('init without error', () => {
    should(log).not.throw()
  })

  it('has _start property set to Date', () => {
    should(log).have.property('_start').which.is.Date()
  })

  it('has _callback property set to Date', () => {
    should(log).have.property('_callback').which.is.null()
  })

  describe('#listen()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('listen').which.is.Function()
    })

    it('should throw when callback was not passed', () => {
      should(log.listen).throw(/Callback must be a function./)
    })

    it('should save callback', () => {
      should(log.listen(() => {})).have.property('_callback').which.is.Function()
    })
  })

  describe('#alert()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('alert').which.is.Function()
    })
  })

  describe('#critical()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('critical').which.is.Function()
    })
  })

  describe('#debug()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('debug').which.is.Function()
    })
  })

  describe('#emergency()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('emergency').which.is.Function()
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

  describe('#notice()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('notice').which.is.Function()
    })
  })

  describe('#warning()', () => {
    it('should be a method of the model', () => {
      should(log).have.property('warning').which.is.Function()
    })
  })
})
