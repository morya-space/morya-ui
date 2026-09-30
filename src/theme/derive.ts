/**
 * Token derivation engine.
 *
 * `deriveCssVars(seed)` turns a small set of seed tokens into the full
 * `--m-*` variable set, so a brand change propagates to every hover / active /
 * border / background / size / typography token automatically.
 *
 * The output is a plain `Record<cssVarName, value>`; apply it to a DOM element
 * (see `createTheme`) to override the defaults shipped in `styles.css`.
 *
 * Derivation rules follow the classic seed → map → alias pipeline so the
 * results stay compatible with the design language this library targets.
 * For the default seeds the output reproduces the values already authored in
 * `src/theme/styles.css` exactly.
 */

import { alphaOf, darken, generateColorPalette, isDarkColor, mixColors } from './color'
import type { MSeedTokens } from './seed'

export interface DeriveOptions {
  /** Force neutral derivation into dark mode. Detected from `colorBgBase` by default. */
  dark?: boolean
  /** Use the compact sizing profile (tighter control heights and spacing). */
  compact?: boolean
}

/** camelCase token name → resolved value. */
export type TokenMap = Record<string, string>
/** CSS custom property name (including the `--m-` prefix) → value. */
export type CssVarMap = Record<string, string>

const PALETTE_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const
type PaletteStep = (typeof PALETTE_STEPS)[number]
type IndexedPalette = Record<PaletteStep, string>

const SEMANTIC_FAMILIES = [
  'primary',
  'success',
  'warning',
  'error',
  'info',
  'link',
] as const

type SemanticFamily = (typeof SEMANTIC_FAMILIES)[number]

/** Read a token the derivation is expected to have produced. */
function pick(tokens: TokenMap, name: string): string {
  const value = tokens[name]
  if (value === undefined) {
    throw new Error(`[morya-ui] Missing derived token "${name}". This is a bug in the token engine.`)
  }
  return value
}

/**
 * Map the raw 10-step generated palette onto 1-based token
 * indices. Light and dark themes read the palette in different orders.
 */
function toIndexedPalette(baseColor: string, dark: boolean): IndexedPalette {
  const colors = generateColorPalette(baseColor, { dark })
  const order = dark
    ? [0, 1, 2, 3, 6, 5, 4, 6, 5, 4]
    : [0, 1, 2, 3, 4, 5, 6, 4, 5, 6]

  const at = (position: number) => {
    const sourceIndex = order[position]
    if (sourceIndex === undefined) return baseColor
    return colors[sourceIndex] ?? baseColor
  }

  return {
    1: at(0),
    2: at(1),
    3: at(2),
    4: at(3),
    5: at(4),
    6: at(5),
    7: at(6),
    8: at(7),
    9: at(8),
    10: at(9),
  }
}

/** `colorPrimary` → `color-primary`; `colorBgContainer` → `color-bg-container`. */
export function camelToKebab(input: string): string {
  return input.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()
}

/** Build the semantic color families (primary / success / warning / error / info / link). */
function deriveColorTokens(seed: MSeedTokens, dark: boolean): TokenMap {
  const tokens: TokenMap = {}

  const bases: Record<SemanticFamily, string> = {
    primary: seed.colorPrimary,
    success: seed.colorSuccess,
    warning: seed.colorWarning,
    error: seed.colorError,
    info: seed.colorInfo,
    link: seed.colorLink || seed.colorPrimary,
  }

  const palettes = {} as Record<SemanticFamily, IndexedPalette>

  for (const family of SEMANTIC_FAMILIES) {
    const palette = toIndexedPalette(bases[family], dark)
    palettes[family] = palette
    const name = `${family.charAt(0).toUpperCase()}${family.slice(1)}`

    for (const step of PALETTE_STEPS) {
      tokens[`color${name}${step}`] = palette[step]
    }

    tokens[`color${name}Bg`] = palette[1]
    tokens[`color${name}BgHover`] = palette[2]
    tokens[`color${name}Border`] = palette[3]
    tokens[`color${name}BorderHover`] = palette[4]
    tokens[`color${name}Hover`] = palette[5]
    tokens[`color${name}`] = palette[6]
    tokens[`color${name}Active`] = palette[7]
    tokens[`color${name}TextHover`] = palette[8]
    tokens[`color${name}Text`] = palette[9]
    tokens[`color${name}TextActive`] = palette[10]
  }

  // Family-specific deviations from the shared shape.
  tokens.colorSuccessHover = palettes.success[4]
  tokens.colorWarningHover = palettes.warning[4]
  tokens.colorInfoHover = palettes.info[4]
  tokens.colorErrorBgActive = palettes.error[3]
  tokens.colorErrorBgFilledHover = mixColors(palettes.error[1], palettes.error[3], 0.5)

  // In dark mode tinted backgrounds sit on the border tone so they stay visible.
  if (dark) {
    tokens.colorPrimaryBg = palettes.primary[3]
    tokens.colorPrimaryBgHover = palettes.primary[4]
    tokens.colorErrorBg = palettes.error[3]
    tokens.colorWarningBg = palettes.warning[3]
    tokens.colorSuccessBg = palettes.success[3]
    tokens.colorInfoBg = palettes.info[3]
  }

  return tokens
}

/** Build neutral surfaces, text, borders and fills. */
function deriveNeutralTokens(seed: MSeedTokens, dark: boolean): TokenMap {
  const textBase = seed.colorTextBase || (dark ? '#ffffff' : '#000000')
  const bgBase = seed.colorBgBase || (dark ? '#000000' : '#ffffff')

  if (dark) {
    return {
      colorBgBase: bgBase,
      colorTextBase: textBase,

      colorText: alphaOf(textBase, 0.85),
      colorTextSecondary: alphaOf(textBase, 0.65),
      colorTextTertiary: alphaOf(textBase, 0.45),
      colorTextQuaternary: alphaOf(textBase, 0.25),

      colorFill: alphaOf(textBase, 0.18),
      colorFillSecondary: alphaOf(textBase, 0.12),
      colorFillTertiary: alphaOf(textBase, 0.08),
      colorFillQuaternary: alphaOf(textBase, 0.04),

      colorBgSolid: alphaOf(textBase, 0.95),
      colorBgSolidHover: alphaOf(textBase, 1),
      colorBgSolidActive: alphaOf(textBase, 0.9),

      colorBgLayout: darken(bgBase, 0),
      colorBgContainer: darken(bgBase, 8),
      colorBgElevated: darken(bgBase, 12),
      colorBgSpotlight: darken(bgBase, 26),
      colorBgBlur: alphaOf(textBase, 0.04),

      colorBorder: darken(bgBase, 26),
      colorBorderDisabled: darken(bgBase, 26),
      colorBorderSecondary: darken(bgBase, 19),
    }
  }

  return {
    colorBgBase: bgBase,
    colorTextBase: textBase,

    colorText: alphaOf(textBase, 0.88),
    colorTextSecondary: alphaOf(textBase, 0.65),
    colorTextTertiary: alphaOf(textBase, 0.45),
    colorTextQuaternary: alphaOf(textBase, 0.25),

    colorFill: alphaOf(textBase, 0.15),
    colorFillSecondary: alphaOf(textBase, 0.06),
    colorFillTertiary: alphaOf(textBase, 0.04),
    colorFillQuaternary: alphaOf(textBase, 0.02),

    colorBgSolid: alphaOf(textBase, 1),
    colorBgSolidHover: alphaOf(textBase, 0.75),
    colorBgSolidActive: alphaOf(textBase, 0.95),

    colorBgLayout: darken(bgBase, 4),
    colorBgContainer: darken(bgBase, 0),
    colorBgElevated: darken(bgBase, 0),
    colorBgSpotlight: alphaOf(textBase, 0.85),
    colorBgBlur: 'transparent',

    colorBorder: darken(bgBase, 15),
    colorBorderDisabled: darken(bgBase, 15),
    colorBorderSecondary: darken(bgBase, 6),
  }
}

/** Alias tokens layered on top of the map tokens. */
function deriveAliasTokens(seed: MSeedTokens, dark: boolean, tokens: TokenMap): TokenMap {
  const textBase = seed.colorTextBase || (dark ? '#ffffff' : '#000000')

  return {
    colorTextPlaceholder: pick(tokens, 'colorTextQuaternary'),
    colorTextDisabled: alphaOf(textBase, dark ? 0.3 : 0.25),
    colorTextHeading: pick(tokens, 'colorText'),
    colorTextLabel: pick(tokens, 'colorTextSecondary'),
    colorTextDescription: pick(tokens, 'colorTextTertiary'),
    colorTextLightSolid: '#ffffff',
    colorIcon: pick(tokens, 'colorTextTertiary'),
    colorIconHover: pick(tokens, 'colorText'),
    colorHighlight: pick(tokens, 'colorError'),
    colorBgDisabled: alphaOf(textBase, dark ? 0.08 : 0.04),
    colorBgMask: alphaOf('#000000', 0.45),
    colorWhite: '#ffffff',
    colorSplit: pick(tokens, 'colorBorderSecondary'),
    controlOutline: pick(tokens, 'colorPrimaryBg'),
    controlOutlineWidth: '2px',
    controlItemBgHover: pick(tokens, 'colorFillTertiary'),
    controlItemBgActive: pick(tokens, 'colorPrimaryBg'),
    controlItemBgActiveHover: pick(tokens, 'colorPrimaryBgHover'),
    controlItemBgActiveDisabled: pick(tokens, 'colorFill'),
    controlInteractiveSize: `${seed.controlHeight}px`,
  }
}

/** Sizing scale derived from `sizeUnit` / `sizeStep`. */
function deriveSizeTokens(seed: MSeedTokens): TokenMap {
  const base = seed.sizeUnit * seed.sizeStep
  const { sizeStep } = seed

  return {
    sizeXXL: `${base + sizeStep * 8}px`,
    sizeXL: `${base + sizeStep * 4}px`,
    sizeLG: `${base + sizeStep * 2}px`,
    sizeMD: `${base + sizeStep}px`,
    sizeMS: `${base + sizeStep / 2}px`,
    size: `${base}px`,
    sizeSM: `${base - sizeStep}px`,
    sizeXS: `${base - sizeStep * 2}px`,
    sizeXXS: `${base - sizeStep * 3}px`,
  }
}

/** Control heights derived from `controlHeight`. */
function deriveControlTokens(seed: MSeedTokens): TokenMap {
  const { controlHeight } = seed
  return {
    controlHeightXS: `${controlHeight * 0.5}px`,
    controlHeightSM: `${controlHeight * 0.75}px`,
    controlHeight: `${controlHeight}px`,
    controlHeightLG: `${controlHeight * 1.25}px`,
    controlPaddingHorizontal: '12px',
    controlPaddingHorizontalSM: '8px',
  }
}

/** Typography scale derived from `fontSize`. */
function deriveFontTokens(seed: MSeedTokens): TokenMap {
  const { fontSize } = seed

  const sizeSM = fontSize - 2
  const sizeBase = fontSize
  const sizeLG = fontSize + 2
  const sizeXL = fontSize + 6
  const sizeH3 = fontSize + 10
  const sizeH2 = fontSize + 14
  const sizeH1 = fontSize + 24

  const lineHeightSM = 1.6667
  const lineHeightBase = 1.5714
  const lineHeightLG = 1.5
  const lineHeightH4 = 1.4
  const lineHeightH3 = 1.3333
  const lineHeightH2 = 1.2857
  const lineHeightH1 = 1.2105

  const round = (value: number) => Number(value.toFixed(4))

  return {
    fontSizeSM: `${sizeSM}px`,
    fontSize: `${sizeBase}px`,
    fontSizeLG: `${sizeLG}px`,
    fontSizeXL: `${sizeXL}px`,
    fontSizeHeading1: `${sizeH1}px`,
    fontSizeHeading2: `${sizeH2}px`,
    fontSizeHeading3: `${sizeH3}px`,
    fontSizeHeading4: `${sizeXL}px`,
    fontSizeHeading5: `${sizeLG}px`,
    lineHeight: String(round(lineHeightBase)),
    lineHeightSM: String(round(lineHeightSM)),
    lineHeightLG: String(round(lineHeightLG)),
    lineHeightHeading1: String(round(lineHeightH1)),
    lineHeightHeading2: String(round(lineHeightH2)),
    lineHeightHeading3: String(round(lineHeightH3)),
    lineHeightHeading4: String(round(lineHeightH4)),
    lineHeightHeading5: String(round(lineHeightLG)),
    fontHeight: `${Math.round(lineHeightBase * sizeBase)}px`,
    fontHeightSM: `${Math.round(lineHeightSM * sizeSM)}px`,
    fontHeightLG: `${Math.round(lineHeightLG * sizeLG)}px`,
    fontSizeIcon: '12px',
    fontWeightStrong: '600',
  }
}

/** Radius scale derived from `borderRadius`. */
function deriveRadiusTokens(seed: MSeedTokens): TokenMap {
  const { borderRadius } = seed
  return {
    borderRadiusXS: `${Math.max(borderRadius - 4, 2)}px`,
    borderRadiusSM: `${Math.max(borderRadius - 2, 2)}px`,
    borderRadius: `${borderRadius}px`,
    borderRadiusLG: `${borderRadius + 2}px`,
    borderRadiusOuter: `${borderRadius + 4}px`,
  }
}

/** Line widths and motion tokens. */
function deriveSharedTokens(seed: MSeedTokens): TokenMap {
  const fast = seed.motionBase + seed.motionUnit
  const mid = seed.motionBase + seed.motionUnit * 2
  const slow = seed.motionBase + seed.motionUnit * 3

  return {
    lineWidth: `${seed.lineWidth}px`,
    lineWidthBold: `${seed.lineWidth + 1}px`,
    lineWidthFocus: `${seed.lineWidth * 3}px`,

    motionDurationFast: `${fast.toFixed(1)}s`,
    motionDurationMid: `${mid.toFixed(1)}s`,
    motionDurationSlow: `${slow.toFixed(1)}s`,
    motionEaseOut: seed.motionEaseOut,
    motionEaseInOut: seed.motionEaseInOut,
    motionEaseOutBack: seed.motionEaseOutBack,
    motionEaseInBack: seed.motionEaseInBack,
    motionEaseOutCirc: seed.motionEaseOutCirc,
    motionEaseInOutCirc: seed.motionEaseInOutCirc,

    fontFamily: seed.fontFamily,
    fontFamilyCode: seed.fontFamilyCode,
  }
}

/** Derive every map + alias token from a seed. */
export function deriveMapTokens(seed: MSeedTokens, options: DeriveOptions = {}): TokenMap {
  const dark = options.dark ?? isDarkColor(seed.colorBgBase)

  const colorTokens = deriveColorTokens(seed, dark)
  const neutralTokens = deriveNeutralTokens(seed, dark)
  const base: TokenMap = { ...neutralTokens, ...colorTokens }

  return {
    ...base,
    ...deriveAliasTokens(seed, dark, base),
    ...deriveSizeTokens(seed),
    ...deriveControlTokens(seed),
    ...deriveFontTokens(seed),
    ...deriveRadiusTokens(seed),
    ...deriveSharedTokens(seed),
  }
}

/**
 * Convert camelCase token names into `--m-*` custom properties.
 *
 * A few derived token names collide with legacy Morya tokens that carry a
 * different meaning (a different concrete value). Those are intentionally not
 * emitted here — the legacy scale stays authoritative, and the derived value is
 * still available on the token map itself (`deriveMapTokens`).
 */
export function tokensToCssVars(tokens: TokenMap): CssVarMap {
  const vars: CssVarMap = {}
  for (const [name, value] of Object.entries(tokens)) {
    if (LEGACY_NAME_COLLISIONS.has(name)) continue
    vars[`--m-${camelToKebab(name)}`] = value
  }
  return vars
}

/**
 * Derived token names that collide with an existing `--m-*` variable of a
 * different value. Skipped on purpose to avoid regressing the shipped scale.
 */
const LEGACY_NAME_COLLISIONS = new Set([
  // Legacy: 13px / 18px. Derived scale: 12px / 16px.
  'fontSizeSM',
  'fontSizeLG',
])

/**
 * Compatibility aliases: the legacy `--m-*` names the shipped CSS already
 * consumes. Emitting these keeps existing component styles in sync when a
 * custom seed is applied at runtime.
 */
export function deriveCompatCssVars(seed: MSeedTokens, tokens: TokenMap): CssVarMap {
  const space = deriveSizeTokens(seed)

  // The legacy duration scale is a multiple of `motionUnit`; deriving it here
  // keeps the shipped 150ms / 250ms defaults while still following the seed.
  const toMs = (multiplier: number) =>
    `${Math.round((seed.motionBase + seed.motionUnit * multiplier) * 1000)}ms`

  return {
    '--m-color-surface': pick(tokens, 'colorBgContainer'),
    '--m-color-split': pick(tokens, 'colorSplit'),
    '--m-color-text-muted': pick(tokens, 'colorTextTertiary'),
    '--m-color-text-disabled': pick(tokens, 'colorTextDisabled'),
    '--m-color-bg-disabled': pick(tokens, 'colorBgDisabled'),
    '--m-color-danger': pick(tokens, 'colorError'),
    '--m-color-warn': pick(tokens, 'colorWarning'),
    '--m-color-info': pick(tokens, 'colorInfo'),
    '--m-color-focus-ring': pick(tokens, 'colorPrimary'),
    '--m-color-primary-active': pick(tokens, 'colorPrimaryActive'),
    '--m-color-on-emphasis': pick(tokens, 'colorTextLightSolid'),
    '--m-color-on-primary': pick(tokens, 'colorTextLightSolid'),
    '--m-radius-control': pick(tokens, 'borderRadius'),
    '--m-radius-sm': pick(tokens, 'borderRadiusSM'),
    '--m-radius-md': pick(tokens, 'borderRadiusLG'),
    '--m-radius-lg': pick(tokens, 'borderRadiusLG'),
    '--m-radius-pill': '9999px',
    '--m-line-height-md': pick(tokens, 'lineHeight'),
    '--m-border-width': pick(tokens, 'lineWidth'),
    '--m-font-sans': pick(tokens, 'fontFamily'),
    '--m-font-size-md': pick(tokens, 'fontSize'),
    '--m-control-height-small': pick(tokens, 'controlHeightSM'),
    '--m-control-height-medium': pick(tokens, 'controlHeight'),
    '--m-control-height-large': pick(tokens, 'controlHeightLG'),

    '--m-space-1': pick(space, 'sizeXXS'),
    '--m-space-2': pick(space, 'sizeXS'),
    '--m-space-3': pick(space, 'sizeSM'),
    '--m-space-4': pick(tokens, 'size'),
    '--m-space-5': pick(tokens, 'sizeMD'),
    '--m-space-6': pick(tokens, 'sizeLG'),
    '--m-space-8': pick(tokens, 'sizeXL'),

    '--m-motion-fast': toMs(1.5),
    '--m-motion-normal': toMs(2.5),
    '--m-motion-enter': toMs(2),
    '--m-motion-exit': toMs(1.5),
    '--m-motion-ease': pick(tokens, 'motionEaseOut'),
    '--m-z-sticky': '10',
  }
}

/**
 * Derive the complete `--m-*` override set for a seed.
 * This is the single entry point most callers need.
 */
export function deriveCssVars(seed: MSeedTokens, options: DeriveOptions = {}): CssVarMap {
  const tokens = deriveMapTokens(seed, options)
  return {
    ...tokensToCssVars(tokens),
    ...deriveCompatCssVars(seed, tokens),
  }
}
