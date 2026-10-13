export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSB {
  h: number
  s: number
  b: number
}

export interface HSV extends HSB {}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function round(value: number, precision = 0): number {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

export function hexToRgb(hex: string): RGB | null {
  const normalized = hex.replace('#', '').trim()
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return null
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  }
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

export function rgbToHsb(rgb: RGB): HSB {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) * 60
    else if (max === g) h = ((b - r) / delta + 2) * 60
    else h = ((r - g) / delta + 4) * 60
  }
  const s = max === 0 ? 0 : delta / max
  return { h: round(h), s: round(s, 4), b: round(max, 4) }
}

export function hsbToRgb(hsb: HSB): RGB {
  const h = ((hsb.h % 360) + 360) % 360
  const s = clamp(hsb.s, 0, 1)
  const v = clamp(hsb.b, 0, 1)
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }
  return {
    r: round((r + m) * 255),
    g: round((g + m) * 255),
    b: round((b + m) * 255),
  }
}

export function rgbToHsvString(rgb: RGB): string {
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

export function hsbToHsvString(hsb: HSB): string {
  return `${round(hsb.h)}, ${round(hsb.s * 100)}%, ${round(hsb.b * 100)}%`
}

export function isValidHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value.trim())
}

export function normalizeHex(value: string): string {
  const trimmed = value.trim()
  if (isValidHex(trimmed)) return trimmed.toLowerCase()
  const rgb = hexToRgb(trimmed)
  return rgb ? rgbToHex(rgb) : '#000000'
}
