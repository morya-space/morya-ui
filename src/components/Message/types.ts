import type { WiRenderable } from '../../shared/content'
import type { WiAppendTo } from '../../shared/overlay'
import type { WiToastSeverity } from '../../shared/types'

export type { WiRenderable }

/** message severities; `warning` kept as legacy alias for `warn`. */
export type MessageSeverity = WiToastSeverity | 'warning'

export type MessagePlacement =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'

export interface MessageItem {
  id: string | number
  content: WiRenderable
  severity?: MessageSeverity
  closable?: boolean
  /** Auto-close delay in ms. `0` keeps it open. Default `3000` for API calls. */
  life?: number
  icon?: boolean
}

export type MessageOptions = Omit<MessageItem, 'id' | 'content'> & {
  id?: string | number
  content: WiRenderable
}

/** String / VNode / component / render factory, or a full options object. */
export type MessageInput = WiRenderable | MessageOptions

export interface MessageProps {
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WiAppendTo
  /** Host placement. Default `top` (Naive MessageProvider). */
  placement?: MessagePlacement
  /** Max visible messages; oldest is dropped. Omit for unlimited. */
  max?: number
  /**
   * Internal: auto-mounted service host.
   * Manual `<WiMessage />` claims the host and disables auto-mount.
   */
  auto?: boolean
}

export interface MessageHandle {
  id: string | number
  close: () => void
}

export interface MessageHostConfig {
  placement?: MessagePlacement
  max?: number
}
