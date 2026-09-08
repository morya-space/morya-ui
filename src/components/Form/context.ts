import type { ComputedRef, InjectionKey } from 'vue'
import type { WkSizeInput } from '../../shared/types'
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

export interface WkFormFieldRegistration {
  name: string
  validate: FormFieldValidator
}

export interface WkFormContext {
  model?: FormModel
  rules?: FormRules
  labelPosition: FormLabelPosition
  labelAlign: FormLabelAlign
  labelWidth?: string | number
  requireMark: boolean
  disabled: boolean
  size?: WkSizeInput
  validateOn: FormValidateTrigger[]
  registerField: (field: WkFormFieldRegistration) => void
  unregisterField: (name: string) => void
  notifyBlur: (name: string) => void
  notifyChange: (name: string) => void
  notifyInput: (name: string) => void
}

export const WK_FORM_KEY: InjectionKey<ComputedRef<WkFormContext>> = Symbol('rdForm')
export const WK_FORM_ERRORS_KEY: InjectionKey<Record<string, string>> = Symbol('rdFormErrors')

export type { FormItemRule }
