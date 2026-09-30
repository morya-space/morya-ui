import type { RootPassThrough } from '../../shared/passThrough'

/** Panel `mode`: `month` = day grid, `year` = month grid. */
export type CalendarMode = 'month' | 'year'

export type CalendarValue = Date | string | null

export interface CalendarProps {
  pt?: RootPassThrough
  /** Selected / anchor date. */
  modelValue?: CalendarValue
  /** Panel mode (`month` day grid, `year` month grid). Supports `v-model:mode`. */
  mode?: CalendarMode
  /** Full-bleed calendar (`fullscreen`). Default `true`; `false` = compact card. */
  fullscreen?: boolean
  /** Show ISO week number column. */
  showWeek?: boolean
  disabledDate?: (date: Date) => boolean
  validRange?: [Date | string, Date | string]
}

export interface CalendarEmits {
  'update:modelValue': [value: CalendarValue]
  'update:mode': [mode: CalendarMode]
  select: [date: Date]
  panelChange: [date: Date, mode: CalendarMode]
  change: [value: CalendarValue]
}

export interface CalendarDateCellSlotProps {
  date: Date
}

export interface CalendarMonthCellSlotProps {
  date: Date
}

/** Custom `#header` slot context. */
export interface CalendarHeaderSlotProps {
  value: Date
  mode: CalendarMode
  onChange: (date: Date) => void
  onModeChange: (mode: CalendarMode) => void
}
