export interface RatingProps {
  modelValue?: number
  stars?: number
  disabled?: boolean
  readonly?: boolean
  cancel?: boolean
}

export interface RatingEmits {
  (event: 'update:modelValue', value: number): void
}
