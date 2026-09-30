import type { WatermarkFont } from './types'

const FONT_GAP = 3
const DEFAULT_GAP_X = 100
const DEFAULT_GAP_Y = 100

function getPixelRatio() {
  return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
}

function getFontSize(font: WatermarkFont, ratio: number) {
  const raw = font.fontSize ?? 16
  const size = typeof raw === 'number' ? raw : Number.parseFloat(String(raw)) || 16
  return size * ratio
}

function getCanvasFont(font: WatermarkFont, ratio: number) {
  const size = getFontSize(font, ratio)
  const weight = font.fontWeight ?? 'normal'
  const family = font.fontFamily ?? 'sans-serif'
  return `${weight} ${size}px ${family}`
}

function prepareCanvas(width: number, height: number, ratio: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')
  canvas.width = Math.max(1, width * ratio)
  canvas.height = Math.max(1, height * ratio)
  return { ctx, canvas }
}

/** Offsets of a point rotated about the origin. */
function getRotatePos(x: number, y: number, angle: number) {
  return [
    x * Math.cos(angle) - y * Math.sin(angle),
    x * Math.sin(angle) + y * Math.cos(angle),
  ] as const
}

export interface WatermarkPatternOptions {
  content?: string | string[]
  image?: string
  width?: number
  height?: number
  rotate?: number
  gap?: [number, number]
  offset?: [number, number]
  font?: WatermarkFont
}

export interface WatermarkPattern {
  base64: string
  /** Tile size in CSS pixels. Both values are needed for an aligned repeat. */
  width: number
  height: number
}

export async function createWatermarkPattern(
  options: WatermarkPatternOptions,
): Promise<WatermarkPattern> {
  const {
    content,
    image,
    width = 120,
    height = 64,
    rotate = -22,
    gap = [DEFAULT_GAP_X, DEFAULT_GAP_Y],
    offset,
    font = {},
  } = options

  const ratio = getPixelRatio()
  const [gapX, gapY] = gap
  const offsetLeft = offset?.[0] ?? gapX / 2
  const offsetTop = offset?.[1] ?? gapY / 2

  const mark = prepareCanvas(width, height, ratio)
  const realWidth = mark.canvas.width
  const realHeight = mark.canvas.height

  if (image) {
    await new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        mark.ctx.drawImage(img, 0, 0, realWidth, realHeight)
        resolve()
      }
      img.onerror = () => reject(new Error('Watermark image failed to load'))
      img.src = image
    })
  }
  else {
    const lines = Array.isArray(content) ? content : content ? [content] : ['Watermark']
    mark.ctx.textBaseline = 'top'
    mark.ctx.textAlign = 'center'
    mark.ctx.globalAlpha = 0.15
    mark.ctx.font = getCanvasFont(font, ratio)
    mark.ctx.fillStyle = font.color ?? 'rgb(0, 0, 0)'
    const lineHeight = getFontSize(font, ratio) + FONT_GAP * ratio
    lines.forEach((line, index) => {
      mark.ctx.fillText(line, realWidth / 2, index * lineHeight)
    })
  }

  // Rotate inside a square that fits the mark at any angle.
  const angle = (Math.PI / 180) * Number(rotate)
  const side = Math.ceil(Math.hypot(realWidth, realHeight))
  const rotated = prepareCanvas(side, side, ratio)
  rotated.ctx.translate(rotated.canvas.width / 2, rotated.canvas.height / 2)
  rotated.ctx.rotate(angle)
  rotated.ctx.drawImage(mark.canvas, -realWidth / 2, -realHeight / 2)

  // Axis-aligned bounding box of the rotated mark.
  const halfW = realWidth / 2
  const halfH = realHeight / 2
  const corners = [
    getRotatePos(-halfW, -halfH, angle),
    getRotatePos(halfW, -halfH, angle),
    getRotatePos(-halfW, halfH, angle),
    getRotatePos(halfW, halfH, angle),
  ]
  const minX = Math.min(...corners.map(corner => corner[0]))
  const minY = Math.min(...corners.map(corner => corner[1]))
  const maxX = Math.max(...corners.map(corner => corner[0]))
  const maxY = Math.max(...corners.map(corner => corner[1]))
  const rotatedWidth = maxX - minX
  const rotatedHeight = maxY - minY

  const cropped = prepareCanvas(rotatedWidth, rotatedHeight, ratio)
  cropped.ctx.drawImage(rotated.canvas, -minX, -minY)

  // Tile = rotated mark plus gap, so the repeat closes on itself exactly.
  const markW = Math.ceil(rotatedWidth / ratio)
  const markH = Math.ceil(rotatedHeight / ratio)
  const patternWidth = Math.ceil(gapX + markW)
  const patternHeight = Math.ceil(gapY + markH)

  const pattern = prepareCanvas(patternWidth, patternHeight, ratio)
  const drawLeft = Math.round((gapX / 2 + offsetLeft - markW / 2) * ratio)
  const drawTop = Math.round((gapY / 2 + offsetTop - markH / 2) * ratio)
  pattern.ctx.drawImage(cropped.canvas, drawLeft, drawTop)

  return {
    base64: pattern.canvas.toDataURL(),
    width: patternWidth,
    height: patternHeight,
  }
}

export function watermarkOverlayStyle(
  base64: string,
  width: number,
  height: number,
  zIndex: number,
) {
  return {
    zIndex: String(zIndex),
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    backgroundImage: `url('${base64}')`,
    backgroundRepeat: 'repeat',
    backgroundSize: `${width}px ${height}px`,
  } as const
}
