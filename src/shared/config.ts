import { computed, inject, provide, type App, type InjectionKey, type MaybeRefOrGetter, toValue } from 'vue'
import { zhCN } from '../locale/zh-CN'
import type { WdLocaleConfig } from '../locale/types'
import { applyDensity, type DensityPreference } from '../theme'
import type { WdAppendTo } from './overlay'
import { setWdOverlayAppContext } from './overlayHost'
import type { WdInputVariant, WdSizeInput } from './types'

export type WdDensity = DensityPreference
export type { WdLocaleConfig }

/** Application-level default configuration. */
export interface WdGlobalConfig {
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

/** Resolve overlay mount target: local props > ConfigProvider > body. */
export function resolveConfiguredAppendTo(
  local: WdAppendTo | undefined,
  configAppendTo: WdAppendTo | undefined,
): WdAppendTo {
  if (local !== undefined) return local
  if (configAppendTo !== undefined) return configAppendTo
  return 'body'
}

/**
 * Vue plugin entry for global defaults.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createWellInsight } from '@well-insight/ui'
 *
 * createApp(App).use(createWellInsight({ appendTo: 'body', density: 'compact' })).mount('#app')
 * ```
 */
export function createWellInsight(options: WdGlobalConfig = {}) {
  return {
    install(app: App) {
      app.provide(WD_CONFIG_KEY, options)
      app.config.globalProperties.$wd = options
      setWdOverlayAppContext(app._context)
      if (typeof document !== 'undefined') {
        if (options.density) applyDensity(options.density)
        if (options.zIndex != null) {
          document.documentElement.style.setProperty('--wd-z-base', String(options.zIndex))
        }
      }
    },
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $wd?: WdGlobalConfig
  }
}
