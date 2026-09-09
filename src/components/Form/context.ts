import type { ComputedRef, InjectionKey } from 'vue'
import type { MSizeInput } from '../../shared/types'
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

export interface MFormFieldRegistration {
  name: string
  validate: FormFieldValidator
}

export interface MFormContext {
  model?: FormModel
  rules?: FormRules
  labelPosition: FormLabelPosition
  labelAlign: FormLabelAlign
  labelWidth?: string | number
  requireMark: boolean
  disabled: boolean
  size?: MSizeInput
  validateOn: FormValidateTrigger[]
  registerField: (field: MFormFieldRegistration) => void
  unregisterField: (name: string) => void
  notifyBlur: (name: string) => void
  notifyChange: (name: string) => void
  notifyInput: (name: string) => void
}

export const M_FORM_KEY: InjectionKey<ComputedRef<MFormContext>> = Symbol('muForm')
export const M_FORM_ERRORS_KEY: InjectionKey<Record<string, string>> = Symbol('muFormErrors')

export type { FormItemRule }
