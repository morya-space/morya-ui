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

function getCanvasFont(font: WatermarkFont, ratio: number, height: number) {
  const size = getFontSize(font, ratio)
  const weight = font.fontWeight ?? 'normal'
  const family = font.fontFamily ?? 'sans-serif'
  return `${weight} ${size}px ${family}, sans-serif`
}

function prepareCanvas(width: number, height: number, ratio: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unsupported')
  const realWidth = width * ratio
  const realHeight = height * ratio
  canvas.width = realWidth
  canvas.height = realHeight
  ctx.save()
  return { ctx, canvas, realWidth, realHeight }
}

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

export async function createWatermarkPattern(
  options: WatermarkPatternOptions,
): Promise<{ base64: string; markWidth: number }> {
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
  const gapXCenter = gapX / 2
  const gapYCenter = gapY / 2
  const offsetLeft = offset?.[0] ?? gapXCenter
  const offsetTop = offset?.[1] ?? gapYCenter

  const { ctx, canvas, realWidth, realHeight } = prepareCanvas(width, height, ratio)

  if (image) {
    await new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.drawImage(img, 0, 0, realWidth, realHeight)
        resolve()
      }
      img.onerror = () => reject(new Error('Watermark image failed to load'))
      img.src = image
    })
  }
  else {
    const lines = Array.isArray(content) ? content : content ? [content] : ['Watermark']
    ctx.textBaseline = 'top'
    ctx.textAlign = 'center'
    let top = 0
    ctx.globalAlpha = 0.15
    for (const line of lines) {
      ctx.font = getCanvasFont(font, ratio, height)
      ctx.fillStyle = font.color ?? 'rgb(0, 0, 0)'
      ctx.fillText(line, realWidth / 2, top)
      top += getFontSize(font, ratio) + FONT_GAP * ratio
    }
  }

  const angle = (Math.PI / 180) * Number(rotate)
  const maxSize = Math.max(width, height)
  const rotated = prepareCanvas(maxSize, maxSize, ratio)
  rotated.ctx.translate(rotated.realWidth / 2, rotated.realHeight / 2)
  rotated.ctx.rotate(angle)
  if (realWidth > 0 && realHeight > 0) {
    rotated.ctx.drawImage(canvas, -realWidth / 2, -realHeight / 2)
  }
  rotated.ctx.restore()

  const left = rotated.realWidth / 2
  const topPos = rotated.realHeight / 2
  const [rLeft, rTop] = getRotatePos(-left, -topPos, angle)
  const [pLeft, pTop] = getRotatePos(-left + realWidth, -topPos, angle)
  const [cLeft, cTop] = getRotatePos(-left, -topPos + realHeight, angle)
  const rotatedWidth = Math.max(rLeft, pLeft, cLeft) - Math.min(rLeft, pLeft, cLeft)
  const rotatedHeight = Math.max(rTop, pTop, cTop) - Math.min(rTop, pTop, cTop)

  const cut = prepareCanvas(rotatedWidth, rotatedHeight, ratio)
  cut.ctx.drawImage(
    rotated.canvas,
    -Math.min(rLeft, pLeft, cLeft),
    -Math.min(rTop, pTop, cTop),
  )

  const patternWidth = gapX + rotatedWidth / ratio
  const patternHeight = gapY + rotatedHeight / ratio
  const pattern = prepareCanvas(patternWidth, patternHeight, ratio)
  const drawLeft = offsetLeft * ratio - gapXCenter * ratio
  const drawTop = offsetTop * ratio - gapYCenter * ratio
  pattern.ctx.drawImage(cut.canvas, drawLeft, drawTop)

  return {
    base64: pattern.canvas.toDataURL(),
    markWidth: patternWidth,
  }
}

export function watermarkOverlayStyle(base64: string, markWidth: number, zIndex: number) {
  return {
    zIndex: String(zIndex),
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    backgroundImage: `url('${base64}')`,
    backgroundRepeat: 'repeat',
    backgroundSize: `${Math.floor(markWidth)}px`,
  } as const
}
