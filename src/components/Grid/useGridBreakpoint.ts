import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Grid breakpoints, matching the Ant Design scale. */
export const GRID_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const

export type GridBreakpoint = keyof typeof GRID_BREAKPOINTS

/** Ascending order used when merging responsive values. */
export const GRID_BREAKPOINT_ORDER: GridBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

/** `xs` is always satisfied (min-width 0), so it has no media query. */
const QUERY_BREAKPOINTS = GRID_BREAKPOINT_ORDER.slice(1)

const mediaQueries = new Map<GridBreakpoint, MediaQueryList>()
const listeners = new Map<GridBreakpoint, (event: MediaQueryListEvent) => void>()
const matched = ref<GridBreakpoint[]>(['xs'])
let subscribers = 0

function syncMatched() {
  matched.value = GRID_BREAKPOINT_ORDER.filter((breakpoint) =>
    breakpoint === 'xs' || (mediaQueries.get(breakpoint)?.matches ?? false),
  )
}

function subscribe() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

  subscribers += 1
  if (subscribers > 1) return

  for (const breakpoint of QUERY_BREAKPOINTS) {
    const query = window.matchMedia(`(min-width: ${GRID_BREAKPOINTS[breakpoint]}px)`)
    const handler = () => syncMatched()

    mediaQueries.set(breakpoint, query)
    listeners.set(breakpoint, handler)
    query.addEventListener('change', handler)
  }

  syncMatched()
}

function unsubscribe() {
  subscribers = Math.max(0, subscribers - 1)
  if (subscribers > 0) return

  for (const [breakpoint, handler] of listeners) {
    mediaQueries.get(breakpoint)?.removeEventListener('change', handler)
  }
  listeners.clear()
  mediaQueries.clear()
  matched.value = ['xs']
}

/**
 * Satisfied grid breakpoints in ascending order (`xs` is always present).
 *
 * One shared listener set is used for the whole app, so every `MRow` / `MCol`
 * can call this without adding its own `matchMedia` subscriptions.
 */
export function useGridBreakpoint(): Ref<GridBreakpoint[]> {
  onMounted(subscribe)
  onBeforeUnmount(unsubscribe)
  return matched
}
