<script setup lang="ts">
import type { WdGlobalConfig } from '../../shared/config'
import { applyTheme, getPreferredTheme } from '../../theme'
import { computed, inject, onBeforeUnmount, toValue, watch } from 'vue'
import {
  mergeWdConfig,
  provideWdConfig,
  WD_CONFIG_KEY,
} from '../../shared/config'
import { applyDensity } from '../../theme'

const props = defineProps<{
  /** Global defaults for descendant Wex Design components. */
  config?: WdGlobalConfig
  /** Shorthand: default overlay Teleport target. */
  appendTo?: WdGlobalConfig['appendTo']
  /** Shorthand: default control size. */
  size?: WdGlobalConfig['size']
  /** Shorthand: default input variant. */
  inputVariant?: WdGlobalConfig['inputVariant']
  /** Shorthand: overlay z-index base. */
  zIndex?: WdGlobalConfig['zIndex']
  /** Shorthand: content density. */
  density?: WdGlobalConfig['density']
  /** Shorthand: color theme (`light` / `dark` / `system`). */
  theme?: WdGlobalConfig['theme']
  /** Shorthand: locale dictionary. */
  locale?: WdGlobalConfig['locale']
  /** Shorthand: per-component default props. */
  componentDefaults?: WdGlobalConfig['componentDefaults']
  /**
   * When true (default), also write density / theme to `documentElement`
   * so the whole page picks up token changes. Set false to scope
   * side effects to this wrapper only.
   */
  globalDensity?: boolean
}>()

const parent = inject(WD_CONFIG_KEY, null)

const local = computed<WdGlobalConfig>(() => ({
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

const resolved = computed<WdGlobalConfig>(() => {
  const parentValue = parent ? toValue(parent) : {}
  return mergeWdConfig(parentValue, local.value)
})

provideWdConfig(resolved)

const densityAttr = computed(() => resolved.value.density ?? 'comfortable')
const applyGlobal = computed(() => props.globalDensity !== false)

const layerStyle = computed(() => {
  const base = resolved.value.zIndex
  if (base == null) return undefined
  return { '--wd-z-base': String(base) } as Record<string, string>
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
    previousDensity = document.documentElement.dataset.wdDensity
    applyDensity(density)
  }
  if (zIndex != null) {
    previousZBase = document.documentElement.style.getPropertyValue('--wd-z-base')
    document.documentElement.style.setProperty('--wd-z-base', String(zIndex))
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
    if (previousDensity) document.documentElement.dataset.wdDensity = previousDensity
    else delete document.documentElement.dataset.wdDensity
  }
  if (previousZBase !== undefined) {
    if (previousZBase) document.documentElement.style.setProperty('--wd-z-base', previousZBase)
    else document.documentElement.style.removeProperty('--wd-z-base')
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
  <div class="wd-config-provider" :data-wd-density="densityAttr" :style="layerStyle">
    <slot />
  </div>
</template>
