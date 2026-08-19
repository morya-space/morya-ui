export interface CheckboxProps {
  /** Binary checked state . */
  modelValue?: boolean
  label?: string
  id?: string
  name?: string
  value?: string
  /** Marks the control invalid. */
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export interface CheckboxEmits {
  (event: 'update:modelValue', value: boolean): void
}
