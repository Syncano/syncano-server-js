import stampit from 'stampit'
import {BaseQuerySet, Get} from '../querySet'
import {Meta, Model} from './base'

const UsageQuerySet = stampit().compose(
  BaseQuerySet,
  Get
)

const UsageMeta = Meta({
  name: 'usage',
  pluralName: 'usages',
  endpoints: {
    detail: {
      methods: ['get'],
      path: '/v2/usage/'
    }
  }
})
/**
 * OO wrapper around Usage.
 * @ignore
 * @constructor
 * @type {Usage}
 */
const Usage = stampit()
  .compose(Model)
  .setQuerySet(UsageQuerySet)
  .setMeta(UsageMeta)

export default Usage
