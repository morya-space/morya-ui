import type { ContextMenuPosition } from './types'
import { ref } from 'vue'

/** Imperative helpers for `<WiContextMenu v-model / v-model:position>`. */
export function useContextMenu() {
  const visible = ref(false)
  const position = ref<ContextMenuPosition>({ x: 0, y: 0 })

  function show(event: MouseEvent | ContextMenuPosition) {
    if ('preventDefault' in event) event.preventDefault()
    const next =
      'clientX' in event ? { x: event.clientX, y: event.clientY } : { x: event.x, y: event.y }
    position.value = next
    visible.value = true
  }

  function hide() {
    visible.value = false
  }

  return { visible, position, show, hide }
}
