import { reactive, type Reactive } from 'vue'
import type { OverlayHostHandle } from '../../shared/overlayHost'
import type { ToastMessage, ToastPosition } from './types'

export const toastState: Reactive<{
  messages: ToastMessage[]
  position: ToastPosition
  max?: number
}> = reactive({
  messages: [],
  position: 'top-right',
  max: undefined,
})

export let toastAutoHost: OverlayHostHandle | null = null
export let toastManualHostCount = 0

const lifeTimers = new Map<string | number, ReturnType<typeof setTimeout>>()

export function setToastAutoHost(host: OverlayHostHandle | null) {
  toastAutoHost = host
}

export function registerToastManualHost() {
  toastManualHostCount += 1
  if (toastAutoHost) {
    toastAutoHost.unmount()
    toastAutoHost = null
  }
}

export function unregisterToastManualHost() {
  toastManualHostCount = Math.max(0, toastManualHostCount - 1)
}

export function resetToastHostRegistry() {
  if (toastAutoHost) {
    toastAutoHost.unmount()
    toastAutoHost = null
  }
  toastManualHostCount = 0
  toastState.position = 'top-right'
  toastState.max = undefined
}

export function clearToastLife(id: string | number) {
  const timer = lifeTimers.get(id)
  if (timer != null) clearTimeout(timer)
  lifeTimers.delete(id)
}

export function scheduleToastLife(item: ToastMessage, onExpire: (id: string | number) => void) {
  clearToastLife(item.id)
  if (item.life == null || item.life <= 0) return
  lifeTimers.set(
    item.id,
    setTimeout(() => {
      onExpire(item.id)
    }, item.life),
  )
}

export function closeToastItem(id?: string | number) {
  if (id == null) {
    clearToastItems()
    return
  }
  clearToastLife(id)
  toastState.messages = toastState.messages.filter((item) => item.id !== id)
}

export function clearToastItems() {
  for (const id of [...lifeTimers.keys()]) clearToastLife(id)
  toastState.messages = []
}

export function applyToastMax(max?: number) {
  if (max == null || max <= 0) return
  while (toastState.messages.length >= max) {
    const oldest = toastState.messages[0]
    if (!oldest) break
    closeToastItem(oldest.id)
  }
}

export function trimToastsToMax(max?: number) {
  if (max == null || max <= 0) return
  while (toastState.messages.length > max) {
    const oldest = toastState.messages[0]
    if (!oldest) break
    closeToastItem(oldest.id)
  }
}
