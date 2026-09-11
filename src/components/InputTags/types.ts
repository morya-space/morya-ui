import type { MNativeInputProps } from '../../shared/nativeControlProps'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export interface InputTagsProps extends MNativeInputProps {
  modelValue?: string[]
  id?: string
  label?: string
  disabled?: boolean
  invalid?: boolean
  size?: MSizeInput
  addOnBlur?: boolean
  /** Max number of tags. */
  max?: number
  /** Extra separators besides Enter. Example: `','`. */
  separator?: string | string[]
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
}

export interface InputTagsEmits {
  (event: 'update:modelValue', value: string[]): void
}
