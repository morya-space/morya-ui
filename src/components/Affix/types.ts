import type { RootPassThrough } from '../../shared/passThrough'

export interface AffixProps {
  pt?: RootPassThrough
  /** Distance from top of scroll container when affixed (`offsetTop`). Default `0` when bottom unset. */
  offsetTop?: number
  /** Distance from bottom of scroll container when affixed (`offsetBottom`). */
  offsetBottom?: number
  /** Scroll container; defaults to `window`. */
  target?: () => HTMLElement | Window | null
  /** When true, behaves like a normal static block. */
  disabled?: boolean
}

export interface AffixEmits {
  change: [affixed: boolean]
}
