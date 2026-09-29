import type {
  DatePickerDateValue,
  DatePickerEmits,
  DatePickerModel,
  DatePickerProps,
  DatePickerShortcut,
  DatePickerValue,
} from '../DatePicker/types'

/** TimePicker reuses DatePicker props with `type` fixed to `'time'`. */
export type TimePickerProps = Omit<DatePickerProps, 'type'>

export type TimePickerEmits = DatePickerEmits

export type TimePickerValue = DatePickerValue
export type TimePickerModel = DatePickerModel
export type TimePickerDateValue = DatePickerDateValue
export type TimePickerShortcut = DatePickerShortcut
