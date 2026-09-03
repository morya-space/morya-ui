import type { ComputedRef, InjectionKey } from 'vue'
import type { WiSizeInput } from '../../shared/types'

export type CheckboxValue = string | number | boolean
export type CheckboxSize = WiSizeInput

export interface CheckboxProps {
  /** Binary checked state when used outside a group. */
  modelValue?: boolean
  label?: string
  id?: string
  name?: string
  /** Option value. Required when used inside `WiCheckboxGroup`. */
  value?: CheckboxValue
  /** Mixed state. Visual only; does not change `modelValue`. */
  indeterminate?: boolean
  size?: CheckboxSize
  /** Marks the control invalid. */
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

export interface CheckboxEmits {
  (event: 'update:modelValue', value: boolean): void
}

export interface CheckboxGroupProps {
  modelValue?: CheckboxValue[]
  name?: string
  label?: string
  size?: CheckboxSize
  disabled?: boolean
  invalid?: boolean
}

export interface CheckboxGroupEmits {
  (event: 'update:modelValue', value: CheckboxValue[]): void
}

export interface WiCheckboxGroupContext {
  modelValue: ComputedRef<CheckboxValue[]>
  name: ComputedRef<string | undefined>
  size: ComputedRef<CheckboxSize | undefined>
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  toggle: (value: CheckboxValue, checked: boolean) => void
}

export const WI_CHECKBOX_GROUP_KEY: InjectionKey<WiCheckboxGroupContext> = Symbol('wiCheckboxGroup')
