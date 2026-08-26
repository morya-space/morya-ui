export interface InputColorProps {
  modelValue?: string
  disabled?: boolean
  id?: string
  /** Preset hex colors shown under the input. */
  swatches?: string[]
}

export interface InputColorEmits {
  (event: 'update:modelValue', value: string): void
}
