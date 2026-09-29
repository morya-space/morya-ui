import type { RootPassThrough } from '../../shared/passThrough'

/** Semantic text tone (`type`). */
export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'

export type TitleLevel = 1 | 2 | 3 | 4 | 5

/** Text overflow behaviour. */
export interface TypographyEllipsisConfig {
  /** Number of visible lines before clamping. Default `1`. */
  rows?: number
  /** Show an expand / collapse control. Only meaningful when `rows > 1`. */
  expandable?: boolean
  /** Native tooltip shown on the clamped text. */
  tooltip?: string
  /** Trailing text appended while collapsed. */
  suffix?: string
}

export type TypographyEllipsis = boolean | TypographyEllipsisConfig

export interface TypographyCopyableConfig {
  /** Text to copy. Defaults to the rendered text content. */
  text?: string
  /** `[copy, copied]` labels for the button tooltip. */
  tooltips?: [string, string]
  /** Called after a successful copy. */
  onCopy?: (text: string) => void
  /** Transform the value before it is written to the clipboard. */
  format?: (text: string) => string
}

export type TypographyCopyable = boolean | TypographyCopyableConfig

export interface TypographyEditableConfig {
  /** Start in editing mode. Default `false`. */
  editing?: boolean
  /** Maximum length of the edited value. */
  maxLength?: number
  /** Use a growing textarea (`true`) or a fixed-row textarea (object). */
  autoSize?: boolean | { minRows?: number, maxRows?: number }
  /** Tooltip label for the edit affordance. */
  tooltip?: string
  /**
   * Called when the edit is committed (blur or `Enter`).
   * Return `false` to reject the change; return a string to show it as an error.
   */
  onChange?: (text: string) => void | boolean | string
}

export type TypographyEditable = boolean | TypographyEditableConfig

/** Shared decoration flags and behaviours for Title / Text / Paragraph. */
export interface TypographyDecorations {
  type?: TypographyType
  code?: boolean
  delete?: boolean
  mark?: boolean
  underline?: boolean
  strong?: boolean
  italic?: boolean
  /** Single-line, multi-line, expandable ellipsis. */
  ellipsis?: TypographyEllipsis
  /** Add a copy-to-clipboard affordance. */
  copyable?: TypographyCopyable
  /** Make the content inline-editable. */
  editable?: TypographyEditable
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
  /** Add a copy-to-clipboard affordance. */
  copyable?: TypographyCopyable
}

export interface TypographyProps {
  pt?: RootPassThrough
}
