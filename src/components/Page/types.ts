import type { RootPassThrough } from '../../shared/passThrough'
import type { CardShadow } from '../Card/types'
import type { IconName } from '../Icon/icons'

export type PageContentDensity = 'default' | 'compact' | 'spacious'
export type PageContentWidth = 'full' | 'narrow'
/** `auto` tightens header/filter/toolbar/table bands; `uniform` uses gap only. */
export type PageContentBands = 'auto' | 'uniform'
export type PageFiltersVariant = 'plain' | 'filled'
export type PageStatLayout = 'card' | 'plain'
export type PageStatDensity = 'default' | 'compact'
export type PageStatOrientation = 'stacked' | 'inline'
export type PageSectionVariant = 'default' | 'muted' | 'form' | 'actions'
export type PageStatTrendSeverity = 'primary' | 'success' | 'warn' | 'danger' | 'secondary'
export type PageStatTrendDirection = 'up' | 'down'

export interface PageContentProps {
  pt?: RootPassThrough
  /** Vertical spacing between direct children. */
  density?: PageContentDensity
  /** `narrow` caps width for form-like pages (~42rem). */
  width?: PageContentWidth
  /** Band spacing rhythm between header, filters, toolbar, and body. */
  bands?: PageContentBands
}

export interface PageFiltersProps {
  pt?: RootPassThrough
  /** Accessible name for the filter region. */
  ariaLabel?: string
  /** Surface treatment. `plain` (default) is borderless; `filled` uses the same fill as Table header. */
  variant?: PageFiltersVariant
  /** When true, `#advanced` is shown only while expanded. */
  collapsible?: boolean
  /** Collapsible open state (v-model). */
  expanded?: boolean
  /** Toggle button label when collapsed. */
  expandLabel?: string
  /** Toggle button label when expanded. */
  collapseLabel?: string
}

export interface PageFilterChipsProps {
  pt?: RootPassThrough
  /** Optional muted prefix, e.g. “已选”. */
  label?: string
  /** Accessible name for the active-filter list. */
  ariaLabel?: string
}

export interface PageToolbarProps {
  pt?: RootPassThrough
  /** Optional page title rendered as heading. */
  title?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

export interface PageHeaderProps {
  pt?: RootPassThrough
  title?: string
  description?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

export interface PageSectionProps {
  pt?: RootPassThrough
  /** Visual treatment for grouped page content. */
  variant?: PageSectionVariant
  title?: string
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

export interface PageStatProps {
  pt?: RootPassThrough
  label?: string
  value?: string | number
  trend?: string
  trendSeverity?: PageStatTrendSeverity
  /** Renders a direction arrow beside the trend text. */
  trendDirection?: PageStatTrendDirection
  /** Muted suffix after the trend, e.g. "较上月". */
  trendLabel?: string
  icon?: IconName
  /** Show skeleton placeholders instead of value and trend. */
  loading?: boolean
  /** Card elevation shadow; defaults to `always`. */
  shadow?: CardShadow
  /** `plain` drops the Card shell (e.g. dense dashboard strip). */
  layout?: PageStatLayout
  density?: PageStatDensity
  /** `inline` keeps label and value on one row. */
  orientation?: PageStatOrientation
}

export interface PagePlaceholderProps {
  pt?: RootPassThrough
  /** Short description shown inside the placeholder. */
  description?: string
  /** Accessible label for chart or media placeholders. */
  ariaLabel?: string
  minHeight?: number | string
}
