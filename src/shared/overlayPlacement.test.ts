import { describe, expect, it } from 'vitest'
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
    expect(computeFloatingOverlayStyle(anchor, 'left')).toEqual({
      left: '92px',
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
        zIndex: 50,
        gap: 4,
      }),
    ).toEqual({
      left: '150px',
      top: '244px',
      transform: 'translateX(-50%)',
      minWidth: '120px',
      maxWidth: '240px',
      zIndex: '50',
    })
  })
})
