import type {App, Component, ComputedRef, InjectionKey, MaybeRefOrGetter, Plugin} from 'vue';
import type { WdLocaleConfig } from '../locale/types'
import type {DensityPreference} from '../theme';
import type {WdComponentDefaults} from './componentDefaults';
import type { WdGapSize } from './gap'
import type { WdAppendTo } from './overlay'
import type {WdInputVariant, WdSizeInput} from './types';
import {
  
  
  computed,
  
  inject,
  
  
  
  provide,
  toValue
} from 'vue'
import { wdComponents } from '../component-registry'
import { zhCN } from '../locale/zh-CN'
import { applyDensity  } from '../theme'
import {
  getComponentDefault,
  getComponentDefaults,
  mergeComponentDefaults
  
} from './componentDefaults'
import { setWdOverlayAppContext } from './overlayHost'
import { resolveSizeClass   } from './types'

export type { WdComponentDefaultMap, WdComponentDefaults, WdShowPasswordOn, WdTextareaAutosize } from './componentDefaults'
export { getComponentDefault, getComponentDefaults, mergeComponentDefaults } from './componentDefaults'

export type WdDensity = DensityPreference
export type { WdLocaleConfig }

export type ThemePreference = 'light' | 'dark' | 'system'

/** Application-level default configuration. */
export interface WdGlobalConfig {
  /** Color theme. `system` follows `prefers-color-scheme`. */
  theme?: ThemePreference
  /** Default Teleport target for overlays. Defaults to `'body'`. */
  appendTo?: WdAppendTo
  /** Default control size for form components that support `size`. */
  size?: WdSizeInput
  /** Default input surface style. */
  inputVariant?: WdInputVariant
  /** Starting z-index budget for overlays (modal / menu / tooltip layers). */
  zIndex?: number
  /**
   * Global content density. Scales spacing + control heights via `data-wd-density`.
   * Local ConfigProvider scopes to its subtree; plugin applies on `documentElement`.
   */
  density?: WdDensity
  /** Shared UI copy. Pass `zhCN` / `enUS` or a partial override. Default is Chinese. */
  locale?: WdLocaleConfig
  /**
   * Per-component default props. Local component props win.
   * Keys: unprefixed names (`Input`, `Space`) or `Wd*` aliases.
   */
  componentDefaults?: WdComponentDefaults
}

/**
 * Options for `app.use(WexDesign, options)` / `createWexDesign(options)`.
 *
 * By default every public component is registered globally.
 * Pass `components: false` to only install config, or pass a list for partial registration.
 */
export interface WdInstallerOptions extends WdGlobalConfig {
  /**
   * Components to register globally.
   * - omit / `undefined`: register all
   * - `false` / `[]`: register none (config only)
   * - `Component[]`: register the given components (matched by registry name)
   */
  components?: Component[] | false
}

export const WD_CONFIG_KEY: InjectionKey<MaybeRefOrGetter<WdGlobalConfig>> = Symbol('wdConfig')

const defaultConfig: Required<Pick<WdGlobalConfig, 'appendTo' | 'zIndex' | 'density'>> & WdGlobalConfig = {
  appendTo: 'body',
  zIndex: 1000,
  density: 'comfortable',
  inputVariant: 'outlined',
  locale: { ...zhCN },
}

export function getDefaultWdConfig(): WdGlobalConfig {
  return {
    appendTo: defaultConfig.appendTo,
    zIndex: defaultConfig.zIndex,
    density: defaultConfig.density,
    inputVariant: defaultConfig.inputVariant,
    locale: { ...defaultConfig.locale },
  }
}

export function provideWdConfig(config: MaybeRefOrGetter<WdGlobalConfig>) {
  provide(WD_CONFIG_KEY, config)
}

/** Merge nested / plugin config. Child keys win; `locale` and `componentDefaults` merge. */
export function mergeWdConfig(parent: WdGlobalConfig, child: WdGlobalConfig): WdGlobalConfig {
  return {
    ...parent,
    ...child,
    locale:
      parent.locale || child.locale ? { ...parent.locale, ...child.locale } : undefined,
    componentDefaults: mergeComponentDefaults(parent.componentDefaults, child.componentDefaults),
  }
}

export function useWdConfig() {
  const injected = inject(WD_CONFIG_KEY, null)
  return computed<WdGlobalConfig>(() => {
    const value = injected ? toValue(injected) : {}
    return {
      ...getDefaultWdConfig(),
      ...value,
      locale: {
        ...getDefaultWdConfig().locale,
        ...value.locale,
      },
    }
  })
}

export function useComponentDefaults(name: string): ComputedRef<Record<string, unknown>> {
  const config = useWdConfig()
  return computed(() => getComponentDefaults(config.value.componentDefaults, name))
}

/** Control size: local prop > componentDefaults[name].size > global size > medium. */
export function useConfiguredSize(
  componentName: string,
  localSize: MaybeRefOrGetter<WdSizeInput | undefined>,
) {
  const config = useWdConfig()
  return computed(() =>
    resolveSizeClass(
      toValue(localSize)
        ?? getComponentDefault<WdSizeInput>(config.value.componentDefaults, componentName, 'size')
        ?? config.value.size,
    ),
  )
}

/** Input surface: local prop > componentDefaults[name].variant > global inputVariant > outlined. */
export function useConfiguredVariant(
  componentName: string,
  localVariant: MaybeRefOrGetter<WdInputVariant | undefined>,
) {
  const config = useWdConfig()
  return computed(
    () =>
      toValue(localVariant)
      ?? getComponentDefault<WdInputVariant>(config.value.componentDefaults, componentName, 'variant')
      ?? config.value.inputVariant
      ?? 'outlined',
  )
}

/** Space / Flex gap: local prop > componentDefaults[name].size > medium. Does not use global control size. */
export function useConfiguredGapSize(
  componentName: 'Space' | 'Flex',
  localSize: MaybeRefOrGetter<WdGapSize | undefined>,
) {
  const config = useWdConfig()
  return computed(
    () =>
      toValue(localSize)
      ?? getComponentDefault<WdGapSize>(config.value.componentDefaults, componentName, 'size')
      ?? 'medium',
  )
}

/** Resolve overlay mount target: local props > ConfigProvider > body. */
export function resolveConfiguredAppendTo(
  local: WdAppendTo | undefined,
  configAppendTo: WdAppendTo | undefined,
): WdAppendTo {
  if (local !== undefined) return local
  if (configAppendTo !== undefined) return configAppendTo
  return 'body'
}

function resolveComponentsToRegister(components: WdInstallerOptions['components']): Array<[string, Component]> {
  if (components === false) return []
  if (Array.isArray(components)) {
    if (components.length === 0) return []
    const selected = new Set(components)
    return Object.entries(wdComponents).filter(([, component]) => selected.has(component))
  }
  return Object.entries(wdComponents)
}

function applyInstallerConfig(app: App, options: WdInstallerOptions) {
  const { components: _components, ...config } = options
  app.provide(WD_CONFIG_KEY, config)
  app.config.globalProperties.$wd = config
  setWdOverlayAppContext(app._context)
  if (typeof document !== 'undefined') {
    if (config.density) applyDensity(config.density)
    if (config.zIndex != null) {
      document.documentElement.style.setProperty('--wd-z-base', String(config.zIndex))
    }
  }
}

function registerComponents(app: App, components: WdInstallerOptions['components']) {
  for (const [name, component] of resolveComponentsToRegister(components)) {
    app.component(name, component)
  }
}

/** Shared install used by `createWexDesign` and the default plugin. */
export function installWexDesign(app: App, options: WdInstallerOptions = {}) {
  applyInstallerConfig(app, options)
  registerComponents(app, options.components)
}

/**
 * Vue plugin entry: global defaults + full component registration.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createWexDesign } from '@wex-design/ui'
 * import '@wex-design/ui/styles.css'
 *
 * createApp(App).use(createWexDesign({ size: 'small', density: 'compact' })).mount('#app')
 * // templates can use <WdButton> without importing
 * ```
 *
 * Config only (no global components):
 * ```ts
 * createWexDesign({ size: 'small', components: false })
 * ```
 */
export function createWexDesign(options: WdInstallerOptions = {}): Plugin {
  return {
    install(app: App) {
      installWexDesign(app, options)
    },
  }
}

/**
 * Default plugin:
 * `app.use(WexDesign)` or `app.use(WexDesign, { size: 'small' })`.
 */
export const WexDesign: Plugin = {
  install(app: App, options: WdInstallerOptions = {}) {
    installWexDesign(app, options)
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $wd?: WdGlobalConfig
  }
}
