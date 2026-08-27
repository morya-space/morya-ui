<script setup lang="ts">
import type {WiGlobalConfig} from '../../shared/config';
import { computed, inject, toValue, watchEffect } from 'vue'
import {
  mergeWiConfig,
  provideWiConfig,
  WI_CONFIG_KEY
  
} from '../../shared/config'
import { applyDensity } from '../../theme'

const props = defineProps<{
  /** Global defaults for descendant Well Insight components. */
  config?: WiGlobalConfig
  /** Shorthand: default overlay Teleport target. */
  appendTo?: WiGlobalConfig['appendTo']
  /** Shorthand: default control size. */
  size?: WiGlobalConfig['size']
  /** Shorthand: default input variant. */
  inputVariant?: WiGlobalConfig['inputVariant']
  /** Shorthand: overlay z-index base. */
  zIndex?: WiGlobalConfig['zIndex']
  /** Shorthand: content density. */
  density?: WiGlobalConfig['density']
  /** Shorthand: locale dictionary. */
  locale?: WiGlobalConfig['locale']
  /** Shorthand: per-component default props. */
  componentDefaults?: WiGlobalConfig['componentDefaults']
  /**
   * When true (default), also write density to `documentElement`
   * so the whole page picks up token changes. Set false to scope
   * density CSS vars to this wrapper only.
   */
  globalDensity?: boolean
}>()

const parent = inject(WI_CONFIG_KEY, null)

const local = computed<WiGlobalConfig>(() => ({
  ...(props.config ?? {}),
  ...(props.appendTo !== undefined ? { appendTo: props.appendTo } : {}),
  ...(props.size !== undefined ? { size: props.size } : {}),
  ...(props.inputVariant !== undefined ? { inputVariant: props.inputVariant } : {}),
  ...(props.zIndex !== undefined ? { zIndex: props.zIndex } : {}),
  ...(props.density !== undefined ? { density: props.density } : {}),
  ...(props.locale !== undefined ? { locale: props.locale } : {}),
  ...(props.componentDefaults !== undefined ? { componentDefaults: props.componentDefaults } : {}),
}))

const resolved = computed<WiGlobalConfig>(() => {
  const parentValue = parent ? toValue(parent) : {}
  return mergeWiConfig(parentValue, local.value)
})

provideWiConfig(resolved)

const densityAttr = computed(() => resolved.value.density ?? 'comfortable')
const applyGlobal = computed(() => props.globalDensity !== false)

const layerStyle = computed(() => {
  const base = resolved.value.zIndex
  if (base == null) return undefined
  return { '--wi-z-base': String(base) } as Record<string, string>
})

watchEffect(() => {
  if (!applyGlobal.value || typeof document === 'undefined') return
  if (resolved.value.density) applyDensity(resolved.value.density)
  if (resolved.value.zIndex != null) {
    document.documentElement.style.setProperty('--wi-z-base', String(resolved.value.zIndex))
  }
})
</script>

<template>
  <div class="wi-config-provider" :data-wi-density="densityAttr" :style="layerStyle">
    <slot />
  </div>
</template>
