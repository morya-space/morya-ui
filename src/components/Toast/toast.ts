import { defineComponent, h } from 'vue'
import { isToastOptionsObject } from '../../shared/content'
import { mountOverlayHost } from '../../shared/overlayHost'
import ToastHost from './Toast.vue'
import {
  clearToastItems,
  closeToastItem,
  resetToastHostRegistry,
  scheduleToastLife,
  setToastAutoHost,
  toastAutoHost,
  toastManualHostCount,
  toastState,
} from './toastState'
import type {
  ToastHandle,
  ToastInput,
  ToastMessage,
  ToastOptions,
  ToastPosition,
  ToastSeverity,
} from './types'

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
  const item = toMessage(input, severity)
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
  setDefaults(options: { position?: ToastPosition }) {
    if (options.position) toastState.position = options.position
  },
}

export function useToast() {
  return toast
}

export { toastState } from './toastState'

/** @internal test helper */
export function resetToastService() {
  clearToastItems()
  resetToastHostRegistry()
  toastState.position = 'top-right'
}
