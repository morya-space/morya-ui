import type { Ref } from 'vue'
import type { TableHeader } from '../types'
import type { HeaderForRender } from '../state/internal'
import { onBeforeUnmount } from 'vue'
import { isSyntheticColumn } from '../columns/keys'

/**
 * Column resize with rAF-throttled width updates.
 * Flushes the last pending width on mouseup.
 */
export function useColumnResize(
  headers: Ref<TableHeader[]>,
  activeColumnWidths: Ref<Record<string, number> | null>,
  setActiveColumnWidths: (next: Record<string, number> | null) => void,
) {
  let resizing: { key: string; startX: number; startWidth: number } | null = null
  let pendingResize: { key: string; width: number } | null = null
  let resizeRaf = 0

  function applyPendingResize() {
    if (!pendingResize) return
    const { key, width } = pendingResize
    pendingResize = null
    setActiveColumnWidths({
      ...(activeColumnWidths.value ?? {}),
      [key]: width,
    })
  }

  function onResizeMove(event: MouseEvent) {
    if (!resizing) return
    const { key, startX, startWidth } = resizing
    const header = headers.value.find((item) => item.value === key)
    const minWidth = header?.minWidth ?? 40
    pendingResize = {
      key,
      width: Math.max(minWidth, startWidth + (event.clientX - startX)),
    }
    if (resizeRaf) return
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0
      applyPendingResize()
    })
  }

  function onResizeEnd() {
    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = 0
    }
    applyPendingResize()
    resizing = null
    window.removeEventListener('mousemove', onResizeMove)
    window.removeEventListener('mouseup', onResizeEnd)
  }

  function onResizeStart(header: HeaderForRender, event: MouseEvent) {
    if (!header.resizable || isSyntheticColumn(header.value)) return
    event.preventDefault()
    event.stopPropagation()
    const width = header.width
      ?? headers.value.find((item) => item.value === header.value)?.width
      ?? (event.currentTarget as HTMLElement).parentElement?.getBoundingClientRect().width
      ?? 100
    resizing = { key: header.value, startX: event.clientX, startWidth: width }
    pendingResize = null
    window.addEventListener('mousemove', onResizeMove)
    window.addEventListener('mouseup', onResizeEnd)
  }

  onBeforeUnmount(() => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf)
    window.removeEventListener('mousemove', onResizeMove)
    window.removeEventListener('mouseup', onResizeEnd)
  })

  return { onResizeStart }
}
