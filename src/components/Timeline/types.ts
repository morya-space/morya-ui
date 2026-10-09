import type { RootPassThrough } from '../../shared/passThrough'
import type { MToastType } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type TimelineAlign = 'left' | 'right' | 'alternate'
export type TimelineLayout = 'vertical' | 'horizontal'
export type TimelineType = MToastType | 'help'

export interface TimelineEvent {
  status?: string
  content?: string
  date?: string
  /** Built-in IconName, or raw text glyph fallback. */
  icon?: IconName | string
  color?: string
  type?: TimelineType
}

export interface TimelineProps {
  pt?: RootPassThrough
  value: TimelineEvent[]
  align?: TimelineAlign
  layout?: TimelineLayout
  /** Show a trailing pending item. */
  pending?: boolean | string
}
