import type { ComputedRef, InjectionKey } from 'vue'
import type { WiSizeInput } from '../../shared/types'
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

export interface WiFormFieldRegistration {
  name: string
  validate: FormFieldValidator
}

export interface WiFormContext {
  model?: FormModel
  rules?: FormRules
  labelPosition: FormLabelPosition
  labelAlign: FormLabelAlign
  labelWidth?: string | number
  requireMark: boolean
  disabled: boolean
  size?: WiSizeInput
  validateOn: FormValidateTrigger[]
  registerField: (field: WiFormFieldRegistration) => void
  unregisterField: (name: string) => void
  notifyBlur: (name: string) => void
  notifyChange: (name: string) => void
  notifyInput: (name: string) => void
}

export const WI_FORM_KEY: InjectionKey<ComputedRef<WiFormContext>> = Symbol('wiForm')
export const WI_FORM_ERRORS_KEY: InjectionKey<Record<string, string>> = Symbol('wiFormErrors')

export type { FormItemRule }
