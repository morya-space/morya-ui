export type SplitterLayout = 'horizontal' | 'vertical'

export interface SplitterProps {
  layout?: SplitterLayout
  /** Primary panel size in percent (0–100). */
  size?: number
  /** Minimum primary panel size in percent. */
  min?: number
  /** Maximum primary panel size in percent. */
  max?: number
}

export interface SplitterEmits {
  (event: 'update:size', value: number): void
  (event: 'resize', value: number): void
}
