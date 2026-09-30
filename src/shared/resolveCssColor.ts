/**
 * Resolve a CSS color expression to a concrete color string.
 *
 * Canvas APIs reject unresolved `var(--token)` values, so they must be read back
 * from the DOM before being handed to `fillStyle` / `strokeStyle`.
 */
export function resolveCssColor(value: string | undefined, fallback: string) {
  if (!value) return fallback
  if (typeof document === 'undefined') return value
  if (!value.startsWith('var(')) return value
  const probe = document.createElement('span')
  probe.style.color = value
  probe.style.display = 'none'
  document.documentElement.append(probe)
  const resolved = getComputedStyle(probe).color || fallback
  probe.remove()
  return resolved || fallback
}
