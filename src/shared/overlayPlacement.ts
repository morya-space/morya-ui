export type FloatingOverlayPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'left-start'

export interface FloatingOverlayStyleOptions {
  gap?: number
  minWidth?: string
  maxWidth?: string
  width?: string
  zIndex?: number
}

export function toCssSize(value?: string | number) {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/** Position a fixed overlay relative to an anchor rect (viewport coordinates). */
export function computeFloatingOverlayStyle(
  anchor: DOMRect,
  placement: FloatingOverlayPlacement,
  options: FloatingOverlayStyleOptions = {},
): Record<string, string> {
  const gap = options.gap ?? 8
  const centerX = anchor.left + anchor.width / 2
  const centerY = anchor.top + anchor.height / 2
  const extra: Record<string, string> = {}

  if (options.minWidth) extra.minWidth = options.minWidth
  if (options.maxWidth) extra.maxWidth = options.maxWidth
  if (options.width) extra.width = options.width
  if (options.zIndex != null) extra.zIndex = String(options.zIndex)

  switch (placement) {
    case 'top':
      return {
        left: `${centerX}px`,
        top: `${anchor.top - gap}px`,
        transform: 'translate(-50%, -100%)',
        ...extra,
      }
    case 'bottom':
      return {
        left: `${centerX}px`,
        top: `${anchor.bottom + gap}px`,
        transform: 'translateX(-50%)',
        ...extra,
      }
    case 'left':
      return {
        left: `${anchor.left - gap}px`,
        top: `${centerY}px`,
        transform: 'translate(-100%, -50%)',
        ...extra,
      }
    case 'right':
      return {
        left: `${anchor.right + gap}px`,
        top: `${centerY}px`,
        transform: 'translateY(-50%)',
        ...extra,
      }
    case 'right-start':
      return {
        left: `${anchor.right + gap}px`,
        top: `${anchor.top}px`,
        ...extra,
      }
    case 'left-start':
      return {
        left: `${anchor.left - gap}px`,
        top: `${anchor.top}px`,
        transform: 'translateX(-100%)',
        ...extra,
      }
    case 'bottom-end':
      return {
        left: `${anchor.right}px`,
        top: `${anchor.bottom + gap}px`,
        transform: 'translateX(-100%)',
        ...extra,
      }
    case 'bottom-start':
      return {
        left: `${anchor.left}px`,
        top: `${anchor.bottom + gap}px`,
        ...extra,
      }
    case 'top-start':
      return {
        left: `${anchor.left}px`,
        top: `${anchor.top - gap}px`,
        transform: 'translateY(-100%)',
        ...extra,
      }
    case 'top-end':
      return {
        left: `${anchor.right}px`,
        top: `${anchor.top - gap}px`,
        transform: 'translate(-100%, -100%)',
        ...extra,
      }
    default:
      return {
        left: `${anchor.left}px`,
        top: `${anchor.bottom + gap}px`,
        ...extra,
      }
  }
}
