/** Auto-generated per-illustration loaders. Prefer editing SVG sources + regenerate. */

import type { EmptyIllustration } from './catalog'

type IllustrationLoader = () => Promise<{ default: string }>

const ILLUSTRATION_LOADERS: Record<EmptyIllustration, IllustrationLoader> = {
  'no-content': () => import('./markup/no-content'),
  'no-result': () => import('./markup/no-result'),
  'no-message': () => import('./markup/no-message'),
  'no-schedule': () => import('./markup/no-schedule'),
  'no-issue': () => import('./markup/no-issue'),
  'network-error': () => import('./markup/network-error'),
  'server-error': () => import('./markup/server-error'),
  'building': () => import('./markup/building'),
  'churn-high': () => import('./markup/churn-high'),
  'conversion-low': () => import('./markup/conversion-low'),
  'activity-low': () => import('./markup/activity-low'),
  'profile-unclear': () => import('./markup/profile-unclear'),
  'input-irregular': () => import('./markup/input-irregular'),
  'payment-cycle-long': () => import('./markup/payment-cycle-long'),
}

/** Load one built-in illustration SVG string (code-split friendly). */
export async function loadEmptyIllustration(
  name: EmptyIllustration,
): Promise<string> {
  const mod = await ILLUSTRATION_LOADERS[name]()
  return mod.default
}
