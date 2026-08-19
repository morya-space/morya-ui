export interface InputTagsProps {
  modelValue?: string[]
  placeholder?: string
  disabled?: boolean
  addOnBlur?: boolean
}

export interface InputTagsEmits {
  (event: 'update:modelValue', value: string[]): void
}
