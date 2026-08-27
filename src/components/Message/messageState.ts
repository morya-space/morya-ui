import type {Reactive} from 'vue';
import type { OverlayHostHandle } from '../../shared/overlayHost'
import type { MessageItem, MessagePlacement } from './types'
import { reactive  } from 'vue'

export const messageState: Reactive<{
  items: MessageItem[]
  placement: MessagePlacement
  max?: number
}> = reactive({
  items: [],
  placement: 'top',
  max: undefined,
})

export let messageAutoHost: OverlayHostHandle | null = null
export let messageManualHostCount = 0

const lifeTimers = new Map<string | number, ReturnType<typeof setTimeout>>()

export function setMessageAutoHost(host: OverlayHostHandle | null) {
  messageAutoHost = host
}

export function registerMessageManualHost() {
  messageManualHostCount += 1
  if (messageAutoHost) {
    messageAutoHost.unmount()
    messageAutoHost = null
  }
}

export function unregisterMessageManualHost() {
  messageManualHostCount = Math.max(0, messageManualHostCount - 1)
}

export function resetMessageHostRegistry() {
  if (messageAutoHost) {
    messageAutoHost.unmount()
    messageAutoHost = null
  }
  messageManualHostCount = 0
  messageState.placement = 'top'
  messageState.max = undefined
}

export function clearMessageLife(id: string | number) {
  const timer = lifeTimers.get(id)
  if (timer != null) clearTimeout(timer)
  lifeTimers.delete(id)
}

export function scheduleMessageLife(item: MessageItem, onExpire: (id: string | number) => void) {
  clearMessageLife(item.id)
  if (item.life == null || item.life <= 0) return
  lifeTimers.set(
    item.id,
    setTimeout(() => {
      onExpire(item.id)
    }, item.life),
  )
}

export function closeMessageItem(id?: string | number) {
  if (id == null) {
    closeAllMessageItems()
    return
  }
  clearMessageLife(id)
  messageState.items = messageState.items.filter((item) => item.id !== id)
}

export function closeAllMessageItems() {
  for (const id of [...lifeTimers.keys()]) clearMessageLife(id)
  messageState.items = []
}

export function applyMessageMax(max?: number) {
  if (max == null || max <= 0) return
  while (messageState.items.length >= max) {
    const oldest = messageState.items[0]
    if (!oldest) break
    closeMessageItem(oldest.id)
  }
}

export function trimMessagesToMax(max?: number) {
  if (max == null || max <= 0) return
  while (messageState.items.length > max) {
    const oldest = messageState.items[0]
    if (!oldest) break
    closeMessageItem(oldest.id)
  }
}
