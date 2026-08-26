export type FormLabelPosition = 'top' | 'left'
export type FormLabelAlign = 'left' | 'center' | 'right'
export type FormValidateTrigger = 'submit' | 'blur' | 'change' | 'input'

export type FormFieldValidator = (
  trigger?: FormValidateTrigger | 'all',
) => boolean | string | undefined | void | Promise<boolean | string | undefined | void>

export type FormModel = Record<string, unknown>

export interface FormItemRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: RegExp
  /**
   * When this rule runs. Omit to inherit Form `validateOn`.
   * Programmatic `validate()` / submit always runs every rule.
   */
  trigger?: FormValidateTrigger | FormValidateTrigger[]
  /**
   * Return an error string, `false`, or a Promise of either when invalid.
   * `undefined` / `true` / void means valid.
   */
  validator?: (value: unknown) => boolean | string | undefined | void | Promise<boolean | string | undefined | void>
}

export type FormRules = Record<string, FormItemRule | FormItemRule[]>

export interface FormValidateResult {
  valid: boolean
  errors: Record<string, string>
}

export interface FormInstance {
  validate: (name?: string) => Promise<FormValidateResult>
  clearValidate: (name?: string) => void
  errors: Record<string, string>
}

export interface FormProps {
  /** Bound values used by declarative `rules`. */
  model?: FormModel
  /** Declarative rules keyed by FormItem `name`. */
  rules?: FormRules
  /** Label placement for FormItem children. */
  labelPosition?: FormLabelPosition
  /** Alias of `labelPosition` (Naive `label-placement`). `labelPosition` wins. */
  labelPlacement?: FormLabelPosition
  /** Label text alignment. */
  labelAlign?: FormLabelAlign
  /** Fixed label column width when labels are on the left. Number is px. */
  labelWidth?: string | number
  /** Arrange items in a wrapping row. */
  inline?: boolean
  /** Show required mark on FormItem with `required` or a required rule. */
  requireMark?: boolean
  /** Disable all nested fields (informational; FormItem forwards via CSS). */
  disabled?: boolean
  /**
   * When to run field validation.
   * Also the default `trigger` for rules that omit one.
   */
  validateOn?: FormValidateTrigger | FormValidateTrigger[]
}

export interface FormItemProps {
  label?: string
  /** Associates label with a control id. */
  for?: string
  /** Field name used for Form.validate / rules lookup. */
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
  /** Item-level rules; merged after Form `rules[name]`. */
  rules?: FormItemRule | FormItemRule[]
  /** Override Form `labelPosition`. */
  labelPosition?: FormLabelPosition
  /** Override Form `labelAlign`. */
  labelAlign?: FormLabelAlign
  /** Override Form `labelWidth`. */
  labelWidth?: string | number
}
