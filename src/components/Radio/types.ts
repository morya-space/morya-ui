import type { ComputedRef, InjectionKey } from 'vue'
import type { ControlPassThrough, RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export type RadioValue = string | number | boolean
export type RadioSize = MSizeInput

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
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: ControlPassThrough
}

export interface RadioEmits {
  (event: 'update:modelValue', value: RadioValue): void
}

export interface RadioGroupProps {
  pt?: RootPassThrough
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

export interface MRadioGroupContext {
  modelValue: ComputedRef<RadioValue | undefined>
  name: ComputedRef<string | undefined>
  size: ComputedRef<RadioSize | undefined>
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  select: (value: RadioValue) => void
}

export const M_RADIO_GROUP_KEY: InjectionKey<MRadioGroupContext> = Symbol('muRadioGroup')
