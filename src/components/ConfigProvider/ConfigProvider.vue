<script setup lang="ts">
import type { MGlobalConfig } from '../../shared/config'
import { applyTheme, getPreferredTheme } from '../../theme'
import { computed, inject, onBeforeUnmount, toValue, watch } from 'vue'
import {
  mergeMConfig,
  provideMConfig,
  M_CONFIG_KEY,
} from '../../shared/config'
import { applyDensity, applyReducedMotionPolicy } from '../../theme'

const props = defineProps<{
  /** Global defaults for descendant Morya UI components. */
  config?: MGlobalConfig
  /** Shorthand: default overlay Teleport target. */
  appendTo?: MGlobalConfig['appendTo']
  /** Shorthand: default control size. */
  size?: MGlobalConfig['size']
  /** Shorthand: default input variant. */
  inputVariant?: MGlobalConfig['inputVariant']
  /** Shorthand: overlay z-index base. */
  zIndex?: MGlobalConfig['zIndex']
  /** Shorthand: content density. */
  density?: MGlobalConfig['density']
  /** Shorthand: color theme (`light` / `dark` / `system`). */
  theme?: MGlobalConfig['theme']
  /** Shorthand: locale dictionary. */
  locale?: MGlobalConfig['locale']
  /** Shorthand: per-component default props. */
  componentDefaults?: MGlobalConfig['componentDefaults']
  /**
   * When true (default), honor `prefers-reduced-motion`.
   * Set false to keep transitions when the OS requests reduced motion.
   */
  respectReducedMotion?: MGlobalConfig['respectReducedMotion']
  /**
   * When true (default), also write density / theme to `documentElement`
   * so the whole page picks up token changes. Set false to scope
   * side effects to this wrapper only.
   */
  globalDensity?: boolean
}>()

const parent = inject(M_CONFIG_KEY, null)

const local = computed<MGlobalConfig>(() => ({
  ...(props.config ?? {}),
  ...(props.appendTo !== undefined ? { appendTo: props.appendTo } : {}),
  ...(props.size !== undefined ? { size: props.size } : {}),
  ...(props.inputVariant !== undefined ? { inputVariant: props.inputVariant } : {}),
  ...(props.zIndex !== undefined ? { zIndex: props.zIndex } : {}),
  ...(props.density !== undefined ? { density: props.density } : {}),
  ...(props.theme !== undefined ? { theme: props.theme } : {}),
  ...(props.locale !== undefined ? { locale: props.locale } : {}),
  ...(props.componentDefaults !== undefined ? { componentDefaults: props.componentDefaults } : {}),
  ...(props.respectReducedMotion !== undefined
    ? { respectReducedMotion: props.respectReducedMotion }
    : {}),
}))

const resolved = computed<MGlobalConfig>(() => {
  const parentValue = parent ? toValue(parent) : {}
  return mergeMConfig(parentValue, local.value)
})

provideMConfig(resolved)

const densityAttr = computed(() => resolved.value.density ?? 'comfortable')
const applyGlobal = computed(() => props.globalDensity !== false)

const layerStyle = computed(() => {
  const base = resolved.value.zIndex
  if (base == null) return undefined
  return { '--m-z-base': String(base) } as Record<string, string>
})

let previousDensity: string | undefined
let previousZBase: string | undefined
let previousTheme: string | undefined
let previousIgnoreReducedMotion: string | undefined
let systemMedia: MediaQueryList | null = null

function onSystemThemeChange() {
  if (resolved.value.theme === 'system') applyTheme(getPreferredTheme())
}

function syncReducedMotionPolicy() {
  if (typeof document === 'undefined') return
  previousIgnoreReducedMotion = document.documentElement.dataset.muIgnoreReducedMotion
  applyReducedMotionPolicy(resolved.value.respectReducedMotion)
}

function syncGlobalSideEffects() {
  if (!applyGlobal.value || typeof document === 'undefined') return
  const { density, zIndex, theme } = resolved.value
  if (density) {
    previousDensity = document.documentElement.dataset.muDensity
    applyDensity(density)
  }
  if (zIndex != null) {
    previousZBase = document.documentElement.style.getPropertyValue('--m-z-base')
    document.documentElement.style.setProperty('--m-z-base', String(zIndex))
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

watch(() => resolved.value.respectReducedMotion, syncReducedMotionPolicy, { immediate: true })

watch(
  () =>
    [
      applyGlobal.value,
      resolved.value.density,
      resolved.value.zIndex,
      resolved.value.theme,
    ] as const,
  syncGlobalSideEffects,
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  if (previousIgnoreReducedMotion !== undefined) {
    if (previousIgnoreReducedMotion) {
      document.documentElement.dataset.muIgnoreReducedMotion = previousIgnoreReducedMotion
    } else {
      delete document.documentElement.dataset.muIgnoreReducedMotion
    }
  }
  if (!applyGlobal.value) return
  if (previousDensity !== undefined) {
    if (previousDensity) document.documentElement.dataset.muDensity = previousDensity
    else delete document.documentElement.dataset.muDensity
  }
  if (previousZBase !== undefined) {
    if (previousZBase) document.documentElement.style.setProperty('--m-z-base', previousZBase)
    else document.documentElement.style.removeProperty('--m-z-base')
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
  <div class="m-config-provider" :data-m-density="densityAttr" :style="layerStyle">
    <slot />
  </div>
</template>
