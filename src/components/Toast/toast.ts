import type {
  ToastHandle,
  ToastInput,
  ToastMessage,
  ToastOptions,
  ToastPosition,
  ToastSeverity,
} from './types'
import { defineComponent, h } from 'vue'
import { isToastOptionsObject } from '../../shared/content'
import { mountOverlayHost } from '../../shared/overlayHost'
import ToastHost from './Toast.vue'
import {
  applyToastMax,
  clearToastItems,
  closeToastItem,
  findDuplicateToast,
  resetToastHostRegistry,
  scheduleToastLife,
  setToastAutoHost,
  setToastCloseCallback,
  toastAutoHost,
  toastManualHostCount,
  toastState,
} from './toastState'

const DEFAULT_LIFE = 3000

let seed = 0

const AutoToastHost = defineComponent({
  name: 'MToastAutoHost',
  setup() {
    return () => h(ToastHost, { auto: true })
  },
})

function ensureHost() {
  if (typeof document === 'undefined') return
  if (toastManualHostCount > 0 || toastAutoHost) return
  setToastAutoHost(mountOverlayHost(AutoToastHost, 'm-toast-host-root'))
}

function toMessage(input: ToastInput, severity?: ToastSeverity): ToastMessage {
  const options: ToastOptions = isToastOptionsObject(input) ? input : { summary: input }
  if (options.position) toastState.position = options.position
  return {
    id: options.id ?? `m-toast-${Date.now()}-${++seed}`,
    summary: options.summary,
    detail: options.detail,
    severity: severity ?? options.severity ?? 'info',
    closable: options.closable ?? true,
    icon: options.icon,
    actions: options.actions,
    life: options.life === undefined ? DEFAULT_LIFE : options.life,
  }
}

function add(input: ToastInput, severity?: ToastSeverity): ToastHandle {
  ensureHost()
  applyToastMax(toastState.max)

  const options = isToastOptionsObject(input) ? input : undefined
  const item = toMessage(input, severity)
  if (options?.onClose) setToastCloseCallback(item.id, options.onClose)

  // An explicit `id` replaces the existing message in place (`useNotification` keyed updates).
  if (options?.id != null) {
    const existing = toastState.messages.find((message) => message.id === item.id)
    if (existing) {
      Object.assign(existing, { ...item, id: existing.id })
      if (item.life !== undefined) scheduleToastLife(existing, closeToastItem)
      return { id: existing.id, close: () => closeToastItem(existing.id) }
    }
  }

  const dedupe = options?.dedupe ?? toastState.dedupe ?? true
  if (dedupe) {
    const existing = findDuplicateToast(item)
    if (existing) {
      if (item.life !== undefined) existing.life = item.life
      if (item.severity !== undefined) existing.severity = item.severity
      scheduleToastLife(existing, closeToastItem)
      return {
        id: existing.id,
        close: () => closeToastItem(existing.id),
      }
    }
  }
  toastState.messages = [...toastState.messages, item]
  scheduleToastLife(item, closeToastItem)
  return {
    id: item.id,
    close: () => closeToastItem(item.id),
  }
}

export const toast = {
  add: (input: ToastInput) => add(input),
  success: (input: ToastInput) => add(input, 'success'),
  info: (input: ToastInput) => add(input, 'info'),
  warn: (input: ToastInput) => add(input, 'warn'),
  warning: (input: ToastInput) => add(input, 'warn'),
  error: (input: ToastInput) => add(input, 'error'),
  /** Patch an open message in place. Returns a handle, or `undefined` when it is not open. */
  update(id: string | number, patch: Partial<Omit<ToastMessage, 'id'>>): ToastHandle | undefined {
    const target = toastState.messages.find((message) => message.id === id)
    if (!target) return undefined

    Object.assign(target, patch)
    if (patch.life !== undefined) scheduleToastLife(target, closeToastItem)
    return { id, close: () => closeToastItem(id) }
  },
  remove: closeToastItem,
  clear: clearToastItems,
  close: closeToastItem,
  closeAll: clearToastItems,
  destroyAll: clearToastItems,
  setDefaults(options: { position?: ToastPosition; max?: number; dedupe?: boolean }) {
    if (options.position) toastState.position = options.position
    if (options.max !== undefined) toastState.max = options.max
    if (options.dedupe !== undefined) toastState.dedupe = options.dedupe
  },
}

export function useToast() {
  return toast
}

export { toastState } from './toastState'

/** @internal */
export function resetToastService() {
  clearToastItems()
  resetToastHostRegistry()
  toastState.position = 'top-right'
}
