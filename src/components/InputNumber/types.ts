import type { WiSizeInput } from '../../shared/types'

export interface InputNumberProps {
  modelValue?: number | null
  label?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  invalid?: boolean
  fluid?: boolean
  size?: WiSizeInput
  showButtons?: boolean
  id?: string
}

export interface InputNumberEmits {
  (event: 'update:modelValue', value: number | null): void
}
