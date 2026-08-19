<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { applyDensity } from '../../theme'
import { provideWdConfig, type WdGlobalConfig } from '../../shared/config'

const props = defineProps<{
  /** Global defaults for descendant Well Insight components. */
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
  /** Shorthand: locale dictionary. */
  locale?: WdGlobalConfig['locale']
  /**
   * When true (default), also write density to `documentElement`
   * so the whole page picks up token changes. Set false to scope
   * density CSS vars to this wrapper only.
   */
  globalDensity?: boolean
}>()

const resolved = computed<WdGlobalConfig>(() => ({
  ...(props.config ?? {}),
  ...(props.appendTo !== undefined ? { appendTo: props.appendTo } : {}),
  ...(props.size !== undefined ? { size: props.size } : {}),
  ...(props.inputVariant !== undefined ? { inputVariant: props.inputVariant } : {}),
  ...(props.zIndex !== undefined ? { zIndex: props.zIndex } : {}),
  ...(props.density !== undefined ? { density: props.density } : {}),
  ...(props.locale !== undefined ? { locale: props.locale } : {}),
}))

provideWdConfig(resolved)

const densityAttr = computed(() => resolved.value.density ?? 'comfortable')
const applyGlobal = computed(() => props.globalDensity !== false)

const layerStyle = computed(() => {
  const base = resolved.value.zIndex
  if (base == null) return undefined
  return { '--wd-z-base': String(base) } as Record<string, string>
})

watchEffect(() => {
  if (!applyGlobal.value || typeof document === 'undefined') return
  if (resolved.value.density) applyDensity(resolved.value.density)
  if (resolved.value.zIndex != null) {
    document.documentElement.style.setProperty('--wd-z-base', String(resolved.value.zIndex))
  }
})
</script>

<template>
  <div class="wd-config-provider" :data-wd-density="densityAttr" :style="layerStyle">
    <slot />
  </div>
</template>
