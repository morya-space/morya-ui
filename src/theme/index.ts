import { darkTokens, lightTokens } from "./tokens";

export type ThemeName = "light" | "dark";

export const themeNames: readonly ThemeName[] = ["light", "dark"];
export { darkTokens, lightTokens };
export type {
  ColorTokens,
  DesignTokens,
  LayoutTokens,
  MotionTokens,
  RadiusTokens,
  SpacingTokens,
} from "./tokens";
export { applyDensity, useDensity } from "./useDensity";
export type { DensityPreference } from "./useDensity";
export {
  builtinMotionPresets,
  clearCustomMotionPresets,
  listMotionPresets,
  registerMotionPreset,
  resolveMotionPreset,
  resolveMotionTransition,
  unregisterMotionPreset,
} from "./motionPresets";
export type {
  MotionPresetDefinition,
  MotionPresetId,
  MotionTransitionRole,
  ResolveMotionTransitionOptions,
} from "./motionPresets";
export { applyMotion, applyReducedMotionPolicy, getPreferredMotion, useMotion } from "./useMotion";
export type { MotionPreference } from "./useMotion";
export { useMotionTransition } from "./useMotionTransition";
export type { UseMotionTransitionOptions } from "./useMotionTransition";
export { useTheme } from "./useTheme";

export function getPreferredTheme(): ThemeName {
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function applyTheme(
  theme: ThemeName,
  target?: HTMLElement,
) {
  const el = target ?? (typeof document !== 'undefined' ? document.documentElement : undefined)
  if (!el) return
  el.dataset.theme = theme
}
