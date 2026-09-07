import type { ComputedRef, InjectionKey } from 'vue'
import type { RdSizeInput } from '../../shared/types'
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

export interface RdFormFieldRegistration {
  name: string
  validate: FormFieldValidator
}

export interface RdFormContext {
  model?: FormModel
  rules?: FormRules
  labelPosition: FormLabelPosition
  labelAlign: FormLabelAlign
  labelWidth?: string | number
  requireMark: boolean
  disabled: boolean
  size?: RdSizeInput
  validateOn: FormValidateTrigger[]
  registerField: (field: RdFormFieldRegistration) => void
  unregisterField: (name: string) => void
  notifyBlur: (name: string) => void
  notifyChange: (name: string) => void
  notifyInput: (name: string) => void
}

export const RD_FORM_KEY: InjectionKey<ComputedRef<RdFormContext>> = Symbol('rdForm')
export const RD_FORM_ERRORS_KEY: InjectionKey<Record<string, string>> = Symbol('rdFormErrors')

export type { FormItemRule }
