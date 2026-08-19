export interface SliderProps {
  modelValue?: number | number[]
  min?: number
  max?: number
  step?: number
  range?: boolean
  disabled?: boolean
}

export interface SliderEmits {
  (event: 'update:modelValue', value: number | number[]): void
}
