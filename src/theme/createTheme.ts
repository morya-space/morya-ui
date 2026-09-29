/**
 * Runtime theme creation.
 *
 * `createTheme({ seed, algorithm, components })` derives the full `--m-*`
 * variable set from a seed and can apply it to the document (or a scoped
 * element) so a brand change propagates everywhere automatically.
 *
 * Two application strategies are offered:
 * - `apply(target)` writes the base variables as inline styles on an element
 *   (scoped theming, no global stylesheet needed).
 * - `inject()` writes a `<style data-m-theme>` tag, which is required for
 *   component-scoped overrides since those need selectors.
 */

import type { CssVarMap, TokenMap } from './derive'
import type { MSeedTokens, MThemeAlgorithm } from './seed'
import { deriveCssVars, deriveMapTokens, tokensToCssVars, camelToKebab } from './derive'
import { lightSeed } from './seed'

/** Per-component token overrides, keyed by component name (`Button`, `MTable`, ...). */
export type ComponentTokenOverrides = Record<string, Record<string, string | number>>

export interface MThemeConfig {
  /** Seed token overrides. Highest priority — applied last. */
  seed?: Partial<MSeedTokens>
  /** Derivation algorithm(s). `dark` inverts neutrals, `compact` tightens sizing. */
  algorithm?: MThemeAlgorithm | MThemeAlgorithm[]
  /**
   * Component-level token overrides. Keys are camelCase token names
   * (`colorPrimary`) or raw custom properties (`--m-table-row-height`).
   * Values are written into a scope targeting the component root class
   * (`.m-button`), which can be overridden via `selector`.
   */
  components?: ComponentTokenOverrides
  /** Override the auto-derived root selector for a component override key. */
  selector?: (component: string) => string
}

export interface MTheme {
  /** Resolved seed after merging algorithms and overrides. */
  seed: MSeedTokens
  /** Full camelCase token map. */
  tokens: TokenMap
  /** `--m-*` variables for the resolved theme. */
  cssVars: CssVarMap
  /** Stylesheet text: `:root` variables plus component scopes. */
  cssText: string
  /** Resolve a single token value. */
  getToken: (name: string) => string | undefined
  /** Write base variables onto an element (defaults to `document.documentElement`). */
  apply: (target?: HTMLElement) => void
  /** Remove variables previously written by `apply`. */
  remove: (target?: HTMLElement) => void
  /** Inject or update a `<style data-m-theme>` tag. Returns a disposer. */
  inject: (doc?: Document) => () => void
}

const THEME_STYLE_ID = 'm-theme-vars'

/**
 * Seed deltas contributed by each algorithm. Kept as deltas rather than full
 * seeds so multiple algorithms can be combined.
 */
const ALGORITHM_SEED_OVERRIDES: Record<MThemeAlgorithm, Partial<MSeedTokens>> = {
  default: {},
  dark: { colorTextBase: '#ffffff', colorBgBase: '#000000' },
  compact: { controlHeight: 28, sizeStep: 2 },
}

/** `MTable` / `table` / `Table` → `.m-table` */
function defaultSelector(component: string): string {
  const normalized = component.replace(/^M(?=[A-Z])/, '')
  return `.m-${camelToKebab(normalized)}`
}

function normalizeDeclarations(overrides: Record<string, string | number>): Record<string, string> {
  const declarations: Record<string, string> = {}
  for (const [key, value] of Object.entries(overrides)) {
    const name = key.startsWith('--') ? key : `--m-${camelToKebab(key)}`
    declarations[name] = String(value)
  }
  return declarations
}

function mergeAlgorithms(algorithm: MThemeAlgorithm[]): MSeedTokens {
  // Each algorithm contributes only its own deltas, so combinations such as
  // `['dark', 'compact']` compose instead of overwriting one another.
  return algorithm.reduce<MSeedTokens>(
    (acc, name) => ({ ...acc, ...ALGORITHM_SEED_OVERRIDES[name] }),
    lightSeed,
  )
}

/** Derive a theme from a seed / algorithm / component-override config. */
export function createTheme(config: MThemeConfig = {}): MTheme {
  const algorithms = config.algorithm === undefined
    ? []
    : Array.isArray(config.algorithm) ? config.algorithm : [config.algorithm]

  const dark = algorithms.includes('dark')
  const base = algorithms.length > 0 ? mergeAlgorithms(algorithms) : lightSeed
  const seed: MSeedTokens = { ...base, ...config.seed }

  const tokens = deriveMapTokens(seed, { dark })
  const cssVars = deriveCssVars(seed, { dark })

  const declarations = Object.entries(cssVars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')

  const componentBlocks = Object.entries(config.components ?? {})
    .map(([component, overrides]) => {
      const selector = config.selector?.(component) ?? defaultSelector(component)
      const body = Object.entries(normalizeDeclarations(overrides))
        .map(([name, value]) => `  ${name}: ${value};`)
        .join('\n')
      return `${selector} {\n${body}\n}`
    })
    .join('\n\n')

  const cssText = [
    `:root {\n${declarations}\n}`,
    componentBlocks,
  ].filter(Boolean).join('\n\n')

  const apply = (target?: HTMLElement) => {
    const el = target ?? (typeof document !== 'undefined' ? document.documentElement : undefined)
    if (!el) return
    for (const [name, value] of Object.entries(cssVars)) {
      el.style.setProperty(name, value)
    }
  }

  const remove = (target?: HTMLElement) => {
    const el = target ?? (typeof document !== 'undefined' ? document.documentElement : undefined)
    if (!el) return
    for (const name of Object.keys(cssVars)) {
      el.style.removeProperty(name)
    }
  }

  const inject = (doc?: Document) => {
    const targetDoc = doc ?? (typeof document !== 'undefined' ? document : undefined)
    if (!targetDoc) return () => {}

    let style = targetDoc.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null
    if (!style) {
      style = targetDoc.createElement('style')
      style.id = THEME_STYLE_ID
      style.setAttribute('data-m-theme', '')
      targetDoc.head.appendChild(style)
    }
    style.textContent = cssText

    return () => {
      style?.remove()
    }
  }

  return {
    seed,
    tokens,
    cssVars,
    cssText,
    getToken: (name: string) => tokens[name],
    apply,
    remove,
    inject,
  }
}

/** Convenience: derive just the CSS variable map for a config (no DOM work). */
export function resolveThemeCssVars(config: MThemeConfig = {}): CssVarMap {
  const algorithms = config.algorithm === undefined
    ? []
    : Array.isArray(config.algorithm) ? config.algorithm : [config.algorithm]
  const dark = algorithms.includes('dark')
  const base = algorithms.length > 0 ? mergeAlgorithms(algorithms) : lightSeed
  return deriveCssVars({ ...base, ...config.seed }, { dark })
}

/** All CSS variables a theme owns — useful for cleanup and testing. */
export function themeCssVarNames(seed: MSeedTokens = lightSeed): string[] {
  return Object.keys(tokensToCssVars(deriveMapTokens(seed)))
}
