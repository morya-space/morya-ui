import type { CSSProperties } from 'vue'

export type WiGapToken = 'small' | 'medium' | 'large'
export type WiGapSize = WiGapToken | number | [number, number]

const TOKEN_GAP: Record<WiGapToken, string> = {
  small: 'var(--wi-space-2)',
  medium: 'var(--wi-space-3)',
  large: 'var(--wi-space-4)',
}

export interface ResolvedGap {
  /** CSS length for row gap (vertical). */
  row: string
  /** CSS length for column gap (horizontal). */
  col: string
  /** Combined `gap` shorthand. */
  css: string
}

/** Resolve Space / Flex size prop into CSS gap lengths. */
export function resolveGap(size: WiGapSize = 'medium'): ResolvedGap {
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

export type WiFlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch'
export type WiFlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'

export function resolveAlign(align?: WiFlexAlign): CSSProperties['alignItems'] {
  if (!align) return undefined
  if (align === 'start') return 'flex-start'
  if (align === 'end') return 'flex-end'
  return align
}

export function resolveJustify(
  justify: WiFlexJustify = 'start',
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
