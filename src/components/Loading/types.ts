import type { MRenderable } from '../../shared/content'
import type { RootPassThrough } from '../../shared/passThrough'
import type { MSizeInput } from '../../shared/types'

/** Built-in spinner graphics. */
export const LOADING_EFFECTS = ['circular', 'aurora', 'bounce', 'wave', 'pulse', 'stardust'] as const

export type LoadingEffect = (typeof LOADING_EFFECTS)[number]

const EFFECT_SET = new Set<string>(LOADING_EFFECTS)

export function isLoadingEffect(value: unknown): value is LoadingEffect {
  return typeof value === 'string' && EFFECT_SET.has(value)
}

export function normalizeLoadingEffect(value: unknown): LoadingEffect {
  return isLoadingEffect(value) ? value : 'circular'
}

export interface LoadingProps {
  pt?: RootPassThrough
  /**
   * Whether the mask is visible when wrapping content or using `fullscreen`.
   * A bare indicator (no default slot and not fullscreen) is always shown.
   */
  loading?: boolean
  /** Spinner graphic. Defaults to `circular`. */
  effect?: LoadingEffect
  /** Caption under the spinner. Hidden when omitted. */
  text?: string
  /** Accessible name. Falls back to `text`, then the locale `loading` string. */
  ariaLabel?: string
  size?: MSizeInput
  /** Mask background. Any CSS color. */
  background?: string
  /** Extra class on the mask. */
  customClass?: string
  /** Cover the viewport (teleported to `body`). */
  fullscreen?: boolean
  /** Prevent document scrolling while the mask is visible. */
  lock?: boolean
  /** Delay in ms before showing the mask. */
  delay?: number
}

/** Options for `v-loading` when the binding is an object. */
export interface LoadingBinding {
  loading?: boolean
  text?: string
  effect?: LoadingEffect
  background?: string
  customClass?: string
  size?: MSizeInput
  fullscreen?: boolean
  lock?: boolean
  body?: boolean
  delay?: number
  /** Custom indicator content. */
  spinner?: MRenderable
}

/** Options for `loading.service()`. */
export interface LoadingServiceOptions {
  /** Element or selector to cover. Omitted means fullscreen. */
  target?: string | HTMLElement
  /** Mount the mask on `document.body`, positioned over `target`. */
  body?: boolean
  /** Cover the viewport. Defaults to `true` when `target` is omitted. */
  fullscreen?: boolean
  /** Prevent document scrolling while open. */
  lock?: boolean
  text?: string
  effect?: LoadingEffect
  background?: string
  customClass?: string
  size?: MSizeInput
  delay?: number
  /** Custom indicator content. When set, built-in effects are skipped. */
  spinner?: MRenderable
}

export interface LoadingServiceInstance {
  close: () => void
  setText: (text: string) => void
  /** Immediate teardown without the leave transition. */
  destroy: () => void
}
