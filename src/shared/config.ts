import type {App, Component, ComputedRef, InjectionKey, MaybeRefOrGetter, Plugin} from 'vue';
import type { MLocaleConfig } from '../locale/types'
import type {DensityPreference} from '../theme';
import type {MComponentDefaults} from './componentDefaults';
import type { MGapSize } from './gap'
import type { MAppendTo } from './overlay'
import type {MInputVariant, MSizeInput} from './types';
import {
  
  
  computed,
  
  inject,
  
  
  
  provide,
  toValue
} from 'vue'
import { mComponents } from '../component-registry'
import { zhCN } from '../locale/zh-CN'
import { applyDensity, applyReducedMotionPolicy } from '../theme'
import {
  getComponentDefault,
  getComponentDefaults,
  mergeComponentDefaults
  
} from './componentDefaults'
import { setMOverlayAppContext } from './overlayHost'
import { resolveSizeClass   } from './types'

export type { MComponentDefaultMap, MComponentDefaults, MShowPasswordOn, MTextareaAutosize } from './componentDefaults'
export { getComponentDefault, getComponentDefaults, mergeComponentDefaults } from './componentDefaults'

export type MDensity = DensityPreference
export type { MLocaleConfig }

export type ThemePreference = 'light' | 'dark' | 'system'

/** Application-level default configuration. */
export interface MGlobalConfig {
  /** Color theme. `system` follows `prefers-color-scheme`. */
  theme?: ThemePreference
  /** Default Teleport target for overlays. Defaults to `'body'`. */
  appendTo?: MAppendTo
  /** Default control size for form components that support `size`. */
  size?: MSizeInput
  /** Default input surface style. */
  inputVariant?: MInputVariant
  /** Starting z-index budget for overlays (modal / menu / tooltip layers). */
  zIndex?: number
  /**
   * Global content density. Scales spacing + control heights via `data-m-density`.
   * Local ConfigProvider scopes to its subtree; plugin applies on `documentElement`.
   */
  density?: MDensity
  /**
   * When true (default), honor `prefers-reduced-motion` and soften/disable motion.
   * Set to `false` to keep component transitions regardless of OS preference.
   */
  respectReducedMotion?: boolean
  /** Shared UI copy. Pass `zhCN` / `enUS` or a partial override. Default is Chinese. */
  locale?: MLocaleConfig
  /**
   * Per-component default props. Local component props win.
   * Keys: unprefixed names (`Input`, `Space`) or `M*` aliases.
   */
  componentDefaults?: MComponentDefaults
}

/**
 * Options for `app.use(MoryaUI, options)` / `createMoryaUI(options)`.
 *
 * By default every public component is registered globally.
 * Pass `components: false` to only install config, or pass a list for partial registration.
 */
export interface MInstallerOptions extends MGlobalConfig {
  /**
   * Components to register globally.
   * - omit / `undefined`: register all
   * - `false` / `[]`: register none (config only)
   * - `Component[]`: register the given components (matched by registry name)
   */
  components?: Component[] | false
}

export const M_CONFIG_KEY: InjectionKey<MaybeRefOrGetter<MGlobalConfig>> = Symbol('muConfig')

const defaultConfig: Required<Pick<MGlobalConfig, 'appendTo' | 'zIndex' | 'density'>> & MGlobalConfig = {
  appendTo: 'body',
  zIndex: 1000,
  density: 'comfortable',
  inputVariant: 'outlined',
  locale: { ...zhCN },
}

export function getDefaultMConfig(): MGlobalConfig {
  return {
    appendTo: defaultConfig.appendTo,
    zIndex: defaultConfig.zIndex,
    density: defaultConfig.density,
    inputVariant: defaultConfig.inputVariant,
    locale: { ...defaultConfig.locale },
  }
}

export function provideMConfig(config: MaybeRefOrGetter<MGlobalConfig>) {
  provide(M_CONFIG_KEY, config)
}

/** Merge nested / plugin config. Child keys win; `locale` and `componentDefaults` merge. */
export function mergeMConfig(parent: MGlobalConfig, child: MGlobalConfig): MGlobalConfig {
  return {
    ...parent,
    ...child,
    locale:
      parent.locale || child.locale ? { ...parent.locale, ...child.locale } : undefined,
    componentDefaults: mergeComponentDefaults(parent.componentDefaults, child.componentDefaults),
  }
}

export function useMConfig() {
  const injected = inject(M_CONFIG_KEY, null)
  return computed<MGlobalConfig>(() => {
    const value = injected ? toValue(injected) : {}
    return {
      ...getDefaultMConfig(),
      ...value,
      locale: {
        ...getDefaultMConfig().locale,
        ...value.locale,
      },
    }
  })
}

export function useComponentDefaults(name: string): ComputedRef<Record<string, unknown>> {
  const config = useMConfig()
  return computed(() => getComponentDefaults(config.value.componentDefaults, name))
}

/** Control size: local prop > componentDefaults[name].size > global size > medium. */
export function useConfiguredSize(
  componentName: string,
  localSize: MaybeRefOrGetter<MSizeInput | undefined>,
) {
  const config = useMConfig()
  return computed(() =>
    resolveSizeClass(
      toValue(localSize)
        ?? getComponentDefault<MSizeInput>(config.value.componentDefaults, componentName, 'size')
        ?? config.value.size,
    ),
  )
}

/** Input surface: local prop > componentDefaults[name].variant > global inputVariant > outlined. */
export function useConfiguredVariant(
  componentName: string,
  localVariant: MaybeRefOrGetter<MInputVariant | undefined>,
) {
  const config = useMConfig()
  return computed(
    () =>
      toValue(localVariant)
      ?? getComponentDefault<MInputVariant>(config.value.componentDefaults, componentName, 'variant')
      ?? config.value.inputVariant
      ?? 'outlined',
  )
}

/** Space / Flex gap: local prop > componentDefaults[name].size > medium. Does not use global control size. */
export function useConfiguredGapSize(
  componentName: 'Space' | 'Flex',
  localSize: MaybeRefOrGetter<MGapSize | undefined>,
) {
  const config = useMConfig()
  return computed(
    () =>
      toValue(localSize)
      ?? getComponentDefault<MGapSize>(config.value.componentDefaults, componentName, 'size')
      ?? 'medium',
  )
}

/** Resolve overlay mount target: local props > ConfigProvider > body. */
export function resolveConfiguredAppendTo(
  local: MAppendTo | undefined,
  configAppendTo: MAppendTo | undefined,
): MAppendTo {
  if (local !== undefined) return local
  if (configAppendTo !== undefined) return configAppendTo
  return 'body'
}

function resolveComponentsToRegister(components: MInstallerOptions['components']): Array<[string, Component]> {
  if (components === false) return []
  if (Array.isArray(components)) {
    if (components.length === 0) return []
    const selected = new Set(components)
    return Object.entries(mComponents).filter(([, component]) => selected.has(component))
  }
  return Object.entries(mComponents)
}

function applyInstallerConfig(app: App, options: MInstallerOptions) {
  const { components: _components, ...config } = options
  app.provide(M_CONFIG_KEY, config)
  app.config.globalProperties.$m = config
  setMOverlayAppContext(app._context)
  if (typeof document !== 'undefined') {
    if (config.density) applyDensity(config.density)
    applyReducedMotionPolicy(config.respectReducedMotion)
    if (config.zIndex != null) {
      document.documentElement.style.setProperty('--m-z-base', String(config.zIndex))
    }
  }
}

function registerComponents(app: App, components: MInstallerOptions['components']) {
  for (const [name, component] of resolveComponentsToRegister(components)) {
    app.component(name, component)
  }
}

/** Shared install used by `createMoryaUI` and the default plugin. */
export function installMoryaUI(app: App, options: MInstallerOptions = {}) {
  applyInstallerConfig(app, options)
  registerComponents(app, options.components)
}

/**
 * Vue plugin entry: global defaults + full component registration.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createMoryaUI } from 'morya-ui'
 * import 'morya-ui/styles.css'
 *
 * createApp(App).use(createMoryaUI({ size: 'small', density: 'compact' })).mount('#app')
 * // templates can use <MButton> without importing
 * ```
 *
 * Config only (no global components):
 * ```ts
 * createMoryaUI({ size: 'small', components: false })
 * ```
 */
export function createMoryaUI(options: MInstallerOptions = {}): Plugin {
  return {
    install(app: App) {
      installMoryaUI(app, options)
    },
  }
}

/**
 * Default plugin:
 * `app.use(MoryaUI)` or `app.use(MoryaUI, { size: 'small' })`.
 */
export const MoryaUI: Plugin = {
  install(app: App, options: MInstallerOptions = {}) {
    installMoryaUI(app, options)
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $m?: MGlobalConfig
  }
}
