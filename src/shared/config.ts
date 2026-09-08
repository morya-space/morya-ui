import type {App, Component, ComputedRef, InjectionKey, MaybeRefOrGetter, Plugin} from 'vue';
import type { WkLocaleConfig } from '../locale/types'
import type {DensityPreference} from '../theme';
import type {WkComponentDefaults} from './componentDefaults';
import type { WkGapSize } from './gap'
import type { WkAppendTo } from './overlay'
import type {WkInputVariant, WkSizeInput} from './types';
import {
  
  
  computed,
  
  inject,
  
  
  
  provide,
  toValue
} from 'vue'
import { wkComponents } from '../component-registry'
import { zhCN } from '../locale/zh-CN'
import { applyDensity, applyReducedMotionPolicy } from '../theme'
import {
  getComponentDefault,
  getComponentDefaults,
  mergeComponentDefaults
  
} from './componentDefaults'
import { setWkOverlayAppContext } from './overlayHost'
import { resolveSizeClass   } from './types'

export type { WkComponentDefaultMap, WkComponentDefaults, WkShowPasswordOn, WkTextareaAutosize } from './componentDefaults'
export { getComponentDefault, getComponentDefaults, mergeComponentDefaults } from './componentDefaults'

export type WkDensity = DensityPreference
export type { WkLocaleConfig }

export type ThemePreference = 'light' | 'dark' | 'system'

/** Application-level default configuration. */
export interface WkGlobalConfig {
  /** Color theme. `system` follows `prefers-color-scheme`. */
  theme?: ThemePreference
  /** Default Teleport target for overlays. Defaults to `'body'`. */
  appendTo?: WkAppendTo
  /** Default control size for form components that support `size`. */
  size?: WkSizeInput
  /** Default input surface style. */
  inputVariant?: WkInputVariant
  /** Starting z-index budget for overlays (modal / menu / tooltip layers). */
  zIndex?: number
  /**
   * Global content density. Scales spacing + control heights via `data-wk-density`.
   * Local ConfigProvider scopes to its subtree; plugin applies on `documentElement`.
   */
  density?: WkDensity
  /**
   * When true (default), honor `prefers-reduced-motion` and soften/disable motion.
   * Set to `false` to keep component transitions regardless of OS preference.
   */
  respectReducedMotion?: boolean
  /** Shared UI copy. Pass `zhCN` / `enUS` or a partial override. Default is Chinese. */
  locale?: WkLocaleConfig
  /**
   * Per-component default props. Local component props win.
   * Keys: unprefixed names (`Input`, `Space`) or `Wk*` aliases.
   */
  componentDefaults?: WkComponentDefaults
}

/**
 * Options for `app.use(WiseKit, options)` / `createWiseKit(options)`.
 *
 * By default every public component is registered globally.
 * Pass `components: false` to only install config, or pass a list for partial registration.
 */
export interface WkInstallerOptions extends WkGlobalConfig {
  /**
   * Components to register globally.
   * - omit / `undefined`: register all
   * - `false` / `[]`: register none (config only)
   * - `Component[]`: register the given components (matched by registry name)
   */
  components?: Component[] | false
}

export const WK_CONFIG_KEY: InjectionKey<MaybeRefOrGetter<WkGlobalConfig>> = Symbol('wkConfig')

const defaultConfig: Required<Pick<WkGlobalConfig, 'appendTo' | 'zIndex' | 'density'>> & WkGlobalConfig = {
  appendTo: 'body',
  zIndex: 1000,
  density: 'comfortable',
  inputVariant: 'outlined',
  locale: { ...zhCN },
}

export function getDefaultWkConfig(): WkGlobalConfig {
  return {
    appendTo: defaultConfig.appendTo,
    zIndex: defaultConfig.zIndex,
    density: defaultConfig.density,
    inputVariant: defaultConfig.inputVariant,
    locale: { ...defaultConfig.locale },
  }
}

export function provideWkConfig(config: MaybeRefOrGetter<WkGlobalConfig>) {
  provide(WK_CONFIG_KEY, config)
}

/** Merge nested / plugin config. Child keys win; `locale` and `componentDefaults` merge. */
export function mergeWkConfig(parent: WkGlobalConfig, child: WkGlobalConfig): WkGlobalConfig {
  return {
    ...parent,
    ...child,
    locale:
      parent.locale || child.locale ? { ...parent.locale, ...child.locale } : undefined,
    componentDefaults: mergeComponentDefaults(parent.componentDefaults, child.componentDefaults),
  }
}

export function useWkConfig() {
  const injected = inject(WK_CONFIG_KEY, null)
  return computed<WkGlobalConfig>(() => {
    const value = injected ? toValue(injected) : {}
    return {
      ...getDefaultWkConfig(),
      ...value,
      locale: {
        ...getDefaultWkConfig().locale,
        ...value.locale,
      },
    }
  })
}

export function useComponentDefaults(name: string): ComputedRef<Record<string, unknown>> {
  const config = useWkConfig()
  return computed(() => getComponentDefaults(config.value.componentDefaults, name))
}

/** Control size: local prop > componentDefaults[name].size > global size > medium. */
export function useConfiguredSize(
  componentName: string,
  localSize: MaybeRefOrGetter<WkSizeInput | undefined>,
) {
  const config = useWkConfig()
  return computed(() =>
    resolveSizeClass(
      toValue(localSize)
        ?? getComponentDefault<WkSizeInput>(config.value.componentDefaults, componentName, 'size')
        ?? config.value.size,
    ),
  )
}

/** Input surface: local prop > componentDefaults[name].variant > global inputVariant > outlined. */
export function useConfiguredVariant(
  componentName: string,
  localVariant: MaybeRefOrGetter<WkInputVariant | undefined>,
) {
  const config = useWkConfig()
  return computed(
    () =>
      toValue(localVariant)
      ?? getComponentDefault<WkInputVariant>(config.value.componentDefaults, componentName, 'variant')
      ?? config.value.inputVariant
      ?? 'outlined',
  )
}

/** Space / Flex gap: local prop > componentDefaults[name].size > medium. Does not use global control size. */
export function useConfiguredGapSize(
  componentName: 'Space' | 'Flex',
  localSize: MaybeRefOrGetter<WkGapSize | undefined>,
) {
  const config = useWkConfig()
  return computed(
    () =>
      toValue(localSize)
      ?? getComponentDefault<WkGapSize>(config.value.componentDefaults, componentName, 'size')
      ?? 'medium',
  )
}

/** Resolve overlay mount target: local props > ConfigProvider > body. */
export function resolveConfiguredAppendTo(
  local: WkAppendTo | undefined,
  configAppendTo: WkAppendTo | undefined,
): WkAppendTo {
  if (local !== undefined) return local
  if (configAppendTo !== undefined) return configAppendTo
  return 'body'
}

function resolveComponentsToRegister(components: WkInstallerOptions['components']): Array<[string, Component]> {
  if (components === false) return []
  if (Array.isArray(components)) {
    if (components.length === 0) return []
    const selected = new Set(components)
    return Object.entries(wkComponents).filter(([, component]) => selected.has(component))
  }
  return Object.entries(wkComponents)
}

function applyInstallerConfig(app: App, options: WkInstallerOptions) {
  const { components: _components, ...config } = options
  app.provide(WK_CONFIG_KEY, config)
  app.config.globalProperties.$wk = config
  setWkOverlayAppContext(app._context)
  if (typeof document !== 'undefined') {
    if (config.density) applyDensity(config.density)
    applyReducedMotionPolicy(config.respectReducedMotion)
    if (config.zIndex != null) {
      document.documentElement.style.setProperty('--wk-z-base', String(config.zIndex))
    }
  }
}

function registerComponents(app: App, components: WkInstallerOptions['components']) {
  for (const [name, component] of resolveComponentsToRegister(components)) {
    app.component(name, component)
  }
}

/** Shared install used by `createWiseKit` and the default plugin. */
export function installWiseKit(app: App, options: WkInstallerOptions = {}) {
  applyInstallerConfig(app, options)
  registerComponents(app, options.components)
}

/**
 * Vue plugin entry: global defaults + full component registration.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createWiseKit } from '@wise-kit/ui'
 * import '@wise-kit/ui/styles.css'
 *
 * createApp(App).use(createWiseKit({ size: 'small', density: 'compact' })).mount('#app')
 * // templates can use <WkButton> without importing
 * ```
 *
 * Config only (no global components):
 * ```ts
 * createWiseKit({ size: 'small', components: false })
 * ```
 */
export function createWiseKit(options: WkInstallerOptions = {}): Plugin {
  return {
    install(app: App) {
      installWiseKit(app, options)
    },
  }
}

/**
 * Default plugin:
 * `app.use(WiseKit)` or `app.use(WiseKit, { size: 'small' })`.
 */
export const WiseKit: Plugin = {
  install(app: App, options: WkInstallerOptions = {}) {
    installWiseKit(app, options)
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $wk?: WkGlobalConfig
  }
}
