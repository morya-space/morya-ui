import './style'
export { default as WiForm } from './Form.vue'
export { default as WiFormItem } from './FormItem.vue'
export type {
  FormInstance,
  FormItemProps,
  FormItemRule,
  FormLabelAlign,
  FormLabelPosition,
  FormModel,
  FormProps,
  FormRules,
  FormValidateResult,
  FormValidateTrigger,
} from './types'
export { WI_FORM_ERRORS_KEY, WI_FORM_KEY } from './context'
export type { FormFieldValidator, WiFormContext, WiFormFieldRegistration } from './context'
