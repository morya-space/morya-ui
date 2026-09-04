/** Naive-compatible breakpoint map (min-width, px). */
export const WD_BREAKPOINTS = {
  xs: 0,
  s: 640,
  m: 1024,
  l: 1280,
  xl: 1536,
  '2xl': 1920,
} as const

export type WdBreakpoint = keyof typeof WD_BREAKPOINTS

/**
 * Parse responsive prop values such as `2`, `"2"`, or `"1 s:2 m:3 l:4"`.
 * Returns the value that applies for the given query width (px).
 */
export function parseResponsiveValue(
  value: string | number | undefined | null,
  queryWidth: number | undefined,
): number | undefined {
  if (value == null || value === '') return undefined
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined

  const raw = String(value).trim()
  if (!raw) return undefined

  const parts = raw.split(/\s+/)
  let matched: number | undefined
  let base: number | undefined

  for (const part of parts) {
    const colon = part.indexOf(':')
    if (colon === -1) {
      const n = Number(part)
      if (Number.isFinite(n)) base = n
      continue
    }
    const key = part.slice(0, colon) as WdBreakpoint
    const n = Number(part.slice(colon + 1))
    if (!Number.isFinite(n)) continue
    const min = WD_BREAKPOINTS[key]
    if (min == null) continue
    if (queryWidth == null) {
      if (min === 0) matched = n
      continue
    }
    if (queryWidth >= min) matched = n
  }

  return matched ?? base
}

export function toCssLength(value: string | number | undefined | null): string | undefined {
  if (value == null || value === '') return undefined
  if (typeof value === 'number') return `${value}px`
  const raw = String(value).trim()
  if (!raw) return undefined
  if (/^\d+(\.\d+)?$/.test(raw)) return `${raw}px`
  return raw
}

/** True when `value` is `var(--token)` referencing the same custom property. */
export function isSelfReferencingCssVar(
  value: string | undefined | null,
  token: `--${string}`,
): boolean {
  if (value == null || value === '') return false
  const match = String(value).trim().match(/^var\(\s*(--[\w-]+)/)
  return match?.[1] === token
}
