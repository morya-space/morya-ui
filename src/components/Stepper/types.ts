export interface StepperStep {
  label: string
  disabled?: boolean
}

export interface StepperProps {
  /** Active step index (0-based). */
  modelValue?: number
  steps: StepperStep[]
  /** When true, only the current and previous steps are clickable. */
  linear?: boolean
}

export interface StepperEmits {
  (event: 'update:modelValue', value: number): void
}
