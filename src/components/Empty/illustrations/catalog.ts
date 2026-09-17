/** Auto-generated illustration keys. Prefer editing SVG sources + regenerate. */

export const EMPTY_ILLUSTRATION_KEYS = [
  'no-content',
  'no-result',
  'no-message',
  'no-schedule',
  'no-issue',
  'network-error',
  'server-error',
  'building',
  'churn-high',
  'conversion-low',
  'activity-low',
  'profile-unclear',
  'input-irregular',
  'payment-cycle-long',
] as const

export type EmptyIllustration = (typeof EMPTY_ILLUSTRATION_KEYS)[number]

export function isEmptyIllustration(value: string): value is EmptyIllustration {
  return (EMPTY_ILLUSTRATION_KEYS as readonly string[]).includes(value)
}
