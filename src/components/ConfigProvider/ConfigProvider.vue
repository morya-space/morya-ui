<script setup lang="ts">
import type { WkGlobalConfig } from '../../shared/config'
import { applyTheme, getPreferredTheme } from '../../theme'
import { computed, inject, onBeforeUnmount, toValue, watch } from 'vue'
import {
  mergeWkConfig,
  provideWkConfig,
  WK_CONFIG_KEY,
} from '../../shared/config'
import { applyDensity } from '../../theme'

const props = defineProps<{
  /** Global defaults for descendant Wise Kit components. */
  config?: WkGlobalConfig
  /** Shorthand: default overlay Teleport target. */
  appendTo?: WkGlobalConfig['appendTo']
  /** Shorthand: default control size. */
  size?: WkGlobalConfig['size']
  /** Shorthand: default input variant. */
  inputVariant?: WkGlobalConfig['inputVariant']
  /** Shorthand: overlay z-index base. */
  zIndex?: WkGlobalConfig['zIndex']
  /** Shorthand: content density. */
  density?: WkGlobalConfig['density']
  /** Shorthand: color theme (`light` / `dark` / `system`). */
  theme?: WkGlobalConfig['theme']
  /** Shorthand: locale dictionary. */
  locale?: WkGlobalConfig['locale']
  /** Shorthand: per-component default props. */
  componentDefaults?: WkGlobalConfig['componentDefaults']
  /**
   * When true (default), also write density / theme to `documentElement`
   * so the whole page picks up token changes. Set false to scope
   * side effects to this wrapper only.
   */
  globalDensity?: boolean
}>()

const parent = inject(WK_CONFIG_KEY, null)

const local = computed<WkGlobalConfig>(() => ({
  ...(props.config ?? {}),
  ...(props.appendTo !== undefined ? { appendTo: props.appendTo } : {}),
  ...(props.size !== undefined ? { size: props.size } : {}),
  ...(props.inputVariant !== undefined ? { inputVariant: props.inputVariant } : {}),
  ...(props.zIndex !== undefined ? { zIndex: props.zIndex } : {}),
  ...(props.density !== undefined ? { density: props.density } : {}),
  ...(props.theme !== undefined ? { theme: props.theme } : {}),
  ...(props.locale !== undefined ? { locale: props.locale } : {}),
  ...(props.componentDefaults !== undefined ? { componentDefaults: props.componentDefaults } : {}),
}))

const resolved = computed<WkGlobalConfig>(() => {
  const parentValue = parent ? toValue(parent) : {}
  return mergeWkConfig(parentValue, local.value)
})

provideWkConfig(resolved)

const densityAttr = computed(() => resolved.value.density ?? 'comfortable')
const applyGlobal = computed(() => props.globalDensity !== false)

const layerStyle = computed(() => {
  const base = resolved.value.zIndex
  if (base == null) return undefined
  return { '--wk-z-base': String(base) } as Record<string, string>
})

let previousDensity: string | undefined
let previousZBase: string | undefined
let previousTheme: string | undefined
let systemMedia: MediaQueryList | null = null

function onSystemThemeChange() {
  if (resolved.value.theme === 'system') applyTheme(getPreferredTheme())
}

function syncGlobalSideEffects() {
  if (!applyGlobal.value || typeof document === 'undefined') return
  const { density, zIndex, theme } = resolved.value
  if (density) {
    previousDensity = document.documentElement.dataset.wkDensity
    applyDensity(density)
  }
  if (zIndex != null) {
    previousZBase = document.documentElement.style.getPropertyValue('--wk-z-base')
    document.documentElement.style.setProperty('--wk-z-base', String(zIndex))
  }
  if (theme !== undefined) {
    previousTheme = document.documentElement.dataset.theme
    applyTheme(theme === 'system' ? getPreferredTheme() : theme)
  }
  if (theme === 'system' && typeof window !== 'undefined') {
    systemMedia?.removeEventListener('change', onSystemThemeChange)
    systemMedia = window.matchMedia('(prefers-color-scheme: dark)')
    systemMedia.addEventListener('change', onSystemThemeChange)
  }
}

watch(
  () => [applyGlobal.value, resolved.value.density, resolved.value.zIndex, resolved.value.theme] as const,
  syncGlobalSideEffects,
  { immediate: true },
)

onBeforeUnmount(() => {
  if (!applyGlobal.value || typeof document === 'undefined') return
  if (previousDensity !== undefined) {
    if (previousDensity) document.documentElement.dataset.wkDensity = previousDensity
    else delete document.documentElement.dataset.wkDensity
  }
  if (previousZBase !== undefined) {
    if (previousZBase) document.documentElement.style.setProperty('--wk-z-base', previousZBase)
    else document.documentElement.style.removeProperty('--wk-z-base')
  }
  if (previousTheme !== undefined) {
    if (previousTheme) document.documentElement.dataset.theme = previousTheme
    else delete document.documentElement.dataset.theme
  }
  systemMedia?.removeEventListener('change', onSystemThemeChange)
  systemMedia = null
})
</script>

<template>
  <div class="wk-config-provider" :data-wk-density="densityAttr" :style="layerStyle">
    <slot />
  </div>
</template>
