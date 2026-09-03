import type { ComputedRef, InjectionKey } from 'vue'
import type { WiSizeInput } from '../../shared/types'

export type RadioValue = string | number | boolean
export type RadioSize = WiSizeInput

export interface RadioProps {
  modelValue?: RadioValue
  value: RadioValue
  label?: string
  id?: string
  name?: string
  size?: RadioSize
  /** Marks the control invalid. */
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export interface RadioEmits {
  (event: 'update:modelValue', value: RadioValue): void
}

export interface RadioGroupProps {
  modelValue?: RadioValue
  name?: string
  label?: string
  size?: RadioSize
  disabled?: boolean
  invalid?: boolean
}

export interface RadioGroupEmits {
  (event: 'update:modelValue', value: RadioValue): void
}

export interface WiRadioGroupContext {
  modelValue: ComputedRef<RadioValue | undefined>
  name: ComputedRef<string | undefined>
  size: ComputedRef<RadioSize | undefined>
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  select: (value: RadioValue) => void
}

export const WI_RADIO_GROUP_KEY: InjectionKey<WiRadioGroupContext> = Symbol('wiRadioGroup')
