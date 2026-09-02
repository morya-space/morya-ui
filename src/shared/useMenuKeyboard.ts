import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { computed, ref, toValue, watch } from 'vue'

export type MenuKeyboardOrientation = 'vertical' | 'horizontal' | 'both'

export interface UseMenuKeyboardOptions {
  /** Total number of rendered items. Reactive sources are supported. */
  itemCount: MaybeRefOrGetter<number>
  /** Items reported as disabled are skipped by every navigation key. */
  isItemDisabled?: (index: number) => boolean
  /** Arrow keys used for navigation: `vertical` (`↑/↓`, default), `horizontal` (`←/→`) or `both`. */
  orientation?: MaybeRefOrGetter<MenuKeyboardOrientation>
  /** Wrap around at the first/last item. Default `true`. */
  wrap?: MaybeRefOrGetter<boolean>
  /** Keys are ignored while this resolves to `false` (e.g. closed popup). Default `true`. */
  enabled?: MaybeRefOrGetter<boolean>
  /** Highlighted index before any key is pressed. Default `-1` (none). */
  initialActiveIndex?: number
  /** Enter/Space pressed with a highlighted, enabled item. */
  onActivate?: (index: number, event: KeyboardEvent) => void
  /** Escape pressed. */
  onEscape?: (event: KeyboardEvent) => void
  /** Focused after Escape (typically the trigger element), mirroring Dropdown's focus return. */
  returnFocusTo?: MaybeRefOrGetter<HTMLElement | null | undefined>
  /** Resolve the DOM id of an item to expose `aria-activedescendant`. */
  getItemId?: (index: number) => string | undefined
}

export interface UseMenuKeyboardReturn {
  /** Index of the highlighted item, `-1` when nothing is highlighted. */
  activeIndex: Ref<number>
  /** Id of the highlighted item, bound as `aria-activedescendant` on the container. */
  activeDescendantId: ComputedRef<string | undefined>
  /** Roving tabindex helper: `0` for the highlighted item, `-1` for the rest. */
  tabindexFor: (index: number) => 0 | -1
  /** Container keydown handler. */
  onKeydown: (event: KeyboardEvent) => void
  /** Move the highlight one step in the direction of `delta`, skipping disabled items. */
  move: (delta: number) => void
  /** Highlight the first enabled item. */
  moveFirst: () => void
  /** Highlight the last enabled item. */
  moveLast: () => void
  setActive: (index: number) => void
  /** Restore the initial highlight, e.g. when reopening a popup. */
  reset: () => void
}

function resolveFlag(value: MaybeRefOrGetter<boolean> | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return Boolean(toValue(value))
}

/**
 * Shared roving-tabindex keyboard navigation for menu/list-like overlays
 * (Menu, Listbox, TreeSelect, ...). DOM-agnostic: callers map `activeIndex`
 * to DOM ids/classes themselves. Baseline semantics: Dropdown's keydown logic.
 */
export function useMenuKeyboard(options: UseMenuKeyboardOptions): UseMenuKeyboardReturn {
  const activeIndex = ref(options.initialActiveIndex ?? -1)

  function isDisabled(index: number): boolean {
    return Boolean(options.isItemDisabled?.(index))
  }

  function findNext(from: number, delta: number): number {
    const count = toValue(options.itemCount)
    if (count <= 0) return -1
    const wrap = resolveFlag(options.wrap, true)
    let candidate = from
    for (let step = 0; step < count; step++) {
      let next = candidate + delta
      if (wrap) next = ((next % count) + count) % count
      else if (next < 0 || next >= count) return -1
      candidate = next
      if (!isDisabled(candidate)) return candidate
    }
    return -1
  }

  function findEdge(delta: 1 | -1): number {
    const count = toValue(options.itemCount)
    for (let step = 0; step < count; step++) {
      const index = delta === 1 ? step : count - 1 - step
      if (!isDisabled(index)) return index
    }
    return -1
  }

  function move(delta: number) {
    const next = findNext(activeIndex.value, delta < 0 ? -1 : 1)
    if (next !== -1) activeIndex.value = next
  }

  function moveFirst() {
    const first = findEdge(1)
    if (first !== -1) activeIndex.value = first
  }

  function moveLast() {
    const last = findEdge(-1)
    if (last !== -1) activeIndex.value = last
  }

  function setActive(index: number) {
    activeIndex.value = index
  }

  function reset() {
    activeIndex.value = options.initialActiveIndex ?? -1
  }

  const activeDescendantId = computed(() => {
    if (activeIndex.value < 0 || !options.getItemId) return undefined
    return options.getItemId(activeIndex.value)
  })

  function tabindexFor(index: number): 0 | -1 {
    return index === activeIndex.value ? 0 : -1
  }

  function arrowDelta(key: string): number | null {
    const orientation = toValue(options.orientation) ?? 'vertical'
    if (orientation !== 'horizontal') {
      if (key === 'ArrowDown') return 1
      if (key === 'ArrowUp') return -1
    }
    if (orientation !== 'vertical') {
      if (key === 'ArrowRight') return 1
      if (key === 'ArrowLeft') return -1
    }
    return null
  }

  function onKeydown(event: KeyboardEvent) {
    if (!resolveFlag(options.enabled, true)) return
    if (event.key === 'Escape') {
      event.preventDefault()
      options.onEscape?.(event)
      toValue(options.returnFocusTo)?.focus({ preventScroll: true })
      return
    }
    const delta = arrowDelta(event.key)
    if (delta !== null) {
      event.preventDefault()
      move(delta)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      moveFirst()
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      moveLast()
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      const index = activeIndex.value
      if (index >= 0 && index < toValue(options.itemCount) && !isDisabled(index)) {
        event.preventDefault()
        options.onActivate?.(index, event)
      }
    }
  }

  watch(
    () => toValue(options.itemCount),
    (count) => {
      if (count <= 0) {
        if (activeIndex.value !== -1) activeIndex.value = -1
      } else if (activeIndex.value >= count) {
        moveLast()
      }
    },
  )

  return {
    activeIndex,
    activeDescendantId,
    tabindexFor,
    onKeydown,
    move,
    moveFirst,
    moveLast,
    setActive,
    reset,
  }
}
