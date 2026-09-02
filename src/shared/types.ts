/**
 * Semantic severity (omit / primary = default brand).
 * Canonical vocabulary: `primary / success / info / warning / danger / help / contrast`;
 * `warn` / `error` are accepted as deprecated runtime aliases.
 */
export type WiSeverity =
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  /** @deprecated Use `'warning'` instead. */
  | 'warn'
  | 'help'
  | 'danger'
  | 'contrast'

export type WiTagSeverity = WiSeverity | 'primary'

/** Canonical severities: success/info/warning/danger (+ secondary/contrast). `warn` / `error` are deprecated aliases. */
export type WiToastSeverity =
  | 'success'
  | 'info'
  | 'warning'
  /** @deprecated Use `'warning'` instead. */
  | 'warn'
  | 'danger'
  /** @deprecated Use `'danger'` instead. */
  | 'error'
  | 'secondary'
  | 'contrast'

/** Size tokens; legacy sm/md/lg remain accepted. */
export type WiSize = 'small' | 'medium' | 'large'
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

/**
 * Normalize severity aliases onto the vocabulary used by component styles.
 * Only `warning` → `warn` is centralized here today: Toast/Message/Timeline styles and the
 * Message icon map still key on `error`, so `error` → `danger` stays per component
 * (see ProgressBar) until those consumers migrate (fix-plan T3.7).
 */
export function normalizeSeverity<T extends string>(severity?: T | 'warning'): T | 'warn' | undefined {
  if (severity === 'warning') return 'warn'
  return severity as T | undefined
}
