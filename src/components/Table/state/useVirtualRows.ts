import type { ComputedRef, Ref } from 'vue'
import type { TableItem } from '../types'
import { computed } from 'vue'

export interface VirtualRowSlice {
  items: TableItem[]
  startIndex: number
  endIndex: number
  offsetTop: number
  offsetBottom: number
  totalHeight: number
}

/**
 * Window a flat row list for Y-axis virtualization.
 * Disabled callers should pass `enabled=false` and render the full list instead.
 */
export function useVirtualRows(
  enabled: ComputedRef<boolean>,
  items: Ref<TableItem[]> | ComputedRef<TableItem[]>,
  rowHeight: Ref<number>,
  scrollTop: Ref<number>,
  viewportHeight: Ref<number>,
  overscan = 5,
) {
  const slice = computed((): VirtualRowSlice => {
    const list = items.value
    const height = Math.max(1, rowHeight.value)
    const totalHeight = list.length * height

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

    const viewport = Math.max(height, viewportHeight.value || height * 10)
    const rawStart = Math.floor(scrollTop.value / height) - overscan
    const startIndex = Math.max(0, rawStart)
    const visibleCount = Math.ceil(viewport / height) + overscan * 2
    const endIndex = Math.min(list.length, startIndex + visibleCount)
    const offsetTop = startIndex * height
    const offsetBottom = Math.max(0, (list.length - endIndex) * height)

    return {
      items: list.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      offsetTop,
      offsetBottom,
      totalHeight,
    }
  })

  return {
    virtualItems: computed(() => slice.value.items),
    startIndex: computed(() => slice.value.startIndex),
    endIndex: computed(() => slice.value.endIndex),
    offsetTop: computed(() => slice.value.offsetTop),
    offsetBottom: computed(() => slice.value.offsetBottom),
    totalHeight: computed(() => slice.value.totalHeight),
  }
}
