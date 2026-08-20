import type { ButtonHTMLAttributes, Component } from 'vue'
import type { IconName } from '../Icon/types'

/** Color tone aligned with `severity`. Omit for primary. */
export type ButtonSeverity =
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'help'
  | 'danger'
  | 'contrast'

/** Visual variant aligned with `variant`. */
export type ButtonVariant = 'outlined' | 'text' | 'link'

export type ButtonSize = 'small' | 'large'

export type ButtonIconPos = 'left' | 'right' | 'top' | 'bottom'

export type ButtonBadgeSeverity = Exclude<ButtonSeverity, 'help'> | null

export interface ButtonProps {
  /** Button label text. Ignored when default slot has content. */
  label?: string
  /** Leading/trailing icon from WiIcon, or a Vue component. */
  icon?: IconName | Component
  /** Icon position relative to the label. */
  iconPos?: ButtonIconPos
  /** Force square icon-only footprint. */
  iconOnly?: boolean
  /** Semantic color. Omit for primary. */
  severity?: ButtonSeverity
  /** Elevated shadow. */
  raised?: boolean
  /** Fully rounded corners. */
  rounded?: boolean
  /** Textual button without solid fill. */
  text?: boolean
  /** Border-only button. */
  outlined?: boolean
  /** Link-styled button. */
  link?: boolean
  /** Muted/plain treatment for text or outlined. */
  plain?: boolean
  /** Shortcut for outlined / text / link. */
  variant?: ButtonVariant
  /** Size alternative to the default. Also accepts legacy `sm` / `md` / `lg`. */
  size?: ButtonSize | 'sm' | 'md' | 'lg'
  /** Full-width button. */
  fluid?: boolean
  /** @deprecated Prefer `fluid`. */
  block?: boolean
  loading?: boolean
  disabled?: boolean
  /** Optional badge value rendered after the label. */
  badge?: string
  badgeSeverity?: ButtonBadgeSeverity
  autofocus?: boolean
  /** Native button `type` attribute. */
  nativeType?: ButtonHTMLAttributes['type']
  /** Accessible name, recommended for icon-only buttons. */
  ariaLabel?: string
}

export interface ButtonEmits {
  (event: 'click', value: MouseEvent): void
}

export interface ButtonInstance {
  focus: () => void
  ref: HTMLButtonElement | null
}
