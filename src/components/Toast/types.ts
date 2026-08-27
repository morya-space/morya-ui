import type { WiRenderable } from '../../shared/content'
import type { WiAppendTo } from '../../shared/overlay'
import type { WiToastSeverity } from '../../shared/types'

export type { WiRenderable }

/** toast severities; `warning` kept as legacy alias for `warn`. */
export type ToastSeverity = WiToastSeverity | 'warning'

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface ToastMessage {
  id: string | number
  summary: WiRenderable
  detail?: WiRenderable
  severity?: ToastSeverity
  closable?: boolean
  /** Auto-close delay in ms. `0` keeps it open. Default `3000` for API calls. */
  life?: number
}

export type ToastOptions = Omit<ToastMessage, 'id' | 'summary'> & {
  id?: string | number
  summary: WiRenderable
  position?: ToastPosition
}

/** String / VNode / component / render factory, or a full options object. */
export type ToastInput = WiRenderable | ToastOptions

export interface ToastProps {
  /**
   * Controlled message list. When omitted, the component binds to the shared
   * `toast` service queue (and claims the service host).
   */
  messages?: ToastMessage[]
  position?: ToastPosition
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WiAppendTo
  /** Max visible toasts; oldest is dropped. Omit for unlimited. */
  max?: number
  /** Internal: auto-mounted service host. */
  auto?: boolean
}

export interface ToastEmits {
  (event: 'close', message: ToastMessage): void
}

export interface ToastHandle {
  id: string | number
  close: () => void
}
