export interface InputOtpProps {
  modelValue?: string
  length?: number
  disabled?: boolean
  integerOnly?: boolean
}

export interface InputOtpEmits {
  (event: 'update:modelValue', value: string): void
}
