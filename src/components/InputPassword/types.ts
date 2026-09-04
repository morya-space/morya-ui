import type { Component } from 'vue'
import type { WdShowPasswordOn } from '../../shared/componentDefaults'
import type { WdInputVariant, WdSizeInput } from '../../shared/types'
import type { IconName } from '../Icon/types'

export type { WdShowPasswordOn }

export interface InputPasswordProps {
  modelValue?: string
  label?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  fluid?: boolean
  size?: WdSizeInput
  variant?: WdInputVariant
  /** Show password strength hint. */
  feedback?: boolean
  /** Show toggle mask button. */
  toggleMask?: boolean
  /**
   * When to reveal the password.
   * `click` toggles; `mousedown` is hold-to-peek (mouse or Space/Enter).
   */
  showPasswordOn?: WdShowPasswordOn
  clearable?: boolean
  maxlength?: number
  showCount?: boolean
  /** Icon when the value is masked (click to reveal). Built-in `WdIcon` name or a Vue component. */
  showIcon?: IconName | Component
  /** Icon when the value is visible (click to hide). Built-in `WdIcon` name or a Vue component. */
  hideIcon?: IconName | Component
  id?: string
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
