import type {App, Component, ComputedRef, InjectionKey, MaybeRefOrGetter, Plugin} from 'vue';
import type { RdLocaleConfig } from '../locale/types'
import type {DensityPreference} from '../theme';
import type {RdComponentDefaults} from './componentDefaults';
import type { RdGapSize } from './gap'
import type { RdAppendTo } from './overlay'
import type {RdInputVariant, RdSizeInput} from './types';
import {
  
  
  computed,
  
  inject,
  
  
  
  provide,
  toValue
} from 'vue'
import { rdComponents } from '../component-registry'
import { zhCN } from '../locale/zh-CN'
import { applyDensity  } from '../theme'
import {
  getComponentDefault,
  getComponentDefaults,
  mergeComponentDefaults
  
} from './componentDefaults'
import { setRdOverlayAppContext } from './overlayHost'
import { resolveSizeClass   } from './types'

export type { RdComponentDefaultMap, RdComponentDefaults, RdShowPasswordOn, RdTextareaAutosize } from './componentDefaults'
export { getComponentDefault, getComponentDefaults, mergeComponentDefaults } from './componentDefaults'

export type RdDensity = DensityPreference
export type { RdLocaleConfig }

export type ThemePreference = 'light' | 'dark' | 'system'

/** Application-level default configuration. */
export interface RdGlobalConfig {
  /** Color theme. `system` follows `prefers-color-scheme`. */
  theme?: ThemePreference
  /** Default Teleport target for overlays. Defaults to `'body'`. */
  appendTo?: RdAppendTo
  /** Default control size for form components that support `size`. */
  size?: RdSizeInput
  /** Default input surface style. */
  inputVariant?: RdInputVariant
  /** Starting z-index budget for overlays (modal / menu / tooltip layers). */
  zIndex?: number
  /**
   * Global content density. Scales spacing + control heights via `data-rd-density`.
   * Local ConfigProvider scopes to its subtree; plugin applies on `documentElement`.
   */
  density?: RdDensity
  /** Shared UI copy. Pass `zhCN` / `enUS` or a partial override. Default is Chinese. */
  locale?: RdLocaleConfig
  /**
   * Per-component default props. Local component props win.
   * Keys: unprefixed names (`Input`, `Space`) or `Rd*` aliases.
   */
  componentDefaults?: RdComponentDefaults
}

/**
 * Options for `app.use(RoostDesign, options)` / `createRoostDesign(options)`.
 *
 * By default every public component is registered globally.
 * Pass `components: false` to only install config, or pass a list for partial registration.
 */
export interface RdInstallerOptions extends RdGlobalConfig {
  /**
   * Components to register globally.
   * - omit / `undefined`: register all
   * - `false` / `[]`: register none (config only)
   * - `Component[]`: register the given components (matched by registry name)
   */
  components?: Component[] | false
}

export const RD_CONFIG_KEY: InjectionKey<MaybeRefOrGetter<RdGlobalConfig>> = Symbol('rdConfig')

const defaultConfig: Required<Pick<RdGlobalConfig, 'appendTo' | 'zIndex' | 'density'>> & RdGlobalConfig = {
  appendTo: 'body',
  zIndex: 1000,
  density: 'comfortable',
  inputVariant: 'outlined',
  locale: { ...zhCN },
}

export function getDefaultRdConfig(): RdGlobalConfig {
  return {
    appendTo: defaultConfig.appendTo,
    zIndex: defaultConfig.zIndex,
    density: defaultConfig.density,
    inputVariant: defaultConfig.inputVariant,
    locale: { ...defaultConfig.locale },
  }
}

export function provideRdConfig(config: MaybeRefOrGetter<RdGlobalConfig>) {
  provide(RD_CONFIG_KEY, config)
}

/** Merge nested / plugin config. Child keys win; `locale` and `componentDefaults` merge. */
export function mergeRdConfig(parent: RdGlobalConfig, child: RdGlobalConfig): RdGlobalConfig {
  return {
    ...parent,
    ...child,
    locale:
      parent.locale || child.locale ? { ...parent.locale, ...child.locale } : undefined,
    componentDefaults: mergeComponentDefaults(parent.componentDefaults, child.componentDefaults),
  }
}

export function useRdConfig() {
  const injected = inject(RD_CONFIG_KEY, null)
  return computed<RdGlobalConfig>(() => {
    const value = injected ? toValue(injected) : {}
    return {
      ...getDefaultRdConfig(),
      ...value,
      locale: {
        ...getDefaultRdConfig().locale,
        ...value.locale,
      },
    }
  })
}

/** @deprecated Use `useRdConfig` */
export const useWdConfig = useRdConfig

export function useComponentDefaults(name: string): ComputedRef<Record<string, unknown>> {
  const config = useRdConfig()
  return computed(() => getComponentDefaults(config.value.componentDefaults, name))
}

/** Control size: local prop > componentDefaults[name].size > global size > medium. */
export function useConfiguredSize(
  componentName: string,
  localSize: MaybeRefOrGetter<RdSizeInput | undefined>,
) {
  const config = useRdConfig()
  return computed(() =>
    resolveSizeClass(
      toValue(localSize)
        ?? getComponentDefault<RdSizeInput>(config.value.componentDefaults, componentName, 'size')
        ?? config.value.size,
    ),
  )
}

/** Input surface: local prop > componentDefaults[name].variant > global inputVariant > outlined. */
export function useConfiguredVariant(
  componentName: string,
  localVariant: MaybeRefOrGetter<RdInputVariant | undefined>,
) {
  const config = useRdConfig()
  return computed(
    () =>
      toValue(localVariant)
      ?? getComponentDefault<RdInputVariant>(config.value.componentDefaults, componentName, 'variant')
      ?? config.value.inputVariant
      ?? 'outlined',
  )
}

/** Space / Flex gap: local prop > componentDefaults[name].size > medium. Does not use global control size. */
export function useConfiguredGapSize(
  componentName: 'Space' | 'Flex',
  localSize: MaybeRefOrGetter<RdGapSize | undefined>,
) {
  const config = useRdConfig()
  return computed(
    () =>
      toValue(localSize)
      ?? getComponentDefault<RdGapSize>(config.value.componentDefaults, componentName, 'size')
      ?? 'medium',
  )
}

/** Resolve overlay mount target: local props > ConfigProvider > body. */
export function resolveConfiguredAppendTo(
  local: RdAppendTo | undefined,
  configAppendTo: RdAppendTo | undefined,
): RdAppendTo {
  if (local !== undefined) return local
  if (configAppendTo !== undefined) return configAppendTo
  return 'body'
}

function resolveComponentsToRegister(components: RdInstallerOptions['components']): Array<[string, Component]> {
  if (components === false) return []
  if (Array.isArray(components)) {
    if (components.length === 0) return []
    const selected = new Set(components)
    return Object.entries(rdComponents).filter(([, component]) => selected.has(component))
  }
  return Object.entries(rdComponents)
}

function applyInstallerConfig(app: App, options: RdInstallerOptions) {
  const { components: _components, ...config } = options
  app.provide(RD_CONFIG_KEY, config)
  app.config.globalProperties.$rd = config
  setRdOverlayAppContext(app._context)
  if (typeof document !== 'undefined') {
    if (config.density) applyDensity(config.density)
    if (config.zIndex != null) {
      document.documentElement.style.setProperty('--rd-z-base', String(config.zIndex))
    }
  }
}

function registerComponents(app: App, components: RdInstallerOptions['components']) {
  for (const [name, component] of resolveComponentsToRegister(components)) {
    app.component(name, component)
  }
}

/** Shared install used by `createRoostDesign` and the default plugin. */
export function installRoostDesign(app: App, options: RdInstallerOptions = {}) {
  applyInstallerConfig(app, options)
  registerComponents(app, options.components)
}

/**
 * Vue plugin entry: global defaults + full component registration.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createRoostDesign } from '@roost-design/ui'
 * import '@roost-design/ui/styles.css'
 *
 * createApp(App).use(createRoostDesign({ size: 'small', density: 'compact' })).mount('#app')
 * // templates can use <RdButton> without importing
 * ```
 *
 * Config only (no global components):
 * ```ts
 * createRoostDesign({ size: 'small', components: false })
 * ```
 */
export function createRoostDesign(options: RdInstallerOptions = {}): Plugin {
  return {
    install(app: App) {
      installRoostDesign(app, options)
    },
  }
}

/**
 * Default plugin:
 * `app.use(RoostDesign)` or `app.use(RoostDesign, { size: 'small' })`.
 */
export const RoostDesign: Plugin = {
  install(app: App, options: RdInstallerOptions = {}) {
    installRoostDesign(app, options)
  },
}

/** @deprecated Use `createRoostDesign` */
export const createWexDesign = createRoostDesign
/** @deprecated Use `installRoostDesign` */
export const installWexDesign = installRoostDesign
/** @deprecated Use `RoostDesign` */
export const WexDesign = RoostDesign

/** @deprecated Use `getDefaultRdConfig` */
export const getDefaultWdConfig = getDefaultRdConfig
/** @deprecated Use `mergeRdConfig` */
export const mergeWdConfig = mergeRdConfig
/** @deprecated Use `provideRdConfig` */
export const provideWdConfig = provideRdConfig
/** @deprecated Use `RD_CONFIG_KEY` */
export const WD_CONFIG_KEY = RD_CONFIG_KEY

declare module 'vue' {
  interface ComponentCustomProperties {
    $rd?: RdGlobalConfig
    /** @deprecated Use `$rd` */
    $wd?: RdGlobalConfig
  }
}
