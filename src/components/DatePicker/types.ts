import type { WiAppendTo } from '../../shared/overlay'
import type { WiSizeInput } from '../../shared/types'

export type DatePickerType = 'date' | 'daterange'
export type DatePickerDateValue = string | Date
export type DatePickerValue =
  | DatePickerDateValue
  | [DatePickerDateValue, DatePickerDateValue]
  | null
export type DatePickerModel = string | [string, string] | null

export interface DatePickerShortcut {
  label: string
  value:
    | DatePickerDateValue
    | [DatePickerDateValue, DatePickerDateValue]
    | (() => DatePickerDateValue | [DatePickerDateValue, DatePickerDateValue])
}

export interface DatePickerProps {
  modelValue?: DatePickerValue
  type?: DatePickerType
  label?: string
  disabled?: boolean
  invalid?: boolean
  fluid?: boolean
  size?: WiSizeInput
  minDate?: DatePickerDateValue | null
  maxDate?: DatePickerDateValue | null
  placeholder?: string
  /** Display pattern using `YYYY` / `MM` / `DD`. Output remains ISO (`YYYY-MM-DD`). */
  format?: string
  clearable?: boolean
  shortcuts?: DatePickerShortcut[]
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: WiAppendTo
}

export interface DatePickerEmits {
  (event: 'update:modelValue', value: DatePickerModel): void
}
