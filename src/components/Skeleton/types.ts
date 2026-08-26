export type SkeletonShape = 'rectangle' | 'circle'
export type SkeletonAnimation = 'wave' | 'none'

export interface SkeletonProps {
  /** Shape of the placeholder. Defaults to `rectangle`. */
  shape?: SkeletonShape
  /** CSS width. Defaults to `100%`. */
  width?: string
  /** CSS height. */
  height?: string
  /** CSS border-radius override. */
  borderRadius?: string
  /** Loading animation. Defaults to `wave`. */
  animation?: SkeletonAnimation
  /** Render as a text line (shorter height). */
  text?: boolean
  /** Repeat the placeholder this many times. */
  repeat?: number
}
