import { afterEach, describe, expect, it, vi } from 'vitest'
import { createWatermarkPattern, watermarkOverlayStyle } from './watermarkCanvas'

function stubCanvas() {
  const ctx = {
    save: vi.fn(),
    restore: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    textBaseline: '',
    textAlign: '',
    font: '',
    fillStyle: '',
    globalAlpha: 1,
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  )
  HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,test')
  return ctx
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('createWatermarkPattern', () => {
  it('returns a tile sized to the gap plus the rotated mark', async () => {
    stubCanvas()
    const { width, height } = await createWatermarkPattern({
      content: 'Morya',
      gap: [100, 100],
    })
    // Tile must exceed the gap in both axes, and must not collapse to a square.
    expect(width).toBeGreaterThan(100)
    expect(height).toBeGreaterThan(100)
    expect(width).not.toBe(height)
  })

  it('reports the pattern canvas dimensions as the tile size', async () => {
    stubCanvas()
    const created: HTMLCanvasElement[] = []
    const createElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const node = createElement(tag)
      if (tag === 'canvas') created.push(node as HTMLCanvasElement)
      return node
    })

    const { base64, width, height } = await createWatermarkPattern({ content: 'Morya' })
    // The last canvas built is the tile; its backing store must describe the
    // exact size the CSS background is scaled to, otherwise repeats drift.
    const tile = created.at(-1)!
    expect(tile.width).toBe(width)
    expect(tile.height).toBe(height)
    expect(base64).toContain('data:image/png')
  })
})

describe('watermarkOverlayStyle', () => {
  it('sets both background dimensions so the tile repeats without scaling', () => {
    const style = watermarkOverlayStyle('data:image/png;base64,test', 236, 205, 9)
    expect(style.backgroundSize).toBe('236px 205px')
    expect(style.backgroundRepeat).toBe('repeat')
    expect(style.zIndex).toBe('9')
    expect(style.pointerEvents).toBe('none')
  })
})
