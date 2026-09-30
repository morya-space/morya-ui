/**
 * Seed tokens — the single source of truth every other token is derived from.
 *
 * Mirrors the classic seed layer (same names, same meanings) so palettes
 * derived here stay compatible with the design language the library targets.
 * Values are plain data; no CSS units, no `var()` references.
 */

export interface MSeedTokens {
  /* Brand & semantic colors */
  colorPrimary: string
  colorSuccess: string
  colorWarning: string
  colorError: string
  colorInfo: string
  /** Link color. Empty string falls back to `colorPrimary`. */
  colorLink: string
  /** Base color neutral text is derived from. */
  colorTextBase: string
  /** Base color for surfaces. */
  colorBgBase: string

  /* Typography */
  fontFamily: string
  fontFamilyCode: string
  fontSize: number

  /* Line */
  lineWidth: number

  /* Radius */
  borderRadius: number

  /* Sizing */
  sizeUnit: number
  sizeStep: number
  controlHeight: number

  /* Motion */
  motionUnit: number
  motionBase: number
  motionEaseOut: string
  motionEaseInOut: string
  motionEaseOutBack: string
  motionEaseInBack: string
  motionEaseOutCirc: string
  motionEaseInOutCirc: string

  /* Layering */
  zIndexBase: number
  zIndexPopupBase: number
}

export const defaultFontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`

export const defaultFontFamilyCode = `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`

/** Light seed. Matches the library's default palette. */
export const lightSeed: MSeedTokens = {
  colorPrimary: '#1677ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorInfo: '#1677ff',
  colorLink: '',
  colorTextBase: '#000000',
  colorBgBase: '#ffffff',

  fontFamily: defaultFontFamily,
  fontFamilyCode: defaultFontFamilyCode,
  fontSize: 14,

  lineWidth: 1,
  borderRadius: 6,

  sizeUnit: 4,
  sizeStep: 4,
  controlHeight: 32,

  motionUnit: 0.1,
  motionBase: 0,
  motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  motionEaseOutBack: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
  motionEaseInBack: 'cubic-bezier(0.71, -0.46, 0.88, 0.6)',
  motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
  motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',

  zIndexBase: 1000,
  zIndexPopupBase: 1000,
}

/**
 * Dark seed. Inverting the base colors is what drives the neutral derivation
 * (text/surface/border), matching the classic dark algorithm entry point.
 */
export const darkSeed: MSeedTokens = {
  ...lightSeed,
  colorTextBase: '#ffffff',
  colorBgBase: '#000000',
}

/** Compact seed — tighter sizing, matching the classic compact algorithm. */
export const compactSeed: MSeedTokens = {
  ...lightSeed,
  controlHeight: 28,
  sizeStep: 2,
}

export type MThemeAlgorithm = 'default' | 'dark' | 'compact'

/** Pick the seed that corresponds to an algorithm name. */
export function seedForAlgorithm(algorithm: MThemeAlgorithm): MSeedTokens {
  if (algorithm === 'dark') return darkSeed
  if (algorithm === 'compact') return compactSeed
  return lightSeed
}
