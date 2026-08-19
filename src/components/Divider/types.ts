export type DividerLayout = 'horizontal' | 'vertical'
export type DividerType = 'solid' | 'dashed' | 'dotted'
export type DividerAlign = 'left' | 'center' | 'right'

export interface DividerProps {
  /**
   * `layout`. Preferred over `orientation`.
   * @default 'horizontal'
   */
  layout?: DividerLayout
  /**
   * Legacy alias of `layout`. Used when `layout` is omitted.
   * @deprecated Prefer `layout`.
   */
  orientation?: DividerLayout
  /** Border style of the divider line. */
  type?: DividerType
  /** Label alignment for horizontal dividers with content. */
  align?: DividerAlign
  label?: string
}
