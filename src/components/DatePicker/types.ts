import type { MNativeDateInputProps } from '../../shared/nativeControlProps'
import type { MAppendTo } from '../../shared/overlay'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'
import type { MotionPresetId } from '../../theme/motionPresets'

export type DatePickerType =
  | 'date'
  | 'daterange'
  | 'datetime'
  | 'datetimerange'
  | 'time'
  | 'month'
  | 'year'
export type DatePickerDateValue = string | Date
export type DatePickerValue =
  | DatePickerDateValue
  | [DatePickerDateValue, DatePickerDateValue]
  | DatePickerDateValue[]
  | null
export type DatePickerModel = string | [string, string] | string[] | null

export interface DatePickerShortcut {
  label: string
  value:
    | DatePickerDateValue
    | [DatePickerDateValue, DatePickerDateValue]
    | (() => DatePickerDateValue | [DatePickerDateValue, DatePickerDateValue])
}

export interface DatePickerProps extends MNativeDateInputProps {
  modelValue?: DatePickerValue
  type?: DatePickerType
  label?: string
  /** Input id. Auto-generated when omitted; the label's `for` points to it. */
  id?: string
  disabled?: boolean
  invalid?: boolean
  /** Visual status. `'warning'` highlights the field without implying a hard error. */
  status?: 'default' | 'warning' | 'error'
  fluid?: boolean
  size?: MSizeInput
  minDate?: DatePickerDateValue | null
  maxDate?: DatePickerDateValue | null
  placeholder?: string
  /** Error message shown below the field; also marks the input invalid. */
  errorMessage?: string
  /** Help text shown below the field. */
  helpText?: string
  /**
   * Display pattern using `YYYY` / `MM` / `DD` / `HH` / `mm` / `ss`.
   * Emitted values stay type-specific strings (e.g. `YYYY-MM-DD`, `YYYY-MM-DD HH:mm`).
   */
  format?: string
  /** Include seconds in `time` / `datetime` / `datetimerange` values. Default `false` (`HH:mm`). */
  showSeconds?: boolean
  clearable?: boolean
  shortcuts?: DatePickerShortcut[]
  /**
   * Show OK / Cancel buttons and defer commit until confirmed.
   * Recommended for `datetime` / `datetimerange` / `time` so users can finish picking time.
   */
  needConfirm?: boolean
  /**
   * Allow picking multiple dates (only valid for `type='date'`).
   * `modelValue` becomes `string[]` (`YYYY-MM-DD` items) and the panel stays open after each pick.
   */
  multiple?: boolean
  /**
   * Make the input editable with a soft mask that auto-inserts `-` / `/` / `:` separators
   * matching the display `format`. Enter commits; Escape or blur reverts.
   * Only applies to `date` / `datetime` / `time` types.
   */
  mask?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: MAppendTo
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}

export interface DatePickerEmits {
  (event: 'update:modelValue', value: DatePickerModel): void
  (event: 'clear'): void
  /** Panel opened. */
  (event: 'show'): void
  /** Panel closed. */
  (event: 'hide'): void
  /** Selection committed (same payload as `update:modelValue`, excluding `null` clears). */
  (event: 'change', value: DatePickerModel): void
}
