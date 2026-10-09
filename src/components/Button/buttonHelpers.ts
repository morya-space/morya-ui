import type {
  ButtonColor,
  ButtonColorVariantPair,
  ButtonLoading,
  ButtonResolvedAppearance,
  ButtonType,
  ButtonVariant,
} from './types'

const rxTwoCNChar = /^[\u4E00-\u9FA5]{2}$/

export const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)

export function isUnBorderedButtonVariant(variant?: ButtonVariant): boolean {
  return variant === 'text' || variant === 'link'
}

export const ButtonTypeMap: Record<ButtonType, ButtonColorVariantPair> = {
  default: ['default', 'outlined'],
  primary: ['primary', 'solid'],
  dashed: ['default', 'dashed'],
  link: ['link', 'link'],
  text: ['default', 'text'],
}

export interface ResolveColorVariantOptions {
  color?: ButtonColor
  variant?: ButtonVariant
  type?: ButtonType
  danger?: boolean
  contextColor?: ButtonColor
  contextVariant?: ButtonVariant
}

export function resolveColorVariant(options: ResolveColorVariantOptions): ButtonColorVariantPair {
  const {
    color,
    variant,
    type,
    danger = false,
    contextColor,
    contextVariant,
  } = options

  if (color && variant) {
    return [color, variant]
  }

  const mergedType = type || 'default'

  if (type || danger) {
    const pair = ButtonTypeMap[mergedType] ?? ButtonTypeMap.default
    if (danger) {
      return ['danger', pair[1]]
    }
    return pair
  }

  if (variant === 'solid') {
    return ['primary', variant]
  }

  if (contextColor && contextVariant) {
    return [contextColor, contextVariant]
  }

  if (contextVariant === 'solid') {
    return ['primary', contextVariant]
  }

  if (color) {
    return [color, variant ?? 'outlined']
  }

  if (variant) {
    return ['default', variant]
  }

  return ['default', 'outlined']
}

export function resolveButtonAppearance(options: ResolveColorVariantOptions & {
  ghost?: boolean
}): ButtonResolvedAppearance {
  const [parsedColor, parsedVariant] = resolveColorVariant(options)
  const ghost = Boolean(options.ghost) && !isUnBorderedButtonVariant(parsedVariant)

  if (ghost && parsedVariant === 'solid') {
    return { color: parsedColor, variant: 'outlined', ghost: true }
  }

  return { color: parsedColor, variant: parsedVariant, ghost }
}

export interface LoadingConfig {
  loading: boolean
  delay: number
  icon?: Extract<ButtonLoading, object>['icon']
}

export function getLoadingConfig(loading: ButtonLoading | undefined): LoadingConfig {
  if (loading && typeof loading === 'object') {
    const delay = typeof loading.delay === 'number' && loading.delay > 0 ? loading.delay : 0
    return {
      loading: delay <= 0,
      delay,
      icon: loading.icon,
    }
  }

  return {
    loading: Boolean(loading),
    delay: 0,
  }
}

/** Insert a thin space between two CJK characters when enabled. */
export function formatButtonLabel(label: string, insertSpace: boolean): string {
  const trimmed = label.trim()
  if (!insertSpace || !isTwoCNChar(trimmed)) return label
  return `${trimmed[0]} ${trimmed[1]}`
}
