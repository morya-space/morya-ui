import type { RootPassThrough } from '../../shared/passThrough'

/** Semantic text tone (`type`). */
export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'

export type TitleLevel = 1 | 2 | 3 | 4 | 5

/** Shared decoration flags for Title / Text / Paragraph. */
export interface TypographyDecorations {
  type?: TypographyType
  code?: boolean
  delete?: boolean
  mark?: boolean
  underline?: boolean
  strong?: boolean
  italic?: boolean
  ellipsis?: boolean
}

export interface TitleProps extends TypographyDecorations {
  pt?: RootPassThrough
  /** Heading level → `h1`–`h5`. Default `1`. */
  level?: TitleLevel
}

export interface TextProps extends TypographyDecorations {
  pt?: RootPassThrough
  disabled?: boolean
}

export interface ParagraphProps extends TypographyDecorations {
  pt?: RootPassThrough
  disabled?: boolean
  /** Bottom margin between paragraphs. Default `true`. */
  spacing?: boolean
}

export interface LinkProps {
  pt?: RootPassThrough
  href?: string
  target?: string
  type?: TypographyType
  /** Underline. Default `true`. */
  underline?: boolean
  disabled?: boolean
}

export interface TypographyProps {
  pt?: RootPassThrough
}
