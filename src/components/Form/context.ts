import type { ComputedRef, InjectionKey } from 'vue'
import type { FormLabelPosition, FormValidateTrigger } from './types'

export type FormFieldValidator = () => string | undefined | void | Promise<string | undefined | void>

export interface WdFormFieldRegistration {
  name: string
  validate: FormFieldValidator
}

export interface WdFormContext {
  labelPosition: FormLabelPosition
  labelWidth?: string
  requireMark: boolean
  disabled: boolean
  validateOn: FormValidateTrigger[]
  registerField: (field: WdFormFieldRegistration) => void
  unregisterField: (name: string) => void
  notifyBlur: (name: string) => void
  notifyChange: (name: string) => void
}

export const WD_FORM_KEY: InjectionKey<ComputedRef<WdFormContext>> = Symbol('wdForm')
export const WD_FORM_ERRORS_KEY: InjectionKey<Record<string, string>> = Symbol('wdFormErrors')
