export type DividerLayout = 'horizontal' | 'vertical'
export type DividerType = 'solid' | 'dashed' | 'dotted'
export type DividerAlign = 'left' | 'center' | 'right'

export interface DividerProps {
  /**
   * `layout`. Preferred over `orientation`.
   * @default 'horizontal'
   */
  layout?: DividerLayout
  /** Border style of the divider line. */
  type?: DividerType
  /** Label alignment for horizontal dividers with content. */
  align?: DividerAlign
  /** Alias of `align`. */
  titlePlacement?: DividerAlign
  label?: string
}
