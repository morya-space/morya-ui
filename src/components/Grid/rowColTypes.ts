import type { ComputedRef, InjectionKey } from 'vue'
import type { RootPassThrough } from '../../shared/passThrough'
import type { GridBreakpoint } from './useGridBreakpoint'

/* —— Row —— */

export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch'

/** A gutter value, either fixed or per-breakpoint. */
export type GridGutterValue = number | Partial<Record<GridBreakpoint, number>>
/** Horizontal gutter, or `[horizontal, vertical]`. */
export type GridGutter = GridGutterValue | [GridGutterValue, GridGutterValue]

export interface RowProps {
  /** Column spacing. `[horizontal, vertical]` sets both axes. */
  gutter?: GridGutter
  /** Main-axis distribution. */
  justify?: RowJustify
  /** Cross-axis alignment. */
  align?: RowAlign
  /** Allow columns to wrap. Default `true`. */
  wrap?: boolean
  /** Root tag. Default `'div'`. */
  component?: string
  pt?: RootPassThrough
}

/* —— Col —— */

export interface ColResponsiveConfig {
  /** Columns out of 24. */
  span?: number
  /** Left margin, in columns out of 24. */
  offset?: number
  /** Move right without affecting siblings, in columns out of 24. */
  push?: number
  /** Move left without affecting siblings, in columns out of 24. */
  pull?: number
  /** Flex order. */
  order?: number
}

/** Per-breakpoint override: a number sets `span`, an object sets several fields. */
export type ColResponsive = number | ColResponsiveConfig

export interface ColProps extends ColResponsiveConfig {
  /** `flex` shorthand value; overrides `span` when set. */
  flex?: number | string
  /** `xs` — `< 576px`, and the base for larger breakpoints. */
  xs?: ColResponsive
  /** `sm` — `>= 576px`. */
  sm?: ColResponsive
  /** `md` — `>= 768px`. */
  md?: ColResponsive
  /** `lg` — `>= 992px`. */
  lg?: ColResponsive
  /** `xl` — `>= 1200px`. */
  xl?: ColResponsive
  /** `xxl` — `>= 1600px`. */
  xxl?: ColResponsive
  /** Root tag. Default `'div'`. */
  component?: string
  pt?: RootPassThrough
}

/** Resolved `[horizontal, vertical]` gutter shared by `MRow` with its `MCol` children. */
export const M_ROW_KEY: InjectionKey<ComputedRef<[number, number]>> = Symbol('muRow')

/** Merge one breakpoint value into the accumulated column config. */
export function mergeColResponsive(
  current: ColResponsiveConfig,
  value: ColResponsive | undefined,
): ColResponsiveConfig {
  if (value === undefined || value === null) return current
  if (typeof value === 'number') return { ...current, span: value }
  return { ...current, ...value }
}

/** Pick the value of a gutter for the currently satisfied breakpoints. */
export function resolveGutterValue(
  value: GridGutterValue | undefined,
  breakpoints: readonly GridBreakpoint[],
): number {
  if (value == null) return 0
  if (typeof value === 'number') return value

  let resolved = 0
  for (const breakpoint of breakpoints) {
    const candidate = value[breakpoint]
    if (candidate != null) resolved = candidate
  }
  return resolved
}

/** Normalize any supported gutter form into `[horizontal, vertical]`. */
export function resolveGutter(
  gutter: GridGutter | undefined,
  breakpoints: readonly GridBreakpoint[],
): [number, number] {
  if (gutter == null) return [0, 0]
  if (Array.isArray(gutter)) {
    return [
      resolveGutterValue(gutter[0], breakpoints),
      resolveGutterValue(gutter[1], breakpoints),
    ]
  }
  const value = resolveGutterValue(gutter, breakpoints)
  return [value, 0]
}
