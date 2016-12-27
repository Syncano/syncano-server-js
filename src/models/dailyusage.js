import stampit from 'stampit'
import {BaseQuerySet, List, Total, StartDate, EndDate, CurrentMonth} from '../querySet'
import {Meta, Model} from './base'

const DailyUsageQuerySet = stampit().compose(
  BaseQuerySet,
  List,
  Total,
  StartDate,
  EndDate,
  CurrentMonth
)

const DailyUsageMeta = Meta({
  name: 'dailyusage',
  pluralName: 'dailyusages',
  endpoints: {
    list: {
      methods: ['get'],
      path: '/v2/usage/daily/'
    }
  }
})
/**
 * OO wrapper around DailyUsage.
 * @ignore
 * @constructor
 * @type {DailyUsage}
 */
const DailyUsage = stampit()
  .compose(Model)
  .setQuerySet(DailyUsageQuerySet)
  .setMeta(DailyUsageMeta)

export default DailyUsage
