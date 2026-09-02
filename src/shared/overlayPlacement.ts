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
  maxHeight?: string | number
  width?: string
  zIndex?: number
  /** Estimated overlay height (px) used for vertical flip detection. Defaults to maxHeight or 280. */
  estimatedHeight?: number
  /** Estimated overlay width (px) used for horizontal clamping. Defaults to width/maxWidth/minWidth or the anchor width. */
  estimatedWidth?: number
  /** Minimum margin (px) kept between the overlay and each viewport edge. Defaults to 8. */
  viewportMargin?: number
}

const VIEWPORT_MARGIN = 8
const DEFAULT_OVERLAY_HEIGHT = 280

export function toCssSize(value?: string | number) {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

function parsePx(value?: string | number): number | undefined {
  if (value == null) return undefined
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  const match = /^(\d+(?:\.\d+)?)px$/.exec(value.trim())
  return match ? Number(match[1]) : undefined
}

function viewportSize(): { width: number; height: number } | undefined {
  if (typeof window === 'undefined') return undefined
  const { innerWidth, innerHeight } = window
  if (!Number.isFinite(innerWidth) || !Number.isFinite(innerHeight)) return undefined
  return { width: innerWidth, height: innerHeight }
}

type HorizontalAlign = 'start' | 'center' | 'end'

function horizontalAlign(placement: FloatingOverlayPlacement): HorizontalAlign {
  switch (placement) {
    case 'top':
    case 'bottom':
      return 'center'
    case 'bottom-end':
    case 'top-end':
    case 'left':
    case 'left-start':
      // These use translateX(-100%), so `left` marks the overlay's right edge.
      return 'end'
    default:
      return 'start'
  }
}

/** Flip bottom* to top* when space below overflows and there is more room above. */
function resolveVerticalPlacement(
  placement: FloatingOverlayPlacement,
  anchor: DOMRect,
  gap: number,
  estimatedHeight: number,
  viewportHeight: number,
  margin: number,
): FloatingOverlayPlacement {
  if (!placement.startsWith('bottom')) return placement
  const spaceBelow = viewportHeight - margin - (anchor.bottom + gap)
  const spaceAbove = anchor.top - gap - margin
  if (estimatedHeight > spaceBelow && spaceAbove > spaceBelow) {
    return placement.replace('bottom', 'top') as FloatingOverlayPlacement
  }
  return placement
}

/** Clamp the `left` style so the overlay stays within [margin, viewportWidth - margin]. */
function clampLeft(
  left: number,
  placement: FloatingOverlayPlacement,
  estimatedWidth: number,
  viewportWidth: number,
  margin: number,
): number {
  const align = horizontalAlign(placement)
  let minLeft: number
  let maxLeft: number
  if (align === 'end') {
    minLeft = margin + estimatedWidth
    maxLeft = viewportWidth - margin
  } else if (align === 'center') {
    minLeft = margin + estimatedWidth / 2
    maxLeft = viewportWidth - margin - estimatedWidth / 2
  } else {
    minLeft = margin
    maxLeft = viewportWidth - margin - estimatedWidth
  }
  if (minLeft > maxLeft) {
    // Overlay is wider than the viewport; at least keep the left edge inside.
    return Math.round(Math.min(Math.max(left, margin), viewportWidth - margin))
  }
  return Math.round(Math.min(Math.max(left, minLeft), maxLeft))
}

/** Position a fixed overlay relative to an anchor rect (viewport coordinates). */
export function computeFloatingOverlayStyle(
  anchor: DOMRect,
  placement: FloatingOverlayPlacement,
  options: FloatingOverlayStyleOptions = {},
): Record<string, string> {
  const gap = options.gap ?? 8
  const margin = options.viewportMargin ?? VIEWPORT_MARGIN
  const viewport = viewportSize()
  const estimatedHeight =
    options.estimatedHeight ?? parsePx(options.maxHeight) ?? DEFAULT_OVERLAY_HEIGHT
  const estimatedWidth =
    options.estimatedWidth ??
    parsePx(options.width) ??
    parsePx(options.maxWidth) ??
    parsePx(options.minWidth) ??
    anchor.width

  const resolved = viewport
    ? resolveVerticalPlacement(placement, anchor, gap, estimatedHeight, viewport.height, margin)
    : placement

  const centerX = anchor.left + anchor.width / 2
  const centerY = anchor.top + anchor.height / 2

  let left: number
  switch (resolved) {
    case 'top':
    case 'bottom':
      left = centerX
      break
    case 'left':
    case 'left-start':
      left = anchor.left - gap
      break
    case 'right':
    case 'right-start':
      left = anchor.right + gap
      break
    case 'bottom-end':
    case 'top-end':
      left = anchor.right
      break
    default:
      left = anchor.left
  }
  if (viewport) {
    left = clampLeft(left, resolved, estimatedWidth, viewport.width, margin)
  }

  const extra: Record<string, string> = {}
  if (options.minWidth) extra.minWidth = options.minWidth
  if (options.maxWidth) extra.maxWidth = options.maxWidth
  if (options.maxHeight != null) extra.maxHeight = toCssSize(options.maxHeight) as string
  if (options.width) extra.width = options.width
  if (options.zIndex != null) extra.zIndex = String(options.zIndex)

  const leftCss = `${left}px`

  switch (resolved) {
    case 'top':
      return {
        left: leftCss,
        top: `${anchor.top - gap}px`,
        transform: 'translate(-50%, -100%)',
        ...extra,
      }
    case 'bottom':
      return {
        left: leftCss,
        top: `${anchor.bottom + gap}px`,
        transform: 'translateX(-50%)',
        ...extra,
      }
    case 'left':
      return {
        left: leftCss,
        top: `${centerY}px`,
        transform: 'translate(-100%, -50%)',
        ...extra,
      }
    case 'right':
      return {
        left: leftCss,
        top: `${centerY}px`,
        transform: 'translateY(-50%)',
        ...extra,
      }
    case 'right-start':
      return {
        left: leftCss,
        top: `${anchor.top}px`,
        ...extra,
      }
    case 'left-start':
      return {
        left: leftCss,
        top: `${anchor.top}px`,
        transform: 'translateX(-100%)',
        ...extra,
      }
    case 'bottom-end':
      return {
        left: leftCss,
        top: `${anchor.bottom + gap}px`,
        transform: 'translateX(-100%)',
        ...extra,
      }
    case 'bottom-start':
      return {
        left: leftCss,
        top: `${anchor.bottom + gap}px`,
        ...extra,
      }
    case 'top-start':
      return {
        left: leftCss,
        top: `${anchor.top - gap}px`,
        transform: 'translateY(-100%)',
        ...extra,
      }
    case 'top-end':
      return {
        left: leftCss,
        top: `${anchor.top - gap}px`,
        transform: 'translate(-100%, -100%)',
        ...extra,
      }
    default:
      return {
        left: leftCss,
        top: `${anchor.bottom + gap}px`,
        ...extra,
      }
  }
}
