import should from 'should/as-function'
import { ConfigMixin, MetaMixin, ConstraintsMixin } from '../../src/utils'

describe('ConfigMixin', () => {
  let configMixin = null
  const testConfig = { key: 'value' }

  beforeEach(() => {
    configMixin = ConfigMixin()
  })

  describe('#setConfig()', () => {
    it('should be a method of the ConfigMixin object', () => {
      should(configMixin).have.property('setConfig').which.is.Function()
    })

    it('should allow to set config', () => {
      configMixin.setConfig(testConfig)
      should(configMixin._config).is.equal(testConfig)
    })
  })

  describe('#getConfig()', () => {
    it('should be a method of the ConfigMixin object', () => {
      should(configMixin).have.property('getConfig').which.is.Function()
    })

    it('should allow to get config', () => {
      configMixin.setConfig(testConfig)
      should(configMixin.getConfig()).is.equal(testConfig)
    })
  })

  describe('#getConfig() (static)', () => {
    it('should allow to get config', () => {
      const configMixinStatic = ConfigMixin.setConfig(testConfig)
      should(configMixinStatic.getConfig()).is.equal(testConfig)
    })
  })
})

describe('MetaMixin', () => {
  let metaMixin = null
  const testMeta = { key: 'value' }

  beforeEach(() => {
    metaMixin = MetaMixin()
  })

  describe('#setMeta()', () => {
    it('should be a method of the MetaMixin object', () => {
      should(metaMixin).have.property('setMeta').which.is.Function()
    })

    it('should allow to set config', () => {
      metaMixin.setMeta(testMeta)
      should(metaMixin._meta).is.equal(testMeta)
    })
  })

  describe('#getMeta()', () => {
    it('should be a method of the MetaMixin object', () => {
      should(metaMixin).have.property('getMeta').which.is.Function()
    })

    it('should allow to get meta', () => {
      metaMixin.setMeta(testMeta)
      should(metaMixin.getMeta()).is.equal(testMeta)
    })
  })

  describe('#getMeta() (static)', () => {
    it('should allow to get meta', () => {
      const metaMixinStatic = MetaMixin.setMeta(testMeta)
      should(metaMixinStatic.getMeta()).is.equal(testMeta)
    })
  })
})

describe('ConstraintsMixin', () => {
  let constraintsMixin = null
  const testConstraints = { key: 'value' }

  beforeEach(() => {
    constraintsMixin = ConstraintsMixin()
  })

  describe('#setConstraints()', () => {
    it('should be a method of the ConstraintsMixin object', () => {
      should(constraintsMixin).have.property('setConstraints').which.is.Function()
    })

    it('should allow to set config', () => {
      constraintsMixin.setConstraints(testConstraints)
      should(constraintsMixin._constraints).is.equal(testConstraints)
    })
  })

  describe('#getConstraints()', () => {
    it('should be a method of the ConstraintsMixin object', () => {
      should(constraintsMixin).have.property('getConstraints').which.is.Function()
    })

    it('should allow to get constraints', () => {
      constraintsMixin.setConstraints(testConstraints)
      should(constraintsMixin.getConstraints()).is.equal(testConstraints)
    })
  })

  describe('#getConstraints() (static)', () => {
    it('should allow to get constraints', () => {
      const constraintsMixinStatic = ConstraintsMixin.setConstraints(testConstraints)
      should(constraintsMixinStatic.getConstraints()).is.equal(testConstraints)
    })
  })
})
