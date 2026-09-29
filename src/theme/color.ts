/**
 * Color utilities used by the token derivation engine.
 *
 * Pure functions only — no DOM access. The palette generator mirrors the
 * algorithm used by Ant Design's `@ant-design/colors` so that derived
 * palettes stay compatible with the design language the tokens target.
 */

export interface RgbColor {
  r: number
  g: number
  b: number
}

export interface HsvColor {
  h: number
  s: number
  v: number
}

export interface HslColor {
  h: number
  s: number
  l: number
}

const HEX_SHORT = /^#([\da-f])([\da-f])([\da-f])$/i
const HEX_LONG = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i

/** Parse `#rgb`, `#rrggbb` or `#rrggbbaa` into RGB channels. */
export function parseHex(input: string): RgbColor {
  const value = input.trim()

  const short = value.match(HEX_SHORT)
  if (short) {
    const [, r = '0', g = '0', b = '0'] = short
    return {
      r: Number.parseInt(r + r, 16),
      g: Number.parseInt(g + g, 16),
      b: Number.parseInt(b + b, 16),
    }
  }

  const long = value.match(HEX_LONG)
  if (long) {
    const [, r = '00', g = '00', b = '00'] = long
    return {
      r: Number.parseInt(r, 16),
      g: Number.parseInt(g, 16),
      b: Number.parseInt(b, 16),
    }
  }

  return { r: 0, g: 0, b: 0 }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function toHexPair(value: number): string {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')
}

/** Serialize RGB channels to `#rrggbb`. */
export function toHex({ r, g, b }: RgbColor): string {
  return `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`
}

/** Serialize RGB channels to `rgb(r, g, b)`. */
export function toRgbString({ r, g, b }: RgbColor): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

/** Serialize RGB channels to `rgba(r, g, b, a)`. */
export function toRgbaString({ r, g, b }: RgbColor, alpha: number): string {
  const rounded = Number(alpha.toFixed(3))
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${rounded})`
}

export function rgbToHsv({ r, g, b }: RgbColor): HsvColor {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min

  let hue = 0
  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6
    else if (max === green) hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4
    hue *= 60
    if (hue < 0) hue += 360
  }

  const saturation = max === 0 ? 0 : delta / max

  return { h: hue, s: saturation, v: max }
}

export function hsvToRgb({ h, s, v }: HsvColor): RgbColor {
  const hue = ((h % 360) + 360) % 360
  const chroma = v * s
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = v - chroma

  let r = 0
  let g = 0
  let b = 0

  if (hue < 60) [r, g, b] = [chroma, x, 0]
  else if (hue < 120) [r, g, b] = [x, chroma, 0]
  else if (hue < 180) [r, g, b] = [0, chroma, x]
  else if (hue < 240) [r, g, b] = [0, x, chroma]
  else if (hue < 300) [r, g, b] = [x, 0, chroma]
  else [r, g, b] = [chroma, 0, x]

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  }
}

const HUE_STEP = 2
const SATURATION_STEP = 0.16
const SATURATION_STEP_2 = 0.05
const BRIGHTNESS_STEP_1 = 0.05
const BRIGHTNESS_STEP_2 = 0.15
const LIGHT_COUNT = 5
const DARK_COUNT = 4

/** Dark-theme palette is produced by mixing the light patterns into a dark base. */
const DARK_COLOR_MAP: ReadonlyArray<{ index: number, amount: number }> = [
  { index: 7, amount: 15 },
  { index: 6, amount: 25 },
  { index: 5, amount: 30 },
  { index: 5, amount: 45 },
  { index: 5, amount: 65 },
  { index: 5, amount: 85 },
  { index: 4, amount: 90 },
  { index: 3, amount: 95 },
  { index: 2, amount: 97 },
  { index: 1, amount: 98 },
]

const DEFAULT_DARK_BACKGROUND = '#141414'

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/** Hue rotation direction depends on whether the color sits in the blue band. */
function paletteHue(hsv: HsvColor, index: number, light: boolean): number {
  const baseHue = Math.round(hsv.h)
  const inBlueBand = baseHue >= 60 && baseHue <= 240

  let hue = inBlueBand
    ? (light ? baseHue - HUE_STEP * index : baseHue + HUE_STEP * index)
    : (light ? baseHue + HUE_STEP * index : baseHue - HUE_STEP * index)

  if (hue < 0) hue += 360
  else if (hue >= 360) hue -= 360
  return hue
}

function paletteSaturation(hsv: HsvColor, index: number, light: boolean): number {
  // Grey stays grey.
  if (hsv.h === 0 && hsv.s === 0) return hsv.s

  let saturation: number
  if (light) saturation = hsv.s - SATURATION_STEP * index
  else if (index === DARK_COUNT) saturation = hsv.s + SATURATION_STEP
  else saturation = hsv.s + SATURATION_STEP_2 * index

  if (saturation > 1) saturation = 1
  // The lightest step is capped so it stays a tint, not a neon.
  if (light && index === LIGHT_COUNT && saturation > 0.1) saturation = 0.1
  if (saturation < 0.06) saturation = 0.06

  return round2(saturation)
}

function paletteValue(hsv: HsvColor, index: number, light: boolean): number {
  const value = light
    ? hsv.v + BRIGHTNESS_STEP_1 * index
    : hsv.v - BRIGHTNESS_STEP_2 * index

  return round2(Math.max(0, Math.min(1, value)))
}

export interface GeneratePaletteOptions {
  /** Produce the dark-theme palette (mixed into a dark background). */
  dark?: boolean
  /** Background used for the dark-theme mix. Defaults to `#141414`. */
  backgroundColor?: string
}

/**
 * Generate the 10-step palette for a base color, index `0` being the lightest
 * tint and index `9` the darkest shade. Index `5` is the base color itself.
 *
 * Mirrors `@ant-design/colors#generate` so derived palettes line up with the
 * design language this library targets.
 */
export function generateColorPalette(input: string, options: GeneratePaletteOptions = {}): string[] {
  const base = parseHex(input)
  const hsv = rgbToHsv(base)
  const patterns: RgbColor[] = []

  for (let i = LIGHT_COUNT; i > 0; i -= 1) {
    patterns.push(hsvToRgb({
      h: paletteHue(hsv, i, true),
      s: paletteSaturation(hsv, i, true),
      v: paletteValue(hsv, i, true),
    }))
  }

  patterns.push(base)

  for (let i = 1; i <= DARK_COUNT; i += 1) {
    patterns.push(hsvToRgb({
      h: paletteHue(hsv, i, false),
      s: paletteSaturation(hsv, i, false),
      v: paletteValue(hsv, i, false),
    }))
  }

  if (options.dark) {
    const background = parseHex(options.backgroundColor ?? DEFAULT_DARK_BACKGROUND)
    return DARK_COLOR_MAP.map(({ index, amount }) =>
      mixRgb(background, patterns[index] ?? base, amount / 100),
    ).map(toHex)
  }

  return patterns.map(toHex)
}

function mixRgb(from: RgbColor, to: RgbColor, ratio: number): RgbColor {
  const weight = clamp(ratio, 0, 1)
  return {
    r: from.r + (to.r - from.r) * weight,
    g: from.g + (to.g - from.g) * weight,
    b: from.b + (to.b - from.b) * weight,
  }
}

/** Linear interpolation between two colors; `weight` in `[0, 1]`. */
export function mixColors(from: string, to: string, weight: number): string {
  const a = parseHex(from)
  const b = parseHex(to)
  const ratio = clamp(weight, 0, 1)
  return toHex({
    r: a.r + (b.r - a.r) * ratio,
    g: a.g + (b.g - a.g) * ratio,
    b: a.b + (b.b - a.b) * ratio,
  })
}

/** Apply an alpha channel to a hex color. */
export function withAlpha(color: string, alpha: number): string {
  return toRgbaString(parseHex(color), clamp(alpha, 0, 1))
}

/** Relative luminance based darkness check (perceptual, WCAG-ish). */
export function isDarkColor(color: string): boolean {
  const { r, g, b } = parseHex(color)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min

  let hue = 0
  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6
    else if (max === green) hue = (blue - red) / delta + 2
    else hue = (red - green) / delta + 4
    hue *= 60
    if (hue < 0) hue += 360
  }

  const lightness = (max + min) / 2
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))

  return { h: hue, s: saturation, l: lightness }
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hue = ((h % 360) + 360) % 360
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = l - chroma / 2

  let r = 0
  let g = 0
  let b = 0

  if (hue < 60) [r, g, b] = [chroma, x, 0]
  else if (hue < 120) [r, g, b] = [x, chroma, 0]
  else if (hue < 180) [r, g, b] = [0, chroma, x]
  else if (hue < 240) [r, g, b] = [0, x, chroma]
  else if (hue < 300) [r, g, b] = [x, 0, chroma]
  else [r, g, b] = [chroma, 0, x]

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  }
}

/**
 * Shift a color's lightness by `amount` (0-100 scale), matching Ant Design's
 * neutral tone generation: light bases get darker, dark bases get lighter
 * (relative to the remaining headroom so pure black/white stay neutral).
 */
export function darken(color: string, amount: number): string {
  const hsl = rgbToHsl(parseHex(color))
  const ratio = amount / 100
  const next = hsl.l < 0.5
    ? hsl.l + ratio * (1 - hsl.l)
    : hsl.l - ratio

  return toHex(hslToRgb({ ...hsl, l: clamp(next, 0, 1) }))
}

/** `rgba(r, g, b, alpha)` with the alpha written at full precision. */
export function alphaOf(baseColor: string, alpha: number): string {
  return toRgbaString(parseHex(baseColor), clamp(alpha, 0, 1))
}
