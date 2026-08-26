import { defineComponent, h } from 'vue'
import { isMessageOptionsObject } from '../../shared/content'
import { mountOverlayHost } from '../../shared/overlayHost'
import MessageHost from './Message.vue'
import {
  applyMessageMax,
  closeAllMessageItems,
  closeMessageItem,
  messageAutoHost,
  messageManualHostCount,
  messageState,
  resetMessageHostRegistry,
  scheduleMessageLife,
  setMessageAutoHost,
} from './messageState'
import type { MessageHandle, MessageHostConfig, MessageInput, MessageItem, MessageOptions, MessageSeverity } from './types'

const DEFAULT_LIFE = 3000

let seed = 0

const AutoMessageHost = defineComponent({
  name: 'WiMessageAutoHost',
  setup() {
    return () => h(MessageHost, { auto: true })
  },
})

function ensureHost() {
  if (typeof document === 'undefined') return
  if (messageManualHostCount > 0 || messageAutoHost) return
  setMessageAutoHost(mountOverlayHost(AutoMessageHost, 'wi-message-host-root'))
}

function toItem(input: MessageInput, severity?: MessageSeverity): MessageItem {
  const options: MessageOptions = isMessageOptionsObject(input) ? input : { content: input }
  return {
    id: options.id ?? `wi-message-${Date.now()}-${++seed}`,
    content: options.content,
    severity: severity ?? options.severity ?? 'info',
    closable: options.closable ?? false,
    life: options.life === undefined ? DEFAULT_LIFE : options.life,
    icon: options.icon ?? true,
  }
}

function open(input: MessageInput, severity?: MessageSeverity): MessageHandle {
  ensureHost()
  applyMessageMax(messageState.max)
  const item = toItem(input, severity)
  messageState.items = [...messageState.items, item]
  scheduleMessageLife(item, closeMessageItem)
  return {
    id: item.id,
    close: () => closeMessageItem(item.id),
  }
}

export const message = {
  open: (input: MessageInput) => open(input),
  success: (input: MessageInput) => open(input, 'success'),
  info: (input: MessageInput) => open(input, 'info'),
  warn: (input: MessageInput) => open(input, 'warn'),
  warning: (input: MessageInput) => open(input, 'warn'),
  error: (input: MessageInput) => open(input, 'error'),
  close: closeMessageItem,
  closeAll: closeAllMessageItems,
  destroyAll: closeAllMessageItems,
  config(options: MessageHostConfig) {
    if (options.placement) messageState.placement = options.placement
    if (options.max !== undefined) messageState.max = options.max
  },
}

export function useMessage() {
  return message
}

export { messageState } from './messageState'

/** @internal test helper */
export function resetMessageService() {
  closeAllMessageItems()
  resetMessageHostRegistry()
}
