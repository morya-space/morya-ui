export interface KnobProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  /** Diameter of the dial in pixels. Defaults to `100`. */
  diameter?: number
  /**
   * @deprecated Use `diameter` instead. Kept as an alias; `diameter`
   * takes precedence when both are set.
   */
  size?: number
  disabled?: boolean
  /** Template with `{value}` placeholder, e.g. `{value}%`. */
  valueTemplate?: string
  /** Accessible label for the slider. */
  ariaLabel?: string
  /** Id of the element labelling the slider. */
  ariaLabelledby?: string
}

export interface KnobEmits {
  (event: 'update:modelValue', value: number): void
}
