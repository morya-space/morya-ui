import type { ComputedRef, InjectionKey } from 'vue'
import type { WdSizeInput } from '../../shared/types'
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

export interface WdFormFieldRegistration {
  name: string
  validate: FormFieldValidator
}

export interface WdFormContext {
  model?: FormModel
  rules?: FormRules
  labelPosition: FormLabelPosition
  labelAlign: FormLabelAlign
  labelWidth?: string | number
  requireMark: boolean
  disabled: boolean
  size?: WdSizeInput
  validateOn: FormValidateTrigger[]
  registerField: (field: WdFormFieldRegistration) => void
  unregisterField: (name: string) => void
  notifyBlur: (name: string) => void
  notifyChange: (name: string) => void
  notifyInput: (name: string) => void
}

export const WD_FORM_KEY: InjectionKey<ComputedRef<WdFormContext>> = Symbol('wdForm')
export const WD_FORM_ERRORS_KEY: InjectionKey<Record<string, string>> = Symbol('wdFormErrors')

export type { FormItemRule }
