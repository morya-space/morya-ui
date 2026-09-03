import type {App, Component, ComputedRef, InjectionKey, MaybeRefOrGetter, Plugin} from 'vue';
import type { WiLocaleConfig } from '../locale/types'
import type {DensityPreference} from '../theme';
import type {WiComponentDefaults} from './componentDefaults';
import type { WiGapSize } from './gap'
import type { WiAppendTo } from './overlay'
import type {WiInputVariant, WiSizeInput} from './types';
import {
  
  
  computed,
  
  inject,
  
  
  
  provide,
  toValue
} from 'vue'
import { wiComponents } from '../component-registry'
import { zhCN } from '../locale/zh-CN'
import { applyDensity  } from '../theme'
import {
  getComponentDefault,
  getComponentDefaults,
  mergeComponentDefaults
  
} from './componentDefaults'
import { setWiOverlayAppContext } from './overlayHost'
import { resolveSizeClass   } from './types'

export type { WiComponentDefaultMap, WiComponentDefaults, WiShowPasswordOn, WiTextareaAutosize } from './componentDefaults'
export { getComponentDefault, getComponentDefaults, mergeComponentDefaults } from './componentDefaults'

export type WiDensity = DensityPreference
export type { WiLocaleConfig }

export type ThemePreference = 'light' | 'dark' | 'system'

/** Application-level default configuration. */
export interface WiGlobalConfig {
  /** Color theme. `system` follows `prefers-color-scheme`. */
  theme?: ThemePreference
  /** Default Teleport target for overlays. Defaults to `'body'`. */
  appendTo?: WiAppendTo
  /** Default control size for form components that support `size`. */
  size?: WiSizeInput
  /** Default input surface style. */
  inputVariant?: WiInputVariant
  /** Starting z-index budget for overlays (modal / menu / tooltip layers). */
  zIndex?: number
  /**
   * Global content density. Scales spacing + control heights via `data-wi-density`.
   * Local ConfigProvider scopes to its subtree; plugin applies on `documentElement`.
   */
  density?: WiDensity
  /** Shared UI copy. Pass `zhCN` / `enUS` or a partial override. Default is Chinese. */
  locale?: WiLocaleConfig
  /**
   * Per-component default props. Local component props win.
   * Keys: unprefixed names (`Input`, `Space`) or `Wi*` aliases.
   */
  componentDefaults?: WiComponentDefaults
}

/**
 * Options for `app.use(WellInsight, options)` / `createWellInsight(options)`.
 *
 * By default every public component is registered globally.
 * Pass `components: false` to only install config, or pass a list for partial registration.
 */
export interface WiInstallerOptions extends WiGlobalConfig {
  /**
   * Components to register globally.
   * - omit / `undefined`: register all
   * - `false` / `[]`: register none (config only)
   * - `Component[]`: register the given components (matched by registry name)
   */
  components?: Component[] | false
}

export const WI_CONFIG_KEY: InjectionKey<MaybeRefOrGetter<WiGlobalConfig>> = Symbol('wiConfig')

const defaultConfig: Required<Pick<WiGlobalConfig, 'appendTo' | 'zIndex' | 'density'>> & WiGlobalConfig = {
  appendTo: 'body',
  zIndex: 1000,
  density: 'comfortable',
  inputVariant: 'outlined',
  locale: { ...zhCN },
}

export function getDefaultWiConfig(): WiGlobalConfig {
  return {
    appendTo: defaultConfig.appendTo,
    zIndex: defaultConfig.zIndex,
    density: defaultConfig.density,
    inputVariant: defaultConfig.inputVariant,
    locale: { ...defaultConfig.locale },
  }
}

export function provideWiConfig(config: MaybeRefOrGetter<WiGlobalConfig>) {
  provide(WI_CONFIG_KEY, config)
}

/** Merge nested / plugin config. Child keys win; `locale` and `componentDefaults` merge. */
export function mergeWiConfig(parent: WiGlobalConfig, child: WiGlobalConfig): WiGlobalConfig {
  return {
    ...parent,
    ...child,
    locale:
      parent.locale || child.locale ? { ...parent.locale, ...child.locale } : undefined,
    componentDefaults: mergeComponentDefaults(parent.componentDefaults, child.componentDefaults),
  }
}

export function useWiConfig() {
  const injected = inject(WI_CONFIG_KEY, null)
  return computed<WiGlobalConfig>(() => {
    const value = injected ? toValue(injected) : {}
    return {
      ...getDefaultWiConfig(),
      ...value,
      locale: {
        ...getDefaultWiConfig().locale,
        ...value.locale,
      },
    }
  })
}

export function useComponentDefaults(name: string): ComputedRef<Record<string, unknown>> {
  const config = useWiConfig()
  return computed(() => getComponentDefaults(config.value.componentDefaults, name))
}

/** Control size: local prop > componentDefaults[name].size > global size > medium. */
export function useConfiguredSize(
  componentName: string,
  localSize: MaybeRefOrGetter<WiSizeInput | undefined>,
) {
  const config = useWiConfig()
  return computed(() =>
    resolveSizeClass(
      toValue(localSize)
        ?? getComponentDefault<WiSizeInput>(config.value.componentDefaults, componentName, 'size')
        ?? config.value.size,
    ),
  )
}

/** Input surface: local prop > componentDefaults[name].variant > global inputVariant > outlined. */
export function useConfiguredVariant(
  componentName: string,
  localVariant: MaybeRefOrGetter<WiInputVariant | undefined>,
) {
  const config = useWiConfig()
  return computed(
    () =>
      toValue(localVariant)
      ?? getComponentDefault<WiInputVariant>(config.value.componentDefaults, componentName, 'variant')
      ?? config.value.inputVariant
      ?? 'outlined',
  )
}

/** Space / Flex gap: local prop > componentDefaults[name].size > medium. Does not use global control size. */
export function useConfiguredGapSize(
  componentName: 'Space' | 'Flex',
  localSize: MaybeRefOrGetter<WiGapSize | undefined>,
) {
  const config = useWiConfig()
  return computed(
    () =>
      toValue(localSize)
      ?? getComponentDefault<WiGapSize>(config.value.componentDefaults, componentName, 'size')
      ?? 'medium',
  )
}

/** Resolve overlay mount target: local props > ConfigProvider > body. */
export function resolveConfiguredAppendTo(
  local: WiAppendTo | undefined,
  configAppendTo: WiAppendTo | undefined,
): WiAppendTo {
  if (local !== undefined) return local
  if (configAppendTo !== undefined) return configAppendTo
  return 'body'
}

function resolveComponentsToRegister(components: WiInstallerOptions['components']): Array<[string, Component]> {
  if (components === false) return []
  if (Array.isArray(components)) {
    if (components.length === 0) return []
    const selected = new Set(components)
    return Object.entries(wiComponents).filter(([, component]) => selected.has(component))
  }
  return Object.entries(wiComponents)
}

function applyInstallerConfig(app: App, options: WiInstallerOptions) {
  const { components: _components, ...config } = options
  app.provide(WI_CONFIG_KEY, config)
  app.config.globalProperties.$wi = config
  setWiOverlayAppContext(app._context)
  if (typeof document !== 'undefined') {
    if (config.density) applyDensity(config.density)
    if (config.zIndex != null) {
      document.documentElement.style.setProperty('--wi-z-base', String(config.zIndex))
    }
  }
}

function registerComponents(app: App, components: WiInstallerOptions['components']) {
  for (const [name, component] of resolveComponentsToRegister(components)) {
    app.component(name, component)
  }
}

/** Shared install used by `createWellInsight` and the default plugin. */
export function installWellInsight(app: App, options: WiInstallerOptions = {}) {
  applyInstallerConfig(app, options)
  registerComponents(app, options.components)
}

/**
 * Vue plugin entry: global defaults + full component registration.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createWellInsight } from '@well-insight/ui'
 * import '@well-insight/ui/styles.css'
 *
 * createApp(App).use(createWellInsight({ size: 'small', density: 'compact' })).mount('#app')
 * // templates can use <WiButton> without importing
 * ```
 *
 * Config only (no global components):
 * ```ts
 * createWellInsight({ size: 'small', components: false })
 * ```
 */
export function createWellInsight(options: WiInstallerOptions = {}): Plugin {
  return {
    install(app: App) {
      installWellInsight(app, options)
    },
  }
}

/**
 * Default plugin:
 * `app.use(WellInsight)` or `app.use(WellInsight, { size: 'small' })`.
 */
export const WellInsight: Plugin = {
  install(app: App, options: WiInstallerOptions = {}) {
    installWellInsight(app, options)
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $wi?: WiGlobalConfig
  }
}
