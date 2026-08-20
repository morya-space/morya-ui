import type { WiDensity } from '../../shared/config'
import type { FormFieldValidator } from './context'

export type FormLabelPosition = 'top' | 'left'
export type FormValidateTrigger = 'submit' | 'blur' | 'change'

export interface FormProps {
  /** Label placement for FormItem children. */
  labelPosition?: FormLabelPosition
  /** Fixed label column width when `labelPosition` is `left`. */
  labelWidth?: string
  /** Show required mark on FormItem with `required`. */
  requireMark?: boolean
  /** Disable all nested fields (informational; FormItem forwards via CSS). */
  disabled?: boolean
  /**
   * When to run field `validate` callbacks.
   * No built-in rules DSL — validators stay in the consumer.
   */
  validateOn?: FormValidateTrigger | FormValidateTrigger[]
}

export interface FormItemProps {
  label?: string
  /** Associates label with a control id. */
  for?: string
  /** Field name used for Form.validateField / validate. */
  name?: string
  required?: boolean
  /** Explicit invalid state (also implied by non-empty `error`). */
  invalid?: boolean
  /** Controlled error copy. Wins over internal validation message. */
  error?: string
  /** Neutral helper when there is no error. */
  help?: string
  /** Consumer-provided validator; return a string message when invalid. */
  validate?: FormFieldValidator
  /** Override Form `labelPosition`. */
  labelPosition?: FormLabelPosition
  /** Override Form `labelWidth`. */
  labelWidth?: string
}

export type { WiDensity }
