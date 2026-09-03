import type { WiSizeInput } from '../../shared/types'

export interface InputTagsProps {
  modelValue?: string[]
  id?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  size?: WiSizeInput
  addOnBlur?: boolean
  /** Max number of tags. */
  max?: number
  /** Extra separators besides Enter. Example: `','`. */
  separator?: string | string[]
}

export interface InputTagsEmits {
  (event: 'update:modelValue', value: string[]): void
}
