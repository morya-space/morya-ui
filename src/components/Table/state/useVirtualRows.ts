import type { ComputedRef, Ref } from 'vue'
import type { TableItem } from '../types'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { resolveRowKey } from '../core/utils'

export interface VirtualRowSlice {
  items: TableItem[]
  startIndex: number
  endIndex: number
  offsetTop: number
  offsetBottom: number
  totalHeight: number
}

export interface UseVirtualRowsOptions {
  /**
   * When true, row heights are measured via ResizeObserver after render and
   * cached by `rowKey`. When false (default), every row is assumed to be
   * exactly `rowHeight` — faster and preferred when rows are uniform.
   */
  dynamic?: ComputedRef<boolean>
  /** Stable row key field used to cache measured heights across re-renders. */
  rowKey?: Ref<string>
}

/**
 * Window a flat row list for Y-axis virtualization.
 *
 * Two modes:
 * - **Fixed** (default): all rows have `rowHeight`. Offsets are O(1).
 * - **Dynamic**: each row's height is measured via ResizeObserver after render.
 *   Unmeasured rows use `rowHeight` as an estimate. A prefix-sum cache is kept
 *   so offset lookups stay O(log n) on the scroll hot path.
 */
export function useVirtualRows(
  enabled: ComputedRef<boolean>,
  items: Ref<TableItem[]> | ComputedRef<TableItem[]>,
  rowHeight: Ref<number>,
  scrollTop: Ref<number>,
  viewportHeight: Ref<number>,
  overscan = 5,
  options: UseVirtualRowsOptions = {},
) {
  const dynamic = computed(() => Boolean(options.dynamic?.value))
  const rowKeyField = computed(() => options.rowKey?.value ?? 'id')

  /** Measured heights keyed by rowKey. */
  const measuredHeights = ref(new Map<string | number, number>())

  /** Evict measurements for rows that no longer exist to bound memory. */
  watch(
    () => items.value,
    (next, prev) => {
      if (next === prev) return
      const keySet = new Set<string | number>()
      next.forEach((row, index) => keySet.add(resolveRowKey(row, index, rowKeyField.value)))
      const nextMap = new Map<string | number, number>()
      for (const [key, height] of measuredHeights.value) {
        if (keySet.has(key)) nextMap.set(key, height)
      }
      measuredHeights.value = nextMap
    },
  )

  /**
   * Prefix-sum of heights: `prefixOffsets[i]` is the offset of row `i` from
   * the list top. Recomputed when items or measurements change. Length is
   * `items.length + 1`; `prefixOffsets[items.length]` is `totalHeight`.
   */
  const prefixOffsets = computed(() => {
    const list = items.value
    const estimate = Math.max(1, rowHeight.value)
    const arr = new Array<number>(list.length + 1)
    arr[0] = 0
    if (!dynamic.value) {
      for (let i = 0; i < list.length; i += 1) arr[i + 1] = (i + 1) * estimate
      return arr
    }
    const measurements = measuredHeights.value
    for (let i = 0; i < list.length; i += 1) {
      const key = resolveRowKey(list[i]!, i, rowKeyField.value)
      const h = measurements.get(key) ?? estimate
      arr[i + 1] = arr[i]! + h
    }
    return arr
  })

  /** Binary search: largest index whose offset is ≤ `scrollTop`. */
  function findStartIndex(scroll: number): number {
    const arr = prefixOffsets.value
    if (!dynamic.value) {
      const estimate = Math.max(1, rowHeight.value)
      return Math.floor(scroll / estimate)
    }
    let lo = 0
    let hi = items.value.length - 1
    let result = 0
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if (arr[mid]! <= scroll) {
        result = mid
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }
    return result
  }

  const slice = computed((): VirtualRowSlice => {
    const list = items.value
    const arr = prefixOffsets.value
    const totalHeight = arr[list.length] ?? 0

    if (!enabled.value || list.length === 0) {
      return {
        items: list,
        startIndex: 0,
        endIndex: list.length,
        offsetTop: 0,
        offsetBottom: 0,
        totalHeight,
      }
    }

    const estimate = Math.max(1, rowHeight.value)
    const viewport = Math.max(estimate, viewportHeight.value || estimate * 10)
    const rawStart = findStartIndex(scrollTop.value) - overscan
    const startIndex = Math.max(0, rawStart)

    // Walk forward from startIndex until we cover viewport + overscan.
    const target = viewport + overscan * 2 * estimate
    const startOffset = arr[startIndex]!
    let endIndex = startIndex
    while (endIndex < list.length && arr[endIndex + 1]! - startOffset < target) {
      endIndex += 1
    }

    const offsetTop = startOffset
    const offsetBottom = Math.max(0, totalHeight - (arr[endIndex] ?? totalHeight))

    return {
      items: list.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      offsetTop,
      offsetBottom,
      totalHeight,
    }
  })

  /* — Measurement — */

  let observer: ResizeObserver | undefined
  const observed = new WeakSet<Element>()

  function observeRow(el: HTMLElement | null, row: TableItem, index: number) {
    if (!dynamic.value) return
    if (!el) return
    if (typeof ResizeObserver === 'undefined') return
    if (observed.has(el)) return
    observed.add(el)
    if (!observer) {
      observer = new ResizeObserver((entries) => {
        let changed = false
        const nextMap = new Map(measuredHeights.value)
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          const keyAttr = el.dataset.rowKey
          if (!keyAttr) continue
          const numKey = Number(keyAttr)
          const key: string | number = Number.isNaN(numKey) ? keyAttr : numKey
          const next = entry.contentRect.height
          if (nextMap.get(key) !== next) {
            nextMap.set(key, next)
            changed = true
          }
        }
        if (changed) measuredHeights.value = nextMap
      })
    }
    observer.observe(el)
  }

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = undefined
  })

  watch(dynamic, (on) => {
    if (!on) {
      observer?.disconnect()
      observer = undefined
      measuredHeights.value = new Map()
    }
  })

  return {
    virtualItems: computed(() => slice.value.items),
    startIndex: computed(() => slice.value.startIndex),
    endIndex: computed(() => slice.value.endIndex),
    offsetTop: computed(() => slice.value.offsetTop),
    offsetBottom: computed(() => slice.value.offsetBottom),
    totalHeight: computed(() => slice.value.totalHeight),
    /** Call from a `:ref` on each `<tr>` to feed measurements when `dynamic`. */
    observeRow,
    dynamicEnabled: dynamic,
  }
}
