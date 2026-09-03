import type {Reactive} from 'vue';
import type { OverlayHostHandle } from '../../shared/overlayHost'
import type { MessageItem, MessagePlacement } from './types'
import { plainTextOf } from '../../shared/content'
import { reactive  } from 'vue'

export const messageState: Reactive<{
  items: MessageItem[]
  placement: MessagePlacement
  max?: number
  dedupe?: boolean
}> = reactive({
  items: [],
  placement: 'top',
  max: undefined,
  dedupe: true,
})

export let messageAutoHost: OverlayHostHandle | null = null
export let messageManualHostCount = 0

const lifeTimers = new Map<string | number, ReturnType<typeof setTimeout>>()
const lifeRemaining = new Map<string | number, number>()
const lifeStartedAt = new Map<string | number, number>()

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
  messageState.dedupe = true
}

export function messageItemKey(content: MessageItem['content']) {
  return plainTextOf(content)
}

export function clearMessageLife(id: string | number) {
  const timer = lifeTimers.get(id)
  if (timer != null) clearTimeout(timer)
  lifeTimers.delete(id)
  lifeRemaining.delete(id)
  lifeStartedAt.delete(id)
}

export function pauseMessageLife(id: string | number) {
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

export function resumeMessageLife(id: string | number, onExpire: (id: string | number) => void) {
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

export function scheduleMessageLife(item: MessageItem, onExpire: (id: string | number) => void) {
  clearMessageLife(item.id)
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

export function findDuplicateMessage(item: MessageItem) {
  const key = messageItemKey(item.content)
  return messageState.items.find((existing) => messageItemKey(existing.content) === key)
}
