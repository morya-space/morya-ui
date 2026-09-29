import type { RootPassThrough } from '../../shared/passThrough'
import type { CSSProperties, VNodeChild } from 'vue'
import type { StatisticFormatter, StatisticValue } from './utils'

export interface StatisticProps {
  pt?: RootPassThrough
  title?: VNodeChild | string
  value?: StatisticValue
  precision?: number
  prefix?: VNodeChild | string
  suffix?: VNodeChild | string
  /** Inline styles for the value row (`valueStyle`). */
  valueStyle?: CSSProperties | Record<string, string>
  loading?: boolean
  formatter?: StatisticFormatter
  decimalSeparator?: string
  groupSeparator?: string
}

export interface StatisticCountdownProps extends Omit<StatisticProps, 'value' | 'formatter'> {
  value?: StatisticValue | Date
  format?: string
}

export interface StatisticCountdownEmits {
  finish: []
  change: [remainingMs: number]
}
