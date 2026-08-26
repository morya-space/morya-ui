export interface InputTagsProps {
  modelValue?: string[]
  placeholder?: string
  disabled?: boolean
  addOnBlur?: boolean
  /** Max number of tags. */
  max?: number
  /** Extra separators besides Enter. Example: `','`. */
  separator?: string | string[]
}

export interface InputTagsEmits {
  (event: 'update:modelValue', value: string[]): void
}
