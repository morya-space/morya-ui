import type { WiSizeInput } from '../../shared/types'

export interface ToggleButtonProps {
  modelValue?: boolean
  onLabel?: string
  offLabel?: string
  onIcon?: string
  offIcon?: string
  disabled?: boolean
  size?: WiSizeInput
}

export interface ToggleButtonEmits {
  (event: 'update:modelValue', value: boolean): void
}
