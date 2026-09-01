/** Semantic severity (omit / primary = default brand). */
export type WiSeverity =
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'help'
  | 'danger'
  | 'contrast'

export type WiTagSeverity = WiSeverity | 'primary'

export type WiToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'

/** Size tokens; legacy sm/md/lg remain accepted. */
export type WiSize = 'small' | 'large'
export type WiSizeInput = WiSize | 'sm' | 'md' | 'lg'

export type WiInputVariant = 'outlined' | 'filled'

export function resolveSizeClass(size?: WiSizeInput): 'small' | 'normal' | 'large' {
  if (size === 'sm' || size === 'small') return 'small'
  if (size === 'lg' || size === 'large') return 'large'
  return 'normal'
}

/** Map control / chip / tag size to WiIcon size tokens. */
export function resolveIconSize(size?: WiSizeInput): 'sm' | 'md' | 'lg' {
  if (size === 'sm' || size === 'small') return 'sm'
  if (size === 'lg' || size === 'large') return 'lg'
  return 'md'
}

/** Map resolved size class to WiIcon size tokens. */
export function resolveIconSizeFromClass(sizeClass: 'small' | 'normal' | 'large'): 'sm' | 'md' | 'lg' {
  if (sizeClass === 'small') return 'sm'
  if (sizeClass === 'large') return 'lg'
  return 'md'
}

/** Map legacy `warning` to `warn`. */
export function normalizeSeverity<T extends string>(severity?: T | 'warning'): T | 'warn' | undefined {
  if (severity === 'warning') return 'warn'
  return severity as T | undefined
}
