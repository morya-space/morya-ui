export interface SwitchProps {
  modelValue?: boolean
  label?: string
  /** Native input id. */
  id?: string
  /** Alias of `id` . */
  inputId?: string
  name?: string
  value?: string
  /** Marks the control invalid. */
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export interface SwitchEmits {
  (event: 'update:modelValue', value: boolean): void
}
