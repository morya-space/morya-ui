export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperStatus = 'wait' | 'process' | 'finish' | 'error'

export interface StepperStep {
  label: string
  description?: string
  disabled?: boolean
  status?: StepperStatus
}

export interface StepperProps {
  /** Active step index (0-based). */
  modelValue?: number
  steps: StepperStep[]
  /** When true, only the current and previous steps are clickable. */
  linear?: boolean
  /** Vertical layout. */
  vertical?: boolean
  /** Alias of `vertical` when set to `'vertical'`. */
  orientation?: StepperOrientation
}

export interface StepperEmits {
  (event: 'update:modelValue', value: number): void
}
