import type { MRenderable } from '../../shared/content'
import type { MAppendTo } from '../../shared/overlay'
import type { RootPassThrough } from '../../shared/passThrough'
import type { MToastType } from '../../shared/types'
import type { MotionPresetId } from '../../theme/motionPresets'
import type { IconName } from '../Icon/types'

export type { MRenderable }

/** Toast tone. Canonical values from `MToastType`. */
export type ToastType = MToastType

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top'
  | 'bottom'

export interface ToastMessage {
  id: string | number
  summary: MRenderable
  detail?: MRenderable
  type?: ToastType
  closable?: boolean
  /** Custom leading icon. Defaults to the icon implied by `type`. */
  icon?: IconName
  /** Extra action area rendered under the detail (e.g. buttons). */
  actions?: MRenderable
  /** Auto-close delay in ms. `0` keeps it open. Default `3000` for API calls. */
  life?: number
}

export type ToastOptions = Omit<ToastMessage, 'id' | 'summary'> & {
  id?: string | number
  summary: MRenderable
  position?: ToastPosition
  /** When true (default service setting), refresh life for duplicate summary+detail. */
  dedupe?: boolean
  /** Called once the message has been closed (manually or by its life timer). */
  onClose?: () => void
}

/** String / VNode / component / render factory, or a full options object. */
export type ToastInput = MRenderable | ToastOptions

export interface ToastProps {
  pt?: RootPassThrough
  /**
   * Controlled message list. When omitted, the component binds to the shared
   * `toast` service queue (and claims the service host).
   */
  messages?: ToastMessage[]
  position?: ToastPosition
  /** Teleport overlay. Defaults to `true`. */
  teleport?: boolean
  /** Mount target. Defaults to `'body'`. */
  appendTo?: MAppendTo
  /** Max visible toasts; oldest is dropped. Omit for unlimited. */
  max?: number
  /** Internal: auto-mounted service host. */
  auto?: boolean
  /** Named motion preset, or `false` to disable enter/exit transition. */
  transition?: MotionPresetId | false
}

export interface ToastEmits {
  (event: 'close', message: ToastMessage): void
}

export interface ToastHandle {
  id: string | number
  close: () => void
}
