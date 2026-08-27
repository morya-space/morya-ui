import { darkTokens, lightTokens } from './tokens'

export type ThemeName = 'light' | 'dark'

export const themeNames: readonly ThemeName[] = ['light', 'dark']
export { darkTokens, lightTokens }
export type { ColorTokens, DesignTokens, MotionTokens, RadiusTokens, SpacingTokens } from './tokens'
export { applyDensity, useDensity } from './useDensity'
export type { DensityPreference } from './useDensity'
export { applyMotion, getPreferredMotion, useMotion } from './useMotion'
export type { MotionPreference } from './useMotion'
export { useTheme } from './useTheme'

export function getPreferredTheme(): ThemeName {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function applyTheme(theme: ThemeName, target: HTMLElement = document.documentElement) {
  target.dataset.theme = theme
}
