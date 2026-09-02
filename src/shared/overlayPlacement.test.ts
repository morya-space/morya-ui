import { afterEach, describe, expect, it } from 'vitest'
import { computeFloatingOverlayStyle, toCssSize } from './overlayPlacement'

const anchor = {
  left: 100,
  top: 200,
  right: 200,
  bottom: 240,
  width: 100,
  height: 40,
  x: 100,
  y: 200,
  toJSON: () => ({}),
} as DOMRect

function makeAnchor(partial: Partial<DOMRect>): DOMRect {
  return { ...anchor, ...partial, toJSON: () => ({}) } as DOMRect
}

const originalInnerWidth = window.innerWidth
const originalInnerHeight = window.innerHeight

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
  Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: height })
}

afterEach(() => {
  setViewport(originalInnerWidth, originalInnerHeight)
})

describe('overlayPlacement', () => {
  it('converts numeric sizes to px', () => {
    expect(toCssSize(12)).toBe('12px')
    expect(toCssSize('50%')).toBe('50%')
    expect(toCssSize(undefined)).toBeUndefined()
  })

  it('positions top and bottom overlays from anchor center', () => {
    expect(computeFloatingOverlayStyle(anchor, 'top')).toEqual({
      left: '150px',
      top: '192px',
      transform: 'translate(-50%, -100%)',
    })
    expect(computeFloatingOverlayStyle(anchor, 'bottom')).toEqual({
      left: '150px',
      top: '248px',
      transform: 'translateX(-50%)',
    })
  })

  it('positions side overlays from anchor edges', () => {
    // happy-dom viewport is 1024px wide; the left overlay (est. width 100) is
    // clamped so its visible left edge stays 8px inside the viewport.
    expect(computeFloatingOverlayStyle(anchor, 'left')).toEqual({
      left: '108px',
      top: '220px',
      transform: 'translate(-100%, -50%)',
    })
    expect(computeFloatingOverlayStyle(anchor, 'right')).toEqual({
      left: '208px',
      top: '220px',
      transform: 'translateY(-50%)',
    })
  })

  it('positions bottom-start and bottom-end anchors', () => {
    expect(computeFloatingOverlayStyle(anchor, 'bottom-start')).toEqual({
      left: '100px',
      top: '248px',
    })
    expect(computeFloatingOverlayStyle(anchor, 'bottom-end')).toEqual({
      left: '200px',
      top: '248px',
      transform: 'translateX(-100%)',
    })
  })

  it('applies optional width and z-index', () => {
    expect(
      computeFloatingOverlayStyle(anchor, 'bottom', {
        minWidth: '120px',
        maxWidth: '240px',
        width: '100px',
        zIndex: 50,
        gap: 4,
      }),
    ).toEqual({
      left: '150px',
      top: '244px',
      transform: 'translateX(-50%)',
      minWidth: '120px',
      maxWidth: '240px',
      width: '100px',
      zIndex: '50',
    })
  })

  it('flips bottom-start to top-start when space below is insufficient', () => {
    setViewport(1024, 400)
    const lowAnchor = makeAnchor({ top: 300, bottom: 340, y: 300 })
    expect(computeFloatingOverlayStyle(lowAnchor, 'bottom-start')).toEqual({
      left: '100px',
      top: '292px',
      transform: 'translateY(-100%)',
    })
  })

  it('mirrors bottom-end to top-end when flipping', () => {
    setViewport(1024, 400)
    const lowAnchor = makeAnchor({ top: 300, bottom: 340, y: 300 })
    expect(computeFloatingOverlayStyle(lowAnchor, 'bottom-end')).toEqual({
      left: '200px',
      top: '292px',
      transform: 'translate(-100%, -100%)',
    })
  })

  it('flips bottom to top for centered overlays', () => {
    setViewport(1024, 400)
    const lowAnchor = makeAnchor({ top: 300, bottom: 340, y: 300 })
    expect(computeFloatingOverlayStyle(lowAnchor, 'bottom')).toEqual({
      left: '150px',
      top: '292px',
      transform: 'translate(-50%, -100%)',
    })
  })

  it('stays downward when space above is not larger than space below', () => {
    setViewport(1024, 300)
    const highAnchor = makeAnchor({ top: 40, bottom: 80, y: 40 })
    expect(computeFloatingOverlayStyle(highAnchor, 'bottom-start')).toEqual({
      left: '100px',
      top: '88px',
    })
  })

  it('uses maxHeight as the height estimate for flip detection', () => {
    setViewport(1024, 400)
    const lowAnchor = makeAnchor({ top: 300, bottom: 340, y: 300 })
    expect(computeFloatingOverlayStyle(lowAnchor, 'bottom-start', { maxHeight: 40 })).toEqual({
      left: '100px',
      top: '348px',
      maxHeight: '40px',
    })
  })

  it('clamps left so the overlay stays inside the right viewport edge', () => {
    setViewport(320, 768)
    const rightEdgeAnchor = makeAnchor({ left: 250, right: 350, x: 250 })
    expect(computeFloatingOverlayStyle(rightEdgeAnchor, 'bottom-start')).toEqual({
      left: '212px',
      top: '248px',
    })
  })

  it('clamps left so the overlay stays inside the left viewport edge', () => {
    setViewport(1024, 768)
    const leftEdgeAnchor = makeAnchor({ left: 0, right: 50, width: 50, x: 0 })
    expect(computeFloatingOverlayStyle(leftEdgeAnchor, 'bottom-end')).toEqual({
      left: '58px',
      top: '248px',
      transform: 'translateX(-100%)',
    })
  })

  it('respects a custom viewportMargin when clamping', () => {
    setViewport(320, 768)
    const rightEdgeAnchor = makeAnchor({ left: 250, right: 350, x: 250 })
    expect(
      computeFloatingOverlayStyle(rightEdgeAnchor, 'bottom-start', { viewportMargin: 20 }),
    ).toEqual({
      left: '200px',
      top: '248px',
    })
  })

  it('honors explicit estimatedWidth and estimatedHeight overrides', () => {
    setViewport(400, 400)
    const wideAnchor = makeAnchor({ top: 300, bottom: 340, y: 300 })
    // Width estimate 300 forces a stronger clamp than the anchor width (100).
    expect(
      computeFloatingOverlayStyle(wideAnchor, 'bottom-start', {
        estimatedWidth: 300,
        estimatedHeight: 100,
      }),
    ).toEqual({
      left: '92px',
      top: '292px',
      transform: 'translateY(-100%)',
    })
  })
})
