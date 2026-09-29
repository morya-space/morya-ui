export type DividerLayout = 'horizontal' | 'vertical'
export type DividerType = 'solid' | 'dashed' | 'dotted'
export type DividerAlign = 'left' | 'center' | 'right'
/** Horizontal outer spacing (`size`). */
export type DividerSize = 'small' | 'medium' | 'large'

export interface DividerProps {
  /**
   * Layout direction. Preferred over `orientation`.
   * @default 'horizontal'
   */
  layout?: DividerLayout
  /** Alias of `layout` (`orientation`). */
  orientation?: DividerLayout
  /** Border style of the divider line. */
  type?: DividerType
  /** Label alignment for horizontal dividers with content. */
  align?: DividerAlign
  /** Alias of `align`. */
  titlePlacement?: DividerAlign
  /**
   * Use body text style for the label instead of the stronger default.
   * @default false
   */
  plain?: boolean
  /**
   * Vertical outer spacing for horizontal dividers.
   * Maps to `--m-space-*` tokens.
   */
  size?: DividerSize
  label?: string
}
