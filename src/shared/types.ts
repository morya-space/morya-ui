/** Semantic severity (omit / primary = default brand). */
export type WdSeverity =
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'help'
  | 'danger'
  | 'contrast'

export type WdTagSeverity = WdSeverity | 'primary'

export type WdToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'

/** Size tokens; legacy sm/md/lg remain accepted. */
export type WdSize = 'small' | 'large'
export type WdSizeInput = WdSize | 'sm' | 'md' | 'lg'

export type WdInputVariant = 'outlined' | 'filled'

export function resolveSizeClass(size?: WdSizeInput): 'small' | 'normal' | 'large' {
  if (size === 'sm' || size === 'small') return 'small'
  if (size === 'lg' || size === 'large') return 'large'
  return 'normal'
}

/** Map legacy `warning` to `warn`. */
export function normalizeSeverity<T extends string>(severity?: T | 'warning'): T | 'warn' | undefined {
  if (severity === 'warning') return 'warn'
  return severity as T | undefined
}
