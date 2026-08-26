import type { SplitterSize } from './types'

export type SizeMode = 'percent' | 'ratio' | 'px'

export function detectSizeMode(value: SplitterSize | undefined, fallback: SizeMode = 'percent'): SizeMode {
  if (value == null) return fallback
  if (typeof value === 'string') return 'px'
  if (value <= 1) return 'ratio'
  return 'percent'
}

export function parseToPx(value: SplitterSize, containerPx: number, mode: SizeMode): number {
  if (typeof value === 'string') {
    const n = Number.parseFloat(value)
    return Number.isFinite(n) ? n : 0
  }
  if (mode === 'ratio') return value * containerPx
  return (value / 100) * containerPx
}

export function pxToSize(px: number, containerPx: number, mode: SizeMode): SplitterSize {
  if (containerPx <= 0) {
    if (mode === 'px') return '0px'
    return mode === 'ratio' ? 0 : 0
  }
  if (mode === 'px') return `${Math.round(px)}px`
  if (mode === 'ratio') return Number((px / containerPx).toFixed(4))
  return Number(((px / containerPx) * 100).toFixed(1))
}

export function sizeToFlexBasis(value: SplitterSize, mode: SizeMode): string {
  if (mode === 'px' || typeof value === 'string') {
    return typeof value === 'string' ? value : `${value}px`
  }
  if (mode === 'ratio') return `${value * 100}%`
  return `${value}%`
}

export function clampPx(px: number, minPx: number, maxPx: number, containerPx: number): number {
  const hi = Math.min(maxPx, containerPx)
  const lo = Math.min(minPx, hi)
  return Math.min(hi, Math.max(lo, px))
}
