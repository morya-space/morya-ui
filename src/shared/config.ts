import { computed, inject, provide, type App, type InjectionKey, type MaybeRefOrGetter, toValue } from 'vue'
import { zhCN } from '../locale/zh-CN'
import type { WiLocaleConfig } from '../locale/types'
import { applyDensity, type DensityPreference } from '../theme'
import type { WiAppendTo } from './overlay'
import { setWiOverlayAppContext } from './overlayHost'
import type { WiInputVariant, WiSizeInput } from './types'

export type WiDensity = DensityPreference
export type { WiLocaleConfig }

/** Application-level default configuration. */
export interface WiGlobalConfig {
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

/** Resolve overlay mount target: local props > ConfigProvider > body. */
export function resolveConfiguredAppendTo(
  local: WiAppendTo | undefined,
  configAppendTo: WiAppendTo | undefined,
): WiAppendTo {
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
export function createWellInsight(options: WiGlobalConfig = {}) {
  return {
    install(app: App) {
      app.provide(WI_CONFIG_KEY, options)
      app.config.globalProperties.$wd = options
      setWiOverlayAppContext(app._context)
      if (typeof document !== 'undefined') {
        if (options.density) applyDensity(options.density)
        if (options.zIndex != null) {
          document.documentElement.style.setProperty('--wi-z-base', String(options.zIndex))
        }
      }
    },
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $wd?: WiGlobalConfig
  }
}
