import type { CSSProperties } from 'vue'

export type MGapToken = 'small' | 'medium' | 'large'
/** Token, px number, CSS length string (`8px`, `1rem`, `var(--m-space-4)`), or `[col, row]`. */
export type MGapSize =
  | MGapToken
  | number
  | string
  | [number | string, number | string]

const TOKEN_GAP: Record<MGapToken, string> = {
  small: 'var(--m-space-2)',
  medium: 'var(--m-space-3)',
  large: 'var(--m-space-4)',
}

export interface ResolvedGap {
  /** CSS length for row gap (vertical). */
  row: string
  /** CSS length for column gap (horizontal). */
  col: string
  /** Combined `gap` shorthand. */
  css: string
}

function isGapToken(value: string): value is MGapToken {
  return value === 'small' || value === 'medium' || value === 'large'
}

/** Resolve one gap axis to a CSS length. */
export function resolveGapLength(size: string | number): string {
  if (typeof size === 'number') return `${size}px`
  const raw = size.trim()
  if (!raw) return '0'
  if (isGapToken(raw)) return TOKEN_GAP[raw]
  if (/^\d+(\.\d+)?$/.test(raw)) return `${raw}px`
  return raw
}

/** Resolve Space / Flex / Grid gap tokens to CSS lengths. */
export function resolveGapCSSValue(
  size: MGapSize | string | number | undefined | null,
): string {
  if (size == null || size === '') return '0'
  if (Array.isArray(size)) return resolveGap(size).css
  return resolveGapLength(size)
}

/** Resolve Space / Flex size prop into CSS gap lengths. */
export function resolveGap(size: MGapSize = 'medium'): ResolvedGap {
  if (Array.isArray(size)) {
    const col = resolveGapLength(size[0])
    const row = resolveGapLength(size[1])
    return { row, col, css: `${row} ${col}` }
  }
  const value = resolveGapLength(size)
  return { row: value, col: value, css: value }
}

export type MFlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
export type MFlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'

export function resolveAlign(align?: MFlexAlign): CSSProperties['alignItems'] {
  if (!align) return undefined
  if (align === 'start') return 'flex-start'
  if (align === 'end') return 'flex-end'
  return align
}

export function resolveJustify(
  justify: MFlexJustify = 'start',
): NonNullable<CSSProperties['justifyContent']> {
  if (justify === 'start') return 'flex-start'
  if (justify === 'end') return 'flex-end'
  return justify
}

export function resolveFlexDirection(
  vertical: boolean,
  reverse: boolean,
): NonNullable<CSSProperties['flexDirection']> {
  if (vertical) return reverse ? 'column-reverse' : 'column'
  return reverse ? 'row-reverse' : 'row'
}
