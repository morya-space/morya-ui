import type { Component } from 'vue'
import type { WiSizeInput } from '../../shared/types'
import type { IconName } from '../Icon/types'

export interface InputPasswordProps {
  modelValue?: string
  label?: string
  disabled?: boolean
  invalid?: boolean
  fluid?: boolean
  size?: WiSizeInput
  /** Show password strength hint. */
  feedback?: boolean
  /** Show toggle mask button. */
  toggleMask?: boolean
  /** Icon when the value is masked (click to reveal). Built-in `WiIcon` name or a Vue component. */
  showIcon?: IconName | Component
  /** Icon when the value is visible (click to hide). Built-in `WiIcon` name or a Vue component. */
  hideIcon?: IconName | Component
  id?: string
}

export interface InputPasswordEmits {
  (event: 'update:modelValue', value: string): void
}

export interface InputPasswordSlots {
  /** Replace the “show password” icon. */
  showIcon?: (props: { unmasked: boolean }) => unknown
  /** Replace the “hide password” icon. */
  hideIcon?: (props: { unmasked: boolean }) => unknown
}

export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong'
