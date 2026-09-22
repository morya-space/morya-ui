import type { MNativeComboboxFieldProps } from '../../shared/nativeControlProps'
import type { MAppendTo } from '../../shared/overlay'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'
import type { MotionPresetId } from '../../theme/motionPresets'

export interface CascadeSelectOption {
  label: string
  value: string | number
  children?: CascadeSelectOption[]
  disabled?: boolean
}

export type CascadeSelectValue = string | number | null

export interface CascadeSelectProps extends MNativeComboboxFieldProps {
  modelValue?: CascadeSelectValue
  options: CascadeSelectOption[]
  label?: string
  helpText?: string
  invalid?: boolean
  /** Error copy under the field; implies invalid when set. */
  errorMessage?: string
  id?: string
  disabled?: boolean
  required?: boolean
  size?: MSizeInput
  fluid?: boolean
  /** Show clear button when a value is selected. */
  clearable?: boolean
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`). */
  appendTo?: MAppendTo
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}

export interface CascadeSelectEmits {
  (event: 'update:modelValue', value: CascadeSelectValue): void
  (event: 'clear'): void
}
