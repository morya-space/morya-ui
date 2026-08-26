export interface RatingProps {
  modelValue?: number
  stars?: number
  disabled?: boolean
  readonly?: boolean
  /** Show a clear control. Defaults to `true`. */
  cancel?: boolean
  /** Alias of `cancel`. When set, takes precedence. `null` means follow `cancel`. */
  allowClear?: boolean | null
  /** Allow 0.5 increments. */
  allowHalf?: boolean
}

export interface RatingEmits {
  (event: 'update:modelValue', value: number): void
}
