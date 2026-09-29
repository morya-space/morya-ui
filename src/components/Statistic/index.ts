import './style'
import Statistic from './Statistic.vue'
import StatisticCountdown from './StatisticCountdown.vue'

export type {
  StatisticCountdownEmits,
  StatisticCountdownProps,
  StatisticProps,
} from './types'
export type { StatisticFormatter, StatisticValue } from './utils'

export { default as MStatistic } from './Statistic.vue'
export { default as MStatisticCountdown } from './StatisticCountdown.vue'

/** Compound access: `MStatistic.Countdown`. */
Object.assign(Statistic, {
  Countdown: StatisticCountdown,
})

export default Statistic
