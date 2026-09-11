import type { Component } from 'vue'
import type { MShowPasswordOn } from '../../shared/componentDefaults'
import type { MNativeInputProps } from '../../shared/nativeControlProps'
import type { FieldPassThrough } from '../../shared/passThrough'
import type { MInputVariant, MSizeInput } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type { MShowPasswordOn }

export interface InputPasswordProps extends MNativeInputProps {
  modelValue?: string
  label?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  fluid?: boolean
  size?: MSizeInput
  variant?: MInputVariant
  /** Show password strength hint. */
  feedback?: boolean
  /** Show toggle mask button. */
  toggleMask?: boolean
  /**
   * When to reveal the password.
   * `click` toggles; `mousedown` is hold-to-peek (mouse or Space/Enter).
   */
  showPasswordOn?: MShowPasswordOn
  clearable?: boolean
  maxlength?: number
  showCount?: boolean
  /** Icon when the value is masked (click to reveal). Built-in `MIcon` name or a Vue component. */
  showIcon?: IconName | Component
  /** Icon when the value is visible (click to hide). Built-in `MIcon` name or a Vue component. */
  hideIcon?: IconName | Component
  id?: string
  /** Pass-through attrs/classes/styles per DOM part. */
  pt?: FieldPassThrough
}

export interface InputPasswordEmits {
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
  (event: 'change', value: string): void
}

export interface InputPasswordInstance {
  focus: () => void
  blur: () => void
  select: () => void
}

export interface InputPasswordSlots {
  /** Replace the “show password” icon. */
  showIcon?: (props: { unmasked: boolean }) => unknown
  /** Replace the “hide password” icon. */
  hideIcon?: (props: { unmasked: boolean }) => unknown
}

export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong'
