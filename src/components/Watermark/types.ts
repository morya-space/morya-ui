import type { RootPassThrough } from '../../shared/passThrough'

export interface WatermarkFont {
  color?: string
  fontSize?: number | string
  fontWeight?: 'normal' | 'lighter' | 'bold' | 'bolder' | number | string
  fontFamily?: string
}

export interface WatermarkProps {
  pt?: RootPassThrough
  content?: string | string[]
  image?: string
  width?: number
  height?: number
  rotate?: number
  zIndex?: number
  gap?: [number, number]
  offset?: [number, number]
  font?: WatermarkFont
  /** When true, child surfaces inherit the watermark (default). */
  inherit?: boolean
}
