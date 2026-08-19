export interface KnobProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  size?: number
  disabled?: boolean
  /** Template with `{value}` placeholder, e.g. `{value}%`. */
  valueTemplate?: string
}

export interface KnobEmits {
  (event: 'update:modelValue', value: number): void
}
