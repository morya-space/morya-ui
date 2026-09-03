import type {Reactive} from 'vue';
import type { OverlayHostHandle } from '../../shared/overlayHost'
import type { ToastMessage, ToastPosition } from './types'
import { plainTextOf } from '../../shared/content'
import { reactive  } from 'vue'

export const toastState: Reactive<{
  messages: ToastMessage[]
  position: ToastPosition
  max?: number
  dedupe?: boolean
}> = reactive({
  messages: [],
  position: 'top-right',
  max: undefined,
  dedupe: true,
})

export let toastAutoHost: OverlayHostHandle | null = null
export let toastManualHostCount = 0

const lifeTimers = new Map<string | number, ReturnType<typeof setTimeout>>()
const lifeRemaining = new Map<string | number, number>()
const lifeStartedAt = new Map<string | number, number>()

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
  toastState.dedupe = true
}

export function toastMessageKey(summary: ToastMessage['summary'], detail?: ToastMessage['detail']) {
  return `${plainTextOf(summary)}::${plainTextOf(detail ?? '')}`
}

export function clearToastLife(id: string | number) {
  const timer = lifeTimers.get(id)
  if (timer != null) clearTimeout(timer)
  lifeTimers.delete(id)
  lifeRemaining.delete(id)
  lifeStartedAt.delete(id)
}

export function pauseToastLife(id: string | number) {
  const timer = lifeTimers.get(id)
  if (timer == null) return
  clearTimeout(timer)
  lifeTimers.delete(id)
  const started = lifeStartedAt.get(id)
  const total = lifeRemaining.get(id)
  if (started != null && total != null) {
    lifeRemaining.set(id, Math.max(0, total - (Date.now() - started)))
  }
}

export function resumeToastLife(id: string | number, onExpire: (id: string | number) => void) {
  const remaining = lifeRemaining.get(id)
  if (remaining == null || remaining <= 0) return
  lifeStartedAt.set(id, Date.now())
  lifeTimers.set(
    id,
    setTimeout(() => {
      onExpire(id)
    }, remaining),
  )
}

export function scheduleToastLife(item: ToastMessage, onExpire: (id: string | number) => void) {
  clearToastLife(item.id)
  if (item.life == null || item.life <= 0) return
  lifeRemaining.set(item.id, item.life)
  lifeStartedAt.set(item.id, Date.now())
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

export function findDuplicateToast(item: ToastMessage) {
  const key = toastMessageKey(item.summary, item.detail)
  return toastState.messages.find(
    (existing) => toastMessageKey(existing.summary, existing.detail) === key,
  )
}
