import type { RootPassThrough } from '../../shared/passThrough'
export type StepperStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepperSize = 'small' | 'medium'

export interface StepperStep {
  label: string
  description?: string
  disabled?: boolean
  status?: StepperStatus
}

export interface StepperProps {
  pt?: RootPassThrough
  /** Active step index (0-based). */
  modelValue?: number
  steps: StepperStep[]
  /** When true, only the current and previous steps are clickable. */
  linear?: boolean
  /** Vertical layout. */
  vertical?: boolean
  /** Status applied to the active step when the step has no explicit `status`. */
  status?: StepperStatus
  /** Marker / typography density. */
  size?: StepperSize
}

export interface StepperEmits {
  (event: 'update:modelValue', value: number): void
}
