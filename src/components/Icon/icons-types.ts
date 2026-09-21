export type IconPrimitive =
  | { tag: 'path'; d: string }
  | { tag: 'circle'; cx: number; cy: number; r: number; fill?: 'currentColor' | 'none' }
  | { tag: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { tag: 'polyline'; points: string }
  | { tag: 'rect'; x: number; y: number; width: number; height: number; rx?: number }

export interface IconDefinition {
  primitives: readonly IconPrimitive[]
  /** Optional CSS modifier on the host (e.g. spin for loader). */
  spin?: boolean
  /** SVG viewBox. Defaults to `0 0 16 16` for legacy system icons. */
  viewBox?: string
  /** Stroke width matching the viewBox scale. Defaults to `1.8`. */
  strokeWidth?: number
}
