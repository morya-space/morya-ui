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
  toastAutoHost,
  toastManualHostCount,
  toastState,
} from './toastState'

const DEFAULT_LIFE = 3000

let seed = 0

const AutoToastHost = defineComponent({
  name: 'WdToastAutoHost',
  setup() {
    return () => h(ToastHost, { auto: true })
  },
})

function ensureHost() {
  if (typeof document === 'undefined') return
  if (toastManualHostCount > 0 || toastAutoHost) return
  setToastAutoHost(mountOverlayHost(AutoToastHost, 'wd-toast-host-root'))
}

function toMessage(input: ToastInput, severity?: ToastSeverity): ToastMessage {
  const options: ToastOptions = isToastOptionsObject(input) ? input : { summary: input }
  if (options.position) toastState.position = options.position
  return {
    id: options.id ?? `wd-toast-${Date.now()}-${++seed}`,
    summary: options.summary,
    detail: options.detail,
    severity: severity ?? options.severity ?? 'info',
    closable: options.closable ?? true,
    life: options.life === undefined ? DEFAULT_LIFE : options.life,
  }
}

function add(input: ToastInput, severity?: ToastSeverity): ToastHandle {
  ensureHost()
  applyToastMax(toastState.max)
  const item = toMessage(input, severity)
  const dedupe =
    (isToastOptionsObject(input) ? input.dedupe : undefined) ??
    toastState.dedupe ??
    true
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
