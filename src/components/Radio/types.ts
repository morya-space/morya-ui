export interface RadioProps {
  modelValue?: string | number | boolean
  value: string | number | boolean
  label?: string
  id?: string
  name?: string
  /** Marks the control invalid. */
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export interface RadioEmits {
  (event: 'update:modelValue', value: string | number | boolean): void
}
