/** Overlay mount target. Prefer `'body'`; use `'self'` to keep in place. */
export type WiAppendTo = string | HTMLElement | 'self'

export interface WiOverlayMountProps {
  /**
   * Whether to Teleport the overlay. Defaults to `true`.
   * Prefer `appendTo` when you need a custom container.
   */
  teleport?: boolean
  /**
   * Teleport target. Defaults to `'body'` (or ConfigProvider `appendTo`).
   * Pass `'self'` to render in place (same as `teleport: false`).
   * `false` is still accepted at runtime for compatibility.
   */
  appendTo?: WiAppendTo | false
}

export function resolveOverlayTeleport(
  options: WiOverlayMountProps = {},
  /** Global default from ConfigProvider / createWellInsight. */
  globalAppendTo: WiAppendTo | false = 'body',
): {
  disabled: boolean
  to: string | HTMLElement
} {
  const teleport = options.teleport !== false
  const appendTo = options.appendTo ?? globalAppendTo ?? 'body'
  if (!teleport || appendTo === false || appendTo === 'self') {
    return { disabled: true, to: 'body' }
  }
  return { disabled: false, to: appendTo }
}

export function isOverlayTeleported(
  options: WiOverlayMountProps = {},
  globalAppendTo: WiAppendTo | false = 'body',
): boolean {
  return !resolveOverlayTeleport(options, globalAppendTo).disabled
}
