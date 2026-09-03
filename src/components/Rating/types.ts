export interface RatingProps {
  modelValue?: number
  stars?: number
  disabled?: boolean
  readonly?: boolean
  /**
   * @deprecated Use `allowClear` instead. Kept as an alias; `allowClear`
   * takes precedence when both are set.
   */
  cancel?: boolean
  /** Show a clear control. Defaults to `true`. */
  allowClear?: boolean | null
  /** Allow 0.5 increments. */
  allowHalf?: boolean
  /** Accessible label for the slider root. Falls back to the locale string. */
  ariaLabel?: string
}

export interface RatingEmits {
  (event: 'update:modelValue', value: number): void
}
