import type { QRCodeErrorLevel } from './types'
import { resolveCssColor } from '../../shared/resolveCssColor'
import { qrcodegen } from './qrcodegen'

export { resolveCssColor }

// Vendored Nayuki namespace; keep runtime access without fighting export-namespace typings.
const QrCode = qrcodegen.QrCode as unknown as {
  Ecc: { LOW: unknown; MEDIUM: unknown; QUARTILE: unknown; HIGH: unknown }
  encodeText: (text: string, ecl: unknown) => {
    size: number
    getModule: (x: number, y: number) => boolean
  }
}

const ECC_MAP: Record<QRCodeErrorLevel, unknown> = {
  L: QrCode.Ecc.LOW,
  M: QrCode.Ecc.MEDIUM,
  Q: QrCode.Ecc.QUARTILE,
  H: QrCode.Ecc.HIGH,
}

export function encodeQrMatrix(text: string, errorLevel: QRCodeErrorLevel = 'M') {
  const qr = QrCode.encodeText(text, ECC_MAP[errorLevel])
  const size = qr.size
  const matrix: boolean[][] = []
  for (let y = 0; y < size; y++) {
    const row: boolean[] = []
    for (let x = 0; x < size; x++) {
      row.push(qr.getModule(x, y))
    }
    matrix.push(row)
  }
  return { matrix, size }
}

export async function drawQrToCanvas(
  canvas: HTMLCanvasElement,
  options: {
    value: string
    size: number
    color?: string
    bgColor?: string
    errorLevel?: QRCodeErrorLevel
    icon?: string | { src: string; size?: number }
    bordered?: boolean
  },
) {
  const {
    value,
    size,
    color,
    bgColor,
    errorLevel = 'M',
    icon,
    bordered = true,
  } = options

  const fg = resolveCssColor(color, 'rgb(0, 0, 0)')
  const bg = resolveCssColor(bgColor, 'rgb(255, 255, 255)')
  const { matrix, size: moduleCount } = encodeQrMatrix(value, errorLevel)

  const border = bordered ? 4 : 0
  const totalModules = moduleCount + border * 2
  const scale = size / totalModules

  const pixel = Math.max(1, Math.floor(scale))
  const canvasSize = totalModules * pixel
  canvas.width = canvasSize
  canvas.height = canvasSize
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, canvasSize, canvasSize)

  ctx.fillStyle = fg
  for (let y = 0; y < moduleCount; y++) {
    const row = matrix[y]
    if (!row) continue
    for (let x = 0; x < moduleCount; x++) {
      if (!row[x]) continue
      ctx.fillRect((x + border) * pixel, (y + border) * pixel, pixel, pixel)
    }
  }

  if (icon) {
    const src = typeof icon === 'string' ? icon : icon.src
    const iconSize = typeof icon === 'string' ? Math.floor(size * 0.22) : (icon.size ?? Math.floor(size * 0.22))
    await new Promise<void>((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const x = (canvasSize - iconSize) / 2
        const y = (canvasSize - iconSize) / 2
        ctx.fillStyle = bg
        ctx.fillRect(x - pixel, y - pixel, iconSize + pixel * 2, iconSize + pixel * 2)
        ctx.drawImage(img, x, y, iconSize, iconSize)
        resolve()
      }
      img.onerror = () => resolve()
      img.src = src
    })
  }
}
