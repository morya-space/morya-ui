import type { CSSProperties } from 'vue'

export const GAP = 4

export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
} as const

export type BarMapKey = keyof typeof BAR_MAP
export type BarMapValue = (typeof BAR_MAP)[BarMapKey]

export function addUnit(value?: string | number): string | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'number') return `${value}px`
  const trimmed = String(value).trim()
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed
}

export function renderThumbStyle({
  move,
  size,
  bar,
}: {
  move: number
  size: string
  bar: BarMapValue
}): CSSProperties {
  return {
    [bar.size]: size,
    transform: `translate${bar.axis}(${move}%)`,
  }
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}
