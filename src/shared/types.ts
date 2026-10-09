/**
 * Semantic tone for display / feedback components.
 * Canonical vocabulary: `primary / secondary / success / info / warning / danger / help / contrast`.
 */
export type MToneType =
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'help'
  | 'danger'
  | 'contrast'

/** Tag / Badge / Chip / Status tone presets (includes brand `primary`). */
export type MTagType = MToneType | 'primary'

/** Message / Toast / Timeline tone presets. */
export type MToastType =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'secondary'
  | 'contrast'

/** Size tokens; legacy sm/md/lg remain accepted. */
export type MSize = 'small' | 'medium' | 'large'
export type MSizeInput = MSize | 'sm' | 'md' | 'lg'

export type MInputVariant = 'outlined' | 'filled'

/**
 * Visual validate status for form controls.
 * Prefer boolean `invalid` for error; use `status="warning"` for caution chrome.
 */
export type MFieldStatus = 'error' | 'warning'

export function resolveSizeClass(size?: MSizeInput): 'small' | 'normal' | 'large' {
  if (size === 'sm' || size === 'small') return 'small'
  if (size === 'lg' || size === 'large') return 'large'
  return 'normal'
}

/** Map control / chip / tag size to MIcon size tokens. */
export function resolveIconSize(size?: MSizeInput): 'sm' | 'md' | 'lg' {
  if (size === 'sm' || size === 'small') return 'sm'
  if (size === 'lg' || size === 'large') return 'lg'
  return 'md'
}

/** Map resolved size class to MIcon size tokens. */
export function resolveIconSizeFromClass(sizeClass: 'small' | 'normal' | 'large'): 'sm' | 'md' | 'lg' {
  if (sizeClass === 'small') return 'sm'
  if (sizeClass === 'large') return 'lg'
  return 'md'
}
