import type { RootPassThrough } from '../../shared/passThrough'
import type { MToastSeverity } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type TimelineAlign = 'left' | 'right' | 'alternate'
export type TimelineLayout = 'vertical' | 'horizontal'
export type TimelineSeverity = MToastSeverity | 'warning' | 'help'

export interface TimelineEvent {
  status?: string
  content?: string
  date?: string
  /** Built-in IconName, or raw text glyph fallback. */
  icon?: IconName | string
  color?: string
  severity?: TimelineSeverity
}

export interface TimelineProps {
  pt?: RootPassThrough
  value: TimelineEvent[]
  align?: TimelineAlign
  layout?: TimelineLayout
  /** Show a trailing pending item. */
  pending?: boolean | string
}
