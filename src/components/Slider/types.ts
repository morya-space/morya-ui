export type SliderMarks = number[] | Record<number, string>

export interface SliderProps {
  modelValue?: number | number[]
  min?: number
  max?: number
  step?: number
  range?: boolean
  disabled?: boolean
  /** Tick marks. Array of values, or a value-to-label map. */
  marks?: SliderMarks
  /** Show the current value while interacting. */
  tooltip?: boolean
  /** Render vertically. */
  vertical?: boolean
  /** Accessible name for single-thumb mode. */
  ariaLabel?: string
}

export interface SliderEmits {
  (event: 'update:modelValue', value: number | number[]): void
}
