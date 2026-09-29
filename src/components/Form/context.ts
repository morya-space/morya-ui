import type { ComputedRef, InjectionKey } from 'vue'
import type { MSizeInput } from '../../shared/types'
import type { NamePath } from './paths'
import type {
  FormFieldValidator,
  FormItemRule,
  FormLabelAlign,
  FormLabelPosition,
  FormModel,
  FormRules,
  FormValidateTrigger,
} from './types'

export type { FormFieldValidator }

/** Validation outcome for a single field: a message plus whether it is a warning. */
export interface MFormFieldValidation {
  message?: string
  warning?: boolean
}

export type MFormFieldValidator = (
  trigger?: FormValidateTrigger | 'all',
) => Promise<MFormFieldValidation>

export interface MFormFieldRegistration {
  /** Canonical key (path string) used for error lookup and targeted validation. */
  key: string
  name: NamePath
  validate: MFormFieldValidator
  /** Re-validate this field when any of these paths change. */
  dependencies?: NamePath[]
}

export interface MFormContext {
  /** Active model — the `model` prop when provided, otherwise an internal store. */
  model: FormModel
  rules?: FormRules
  labelPosition: FormLabelPosition
  labelAlign: FormLabelAlign
  labelWidth?: string | number
  requireMark: boolean
  disabled: boolean
  size?: MSizeInput
  validateOn: FormValidateTrigger[]
  registerField: (field: MFormFieldRegistration) => void
  unregisterField: (key: string) => void
  notifyBlur: (key: string) => void
  notifyChange: (key: string) => void
  notifyInput: (key: string) => void
  /** Re-run validation for one field (used when its `dependencies` change). */
  revalidate: (key: string) => void
}

export const M_FORM_KEY: InjectionKey<ComputedRef<MFormContext>> = Symbol('muForm')
export const M_FORM_ERRORS_KEY: InjectionKey<Record<string, string>> = Symbol('muFormErrors')
export const M_FORM_WARNINGS_KEY: InjectionKey<Record<string, string>> = Symbol('muFormWarnings')

export type { FormItemRule }
