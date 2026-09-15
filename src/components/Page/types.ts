import type { RootPassThrough } from '../../shared/passThrough'
import type { IconName } from '../Icon/icons'

export type PageContentDensity = 'default' | 'compact' | 'spacious'
export type PageContentWidth = 'full' | 'narrow'
export type PageSectionVariant = 'default' | 'muted' | 'form' | 'actions'
export type PageStatTrendSeverity = 'primary' | 'success' | 'warn' | 'danger' | 'secondary'

export interface PageContentProps {
  pt?: RootPassThrough
  /** Vertical spacing between direct children. */
  density?: PageContentDensity
  /** `narrow` caps width for form-like pages (~42rem). */
  width?: PageContentWidth
}

export interface PageFiltersProps {
  pt?: RootPassThrough
  /** Accessible name for the filter region. */
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
  icon?: IconName
}

export interface PagePlaceholderProps {
  pt?: RootPassThrough
  /** Short description shown inside the placeholder. */
  description?: string
  /** Accessible label for chart or media placeholders. */
  ariaLabel?: string
  minHeight?: number | string
}
