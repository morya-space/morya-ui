/** Auto-generated per-illustration loaders. Prefer editing SVG sources + regenerate. */

import type { EmptyIllustration } from './catalog'

type IllustrationLoader = () => Promise<{ default: string }>

const ILLUSTRATION_LOADERS: Record<EmptyIllustration, IllustrationLoader> = {
  'no-content': () => import('./markup/no-content.ts'),
  'no-result': () => import('./markup/no-result.ts'),
  'no-message': () => import('./markup/no-message.ts'),
  'no-schedule': () => import('./markup/no-schedule.ts'),
  'no-issue': () => import('./markup/no-issue.ts'),
  'network-error': () => import('./markup/network-error.ts'),
  'server-error': () => import('./markup/server-error.ts'),
  'building': () => import('./markup/building.ts'),
  'churn-high': () => import('./markup/churn-high.ts'),
  'conversion-low': () => import('./markup/conversion-low.ts'),
  'activity-low': () => import('./markup/activity-low.ts'),
  'profile-unclear': () => import('./markup/profile-unclear.ts'),
  'input-irregular': () => import('./markup/input-irregular.ts'),
  'payment-cycle-long': () => import('./markup/payment-cycle-long.ts'),
}

/** Load one built-in illustration SVG string (code-split friendly). */
export async function loadEmptyIllustration(
  name: EmptyIllustration,
): Promise<string> {
  const mod = await ILLUSTRATION_LOADERS[name]()
  return mod.default
}
