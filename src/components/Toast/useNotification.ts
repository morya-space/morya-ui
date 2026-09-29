/**
 * Notification API — the Ant Design `notification` / `useNotification` shape
 * on top of the toast service.
 *
 * ```ts
 * const notification = useNotification()
 * notification.success({ message: 'Saved', description: 'All changes are stored.' })
 * ```
 *
 * Reusing the toast pipeline keeps a single overlay host, life-cycle timer and
 * motion preset stack for every transient message in the app.
 */

import type { MRenderable } from '../../shared/content'
import type { IconName } from '../Icon/types'
import type { ToastHandle, ToastPosition } from './types'
import { toast } from './toast'

/** Camel-cased placements, matching Ant Design's `notification` API. */
export type NotificationPlacement =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'top'
  | 'bottom'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface NotificationOptions {
  /** Title. */
  message: MRenderable
  /** Body content. */
  description?: MRenderable
  /** Action area rendered under the body (usually buttons). */
  btn?: MRenderable
  /** Custom leading icon. */
  icon?: IconName
  /** Shortcut that sets the tone and default icon. */
  type?: NotificationType
  /**
   * Unique key. Opening again with the same key updates that notification in
   * place instead of stacking a new one.
   */
  key?: string | number
  /** Auto-close delay in **seconds**. `0` keeps it open. Default `4.5`. */
  duration?: number
  /** Screen corner / edge. Default `topRight`. */
  placement?: NotificationPlacement
  /** Show the close button. Default `true`. */
  closable?: boolean
  /** Called once the notification has closed. */
  onClose?: () => void
}

export interface NotificationApi {
  /** Open a notification. */
  open: (options: NotificationOptions) => ToastHandle
  success: (options: NotificationOptions) => ToastHandle
  info: (options: NotificationOptions) => ToastHandle
  warning: (options: NotificationOptions) => ToastHandle
  error: (options: NotificationOptions) => ToastHandle
  /** Close the notification with the given key. */
  close: (key: string | number) => void
  /** Close every notification. */
  destroy: () => void
}

const DEFAULT_DURATION_SECONDS = 4.5

const PLACEMENT_MAP: Record<NotificationPlacement, ToastPosition> = {
  topLeft: 'top-left',
  topRight: 'top-right',
  bottomLeft: 'bottom-left',
  bottomRight: 'bottom-right',
  top: 'top',
  bottom: 'bottom',
}

function toHandle(options: NotificationOptions, type?: NotificationType): ToastHandle {
  const resolvedType = type ?? options.type ?? 'info'

  return toast.add({
    id: options.key,
    summary: options.message,
    detail: options.description,
    actions: options.btn,
    icon: options.icon,
    severity: resolvedType,
    closable: options.closable ?? true,
    life: (options.duration ?? DEFAULT_DURATION_SECONDS) * 1000,
    position: options.placement ? PLACEMENT_MAP[options.placement] : undefined,
    // A keyed notification updates in place, so duplicate-text collapsing is off.
    dedupe: options.key == null,
    onClose: options.onClose,
  })
}

/** Create a notification API bound to the shared toast service. */
export function useNotification(): NotificationApi {
  return {
    open: options => toHandle(options),
    success: options => toHandle(options, 'success'),
    info: options => toHandle(options, 'info'),
    warning: options => toHandle(options, 'warning'),
    error: options => toHandle(options, 'error'),
    close: key => toast.close(key),
    destroy: () => toast.clear(),
  }
}

/** Module-level notification API, mirroring Ant Design's static `notification.*`. */
export const notification: NotificationApi = useNotification()
