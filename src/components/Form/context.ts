import type { ComputedRef, InjectionKey } from 'vue'
import type { FormLabelPosition, FormValidateTrigger } from './types'

export type FormFieldValidator = () => string | undefined | void | Promise<string | undefined | void>

export interface WiFormFieldRegistration {
  name: string
  validate: FormFieldValidator
}

export interface WiFormContext {
  labelPosition: FormLabelPosition
  labelWidth?: string
  requireMark: boolean
  disabled: boolean
  validateOn: FormValidateTrigger[]
  registerField: (field: WiFormFieldRegistration) => void
  unregisterField: (name: string) => void
  notifyBlur: (name: string) => void
  notifyChange: (name: string) => void
}

export const WI_FORM_KEY: InjectionKey<ComputedRef<WiFormContext>> = Symbol('wiForm')
export const WI_FORM_ERRORS_KEY: InjectionKey<Record<string, string>> = Symbol('wiFormErrors')
