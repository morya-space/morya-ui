export interface InputColorProps {
  modelValue?: string
  disabled?: boolean
  id?: string
}

export interface InputColorEmits {
  (event: 'update:modelValue', value: string): void
}
