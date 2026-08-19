import type { WdSizeInput } from '../../shared/types'

export interface ToggleButtonProps {
  modelValue?: boolean
  onLabel?: string
  offLabel?: string
  onIcon?: string
  offIcon?: string
  disabled?: boolean
  size?: WdSizeInput
}

export interface ToggleButtonEmits {
  (event: 'update:modelValue', value: boolean): void
}
