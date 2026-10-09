import type { ButtonHTMLAttributes, Component, CSSProperties } from 'vue'
import type { PassThroughPart } from '../../shared/passThrough'
import type { IconName } from '../Icon/types'

/** Sugar type that maps to a `[color, variant]` pair. */
export type ButtonType = 'default' | 'primary' | 'dashed' | 'link' | 'text'

/** Color axis. `link` is an internal tone used by `type="link"`. */
export type ButtonColor =
  | 'default'
  | 'primary'
  | 'danger'
  | 'success'
  | 'info'
  | 'warning'
  | 'help'
  | 'contrast'
  | 'link'

/** Visual variant axis. */
export type ButtonVariant = 'solid' | 'outlined' | 'dashed' | 'filled' | 'text' | 'link'

/** Corner shape. */
export type ButtonShape = 'default' | 'circle' | 'round' | 'square'

export type ButtonSize = 'small' | 'medium' | 'large'

export type ButtonIconPlacement = 'start' | 'end'

export type ButtonHtmlType = NonNullable<ButtonHTMLAttributes['type']>

export type ButtonLoading =
  | boolean
  | {
      delay?: number
      icon?: IconName | Component
    }

export interface ButtonPassThrough {
  root?: PassThroughPart
  icon?: PassThroughPart
  content?: PassThroughPart
}

export interface ButtonProps {
  /** Sugar for a preset `[color, variant]` pair. Overridden when both `color` and `variant` are set. */
  type?: ButtonType
  /** Color axis. */
  color?: ButtonColor
  /** Variant axis. */
  variant?: ButtonVariant
  /** Force danger color while keeping the resolved variant. */
  danger?: boolean
  /** Transparent background; ignored for `text` / `link` variants. */
  ghost?: boolean
  /** Corner shape. */
  shape?: ButtonShape
  /** Control size. Also accepts legacy `sm` / `md` / `lg`. */
  size?: ButtonSize | 'sm' | 'md' | 'lg'
  /** Stretch to full container width. */
  block?: boolean
  /** Loading state. Object form supports delay and a custom icon. */
  loading?: ButtonLoading
  disabled?: boolean
  /** Native button `type` when rendered as `<button>`. */
  htmlType?: ButtonHtmlType
  /** Render as an anchor when set. */
  href?: string
  /** Anchor target; only applies with `href`. */
  target?: string
  /** Button label. Ignored when the default slot has content. */
  label?: string
  /** Leading/trailing icon from MIcon, or a Vue component. */
  icon?: IconName | Component
  /** Icon placement relative to the label. */
  iconPlacement?: ButtonIconPlacement
  /** Force square icon-only footprint. */
  iconOnly?: boolean
  /** Insert a space between two Chinese characters. */
  autoInsertSpace?: boolean
  autofocus?: boolean
  /** Accessible name, recommended for icon-only buttons. */
  ariaLabel?: string
  /** Click ripple ink. Disabled when theme motion is `none`. */
  ripple?: boolean
  /** Press scale on click. */
  press?: boolean
  /** Semantic DOM pass-through. */
  pt?: ButtonPassThrough
}

export interface ButtonEmits {
  (event: 'click', value: MouseEvent): void
}

export interface ButtonInstance {
  focus: () => void
  ref: HTMLButtonElement | HTMLAnchorElement | null
}

export interface ButtonGroupProps {
  pt?: { root?: PassThroughPart }
  /** Stretch to full container width. */
  block?: boolean
  /** Accessible name for the group. */
  ariaLabel?: string
}

export type ButtonColorVariantPair = [color: ButtonColor, variant: ButtonVariant]

export interface ButtonResolvedAppearance {
  color: ButtonColor
  variant: ButtonVariant
  ghost: boolean
}

/** Style bag used when merging content pass-through. */
export type ButtonContentStyle = CSSProperties
