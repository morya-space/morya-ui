/** Overlay mount target. Prefer `'body'`; use `'self'` to keep in place. */
export type RdAppendTo = string | HTMLElement | 'self'

export interface RdOverlayMountProps {
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
  appendTo?: RdAppendTo | false
}

export function resolveOverlayTeleport(
  options: RdOverlayMountProps = {},
  /** Global default from ConfigProvider / createWiseKit. */
  globalAppendTo: RdAppendTo | false = 'body',
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
  options: RdOverlayMountProps = {},
  globalAppendTo: RdAppendTo | false = 'body',
): boolean {
  return !resolveOverlayTeleport(options, globalAppendTo).disabled
}
