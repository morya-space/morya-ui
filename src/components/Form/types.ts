import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'
import type { NamePath } from './paths'
import type { FormInstance } from './useForm'

export type { NamePath, NamePathKey } from './paths'

export type FormLabelPosition = 'top' | 'left'
export type FormLabelAlign = 'left' | 'center' | 'right'
export type FormValidateTrigger = 'submit' | 'blur' | 'change' | 'input'

export type FormFieldValidator = (
  trigger?: FormValidateTrigger | 'all',
) => boolean | string | undefined | void | Promise<boolean | string | undefined | void>

export type FormModel = Record<string, unknown>

/** Value kinds recognised by the built-in `type` rule. */
export type FormRuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'email'
  | 'url'
  | 'integer'
  | 'date'

export interface FormItemRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  /** Exact length (string / array) or exact value (number). */
  len?: number
  pattern?: RegExp
  /** Built-in value type check. */
  type?: FormRuleType
  /** Reject strings that are only whitespace (defaults to `true` for `required`). */
  whitespace?: boolean
  /** Allowed values. */
  enum?: unknown[]
  /** Transform the value before the rule is evaluated. */
  transform?: (value: unknown) => unknown
  /**
   * Report a warning instead of an error.
   * Warnings are surfaced but do not make the form invalid.
   */
  warningOnly?: boolean
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
  /** Messages produced by `warningOnly` rules. */
  warnings: Record<string, string>
}

export type FormScrollToFieldOptions = ScrollIntoViewOptions & {
  /** Focus the first focusable control inside the field after scrolling. */
  focus?: boolean
}

/** The instance returned by `useForm()` and exposed by `MForm`. */
export type { FormInstance }

export interface FormProps {
  /** Bound values used by declarative `rules`. Omit to use an internal model. */
  model?: FormModel
  /** Controlled instance from `useForm()`. */
  form?: FormInstance
  /** Initial values applied to the model once, on mount. */
  initialValues?: FormModel
  /** Declarative rules keyed by FormItem `name`. */
  rules?: FormRules
  /** Label placement for FormItem children. */
  labelPosition?: FormLabelPosition
  /** Alias of `labelPosition`. `labelPosition` wins. */
  labelPlacement?: FormLabelPosition
  /** Label text alignment. */
  labelAlign?: FormLabelAlign
  /** Fixed label column width when labels are on the left. Number is px. */
  labelWidth?: string | number
  /** Arrange items in a wrapping row. */
  inline?: boolean
  /** Show required mark on FormItem with `required` or a required rule. */
  requireMark?: boolean
  /** Alias of `requireMark` . `requireMark` wins. */
  requiredMark?: boolean
  /** Disable all nested fields (informational; FormItem forwards via CSS). */
  disabled?: boolean
  /**
   * Default control size inherited by nested fields that omit their own `size`
   * (Input / Textarea / InputPassword / Select, etc.).
   */
  size?: MSizeInput
  /**
   * When to run field validation.
   * Also the default `trigger` for rules that omit one.
   */
  validateOn?: FormValidateTrigger | FormValidateTrigger[]
  /**
   * After a failed `validate()` / submit validation, scroll to the first error field.
   * Pass `true` for default `scrollIntoView`, or ScrollIntoView options.
   */
  scrollToFirstError?: boolean | FormScrollToFieldOptions
  /** Pass-through attrs/classes/styles for the root `<form>` element. */
  pt?: RootPassThrough
}

export interface FormItemProps {
  label?: string
  /** Associates label with a control id. */
  for?: string
  /**
   * Field name used for validation / rules lookup.
   * Supports nested paths: `'user.name'`, `'items[0].title'`, or `['items', index, 'title']`.
   */
  name?: NamePath
  /**
   * Name paths this field depends on.
   * The field re-validates when any of them changes.
   */
  dependencies?: NamePath[]
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
  /** Pass-through attrs/classes/styles for the root element. */
  pt?: RootPassThrough
}
