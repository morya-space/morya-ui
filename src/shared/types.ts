/**
 * Semantic severity (omit / primary = default brand).
 * Canonical vocabulary: `primary / success / info / warning / danger / help / contrast`;
 * `warn` / `error` are accepted as deprecated runtime aliases.
 */
export type WdSeverity =
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  /** @deprecated Use `'warning'` instead. */
  | 'warn'
  | 'help'
  | 'danger'
  | 'contrast'

export type WdTagSeverity = WdSeverity | 'primary'

/** Canonical severities: success/info/warning/danger (+ secondary/contrast). `warn` / `error` are deprecated aliases. */
export type WdToastSeverity =
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
export type WdSize = 'small' | 'medium' | 'large'
export type WdSizeInput = WdSize | 'sm' | 'md' | 'lg'

export type WdInputVariant = 'outlined' | 'filled'

export function resolveSizeClass(size?: WdSizeInput): 'small' | 'normal' | 'large' {
  if (size === 'sm' || size === 'small') return 'small'
  if (size === 'lg' || size === 'large') return 'large'
  return 'normal'
}

/** Map control / chip / tag size to WdIcon size tokens. */
export function resolveIconSize(size?: WdSizeInput): 'sm' | 'md' | 'lg' {
  if (size === 'sm' || size === 'small') return 'sm'
  if (size === 'lg' || size === 'large') return 'lg'
  return 'md'
}

/** Map resolved size class to WdIcon size tokens. */
export function resolveIconSizeFromClass(sizeClass: 'small' | 'normal' | 'large'): 'sm' | 'md' | 'lg' {
  if (sizeClass === 'small') return 'sm'
  if (sizeClass === 'large') return 'lg'
  return 'md'
}

/**
 * Normalize severity aliases onto the vocabulary used by component styles.
 * Only `warning` → `warn` is centralized here today: Toast/Message/Timeline styles and the
 * Message icon map still key on `error`, so `error` → `danger` stays per component
 * (see ProgressBar) until Toast/Message/Timeline migrate off the `error` alias.
 */
export function normalizeSeverity<T extends string>(severity?: T | 'warning'): T | 'warn' | undefined {
  if (severity === 'warning') return 'warn'
  return severity as T | undefined
}
