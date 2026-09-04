import type { WdRenderable } from '../../shared/content'
import type { WdAppendTo } from '../../shared/overlay'
import type { WdToastSeverity } from '../../shared/types'

export type { WdRenderable }

/** message severities; `warning` kept as legacy alias for `warn`. */
export type MessageSeverity = WdToastSeverity | 'warning'

export type MessagePlacement =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'

export interface MessageItem {
  id: string | number
  content: WdRenderable
  severity?: MessageSeverity
  closable?: boolean
  /** Auto-close delay in ms. `0` keeps it open. Default `3000` for API calls. */
  life?: number
  icon?: boolean
}

export type MessageOptions = Omit<MessageItem, 'id' | 'content'> & {
  id?: string | number
  content: WdRenderable
  /** When true (default service setting), refresh life for duplicate content. */
  dedupe?: boolean
}

/** String / VNode / component / render factory, or a full options object. */
export type MessageInput = WdRenderable | MessageOptions

export interface MessageProps {
  /** Controlled message list. When omitted, binds to the shared service queue. */
  messages?: MessageItem[]
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: WdAppendTo
  /** Host placement. Default `top` (Naive MessageProvider). */
  placement?: MessagePlacement
  /** Max visible messages; oldest is dropped. Omit for unlimited. */
  max?: number
  /**
   * Internal: auto-mounted service host.
   * Manual `<WdMessage />` claims the host and disables auto-mount.
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
  dedupe?: boolean
}
