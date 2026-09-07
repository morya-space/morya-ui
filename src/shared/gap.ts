import type { CSSProperties } from 'vue'

export type RdGapToken = 'small' | 'medium' | 'large'
export type RdGapSize = RdGapToken | number | [number, number]

const TOKEN_GAP: Record<RdGapToken, string> = {
  small: 'var(--rd-space-2)',
  medium: 'var(--rd-space-3)',
  large: 'var(--rd-space-4)',
}

export interface ResolvedGap {
  /** CSS length for row gap (vertical). */
  row: string
  /** CSS length for column gap (horizontal). */
  col: string
  /** Combined `gap` shorthand. */
  css: string
}

/** Resolve Space / Flex / Grid gap tokens to CSS lengths. */
export function resolveGapCSSValue(
  size: RdGapSize | string | number | undefined | null,
): string {
  if (size == null || size === '') return '0'
  if (typeof size === 'string') {
    const token = size.trim() as RdGapToken
    if (token in TOKEN_GAP) return TOKEN_GAP[token]
    if (/^\d+(\.\d+)?$/.test(size.trim())) return `${size.trim()}px`
    return TOKEN_GAP.medium
  }
  if (typeof size === 'number') return `${size}px`
  if (Array.isArray(size)) {
    const gap = resolveGap(size)
    return gap.css
  }
  return TOKEN_GAP.medium
}
/** Resolve Space / Flex size prop into CSS gap lengths. */
export function resolveGap(size: RdGapSize = 'medium'): ResolvedGap {
  if (Array.isArray(size)) {
    const col = `${size[0]}px`
    const row = `${size[1]}px`
    return { row, col, css: `${row} ${col}` }
  }
  if (typeof size === 'number') {
    const value = `${size}px`
    return { row: value, col: value, css: value }
  }
  const value = TOKEN_GAP[size] ?? TOKEN_GAP.medium
  return { row: value, col: value, css: value }
}

export type RdFlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
export type RdFlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'

export function resolveAlign(align?: RdFlexAlign): CSSProperties['alignItems'] {
  if (!align) return undefined
  if (align === 'start') return 'flex-start'
  if (align === 'end') return 'flex-end'
  return align
}

export function resolveJustify(
  justify: RdFlexJustify = 'start',
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
