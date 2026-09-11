import type { ComputedRef, InjectionKey } from 'vue'
import type { ControlPassThrough, RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

export type CheckboxValue = string | number | boolean
export type CheckboxSize = MSizeInput

export interface CheckboxProps {
  /** Binary checked state when used outside a group. */
  modelValue?: boolean
  label?: string
  id?: string
  name?: string
  /** Option value. Required when used inside `MCheckboxGroup`. */
  value?: CheckboxValue
  /** Mixed state. Visual only; does not change `modelValue`. */
  indeterminate?: boolean
  size?: CheckboxSize
  /** Marks the control invalid. */
  invalid?: boolean
  disabled?: boolean
  required?: boolean
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: ControlPassThrough
}

export interface CheckboxEmits {
  (event: 'update:modelValue', value: boolean): void
}

export interface CheckboxGroupProps {
  pt?: RootPassThrough
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

export interface MCheckboxGroupContext {
  modelValue: ComputedRef<CheckboxValue[]>
  name: ComputedRef<string | undefined>
  size: ComputedRef<CheckboxSize | undefined>
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  toggle: (value: CheckboxValue, checked: boolean) => void
}

export const M_CHECKBOX_GROUP_KEY: InjectionKey<MCheckboxGroupContext> = Symbol('muCheckboxGroup')
