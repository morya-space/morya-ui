<script setup lang="ts">
import type { MSizeInput } from '../../shared/types'
import type { LoadingEffect } from './types'
import { computed, ref } from 'vue'
import { useMLocale } from '../../locale'
import { useComponentDefaults } from '../../shared/config'
import { resolveSizeClass } from '../../shared/types'
import { usePauseOffscreen } from '../../shared/usePauseOffscreen'
import { normalizeLoadingEffect } from './types'

defineOptions({ name: 'MLoadingIndicator' })

const props = defineProps<{
  effect?: LoadingEffect
  text?: string
  ariaLabel?: string
  size?: MSizeInput
}>()

const locale = useMLocale()
const rootRef = ref<HTMLElement | null>(null)
const { pauseAttrs } = usePauseOffscreen(rootRef, true)
const defaults = useComponentDefaults('Loading')
const effect = computed(() => normalizeLoadingEffect(props.effect ?? defaults.value.effect))
const size = computed(() => props.size ?? (defaults.value.size as MSizeInput | undefined))
const sizeClass = computed(() => {
  const tone = resolveSizeClass(size.value)
  return {
    'm-loading-indicator--small': tone === 'small',
    'm-loading-indicator--large': tone === 'large',
  }
})
const accessibleName = computed(() => props.ariaLabel ?? (props.text ? undefined : locale.value.loading))
</script>

<template>
  <div
    ref="rootRef"
    v-bind="pauseAttrs"
    class="m-loading-indicator"
    :class="sizeClass"
    role="status"
    aria-live="polite"
    :aria-label="accessibleName"
  >
    <div class="m-loading-indicator__graphic" aria-hidden="true">
      <div v-if="effect === 'aurora'" class="m-loading-aurora">
        <div class="m-loading-aurora__ring" />
        <div class="m-loading-aurora__glow" />
      </div>

      <div v-else-if="effect === 'bounce'" class="m-loading-bounce">
        <span class="m-loading-bounce__ball" />
        <span class="m-loading-bounce__ball" />
        <span class="m-loading-bounce__ball" />
      </div>

      <div v-else-if="effect === 'wave'" class="m-loading-wave">
        <span class="m-loading-wave__bar" />
        <span class="m-loading-wave__bar" />
        <span class="m-loading-wave__bar" />
        <span class="m-loading-wave__bar" />
        <span class="m-loading-wave__bar" />
      </div>

      <div v-else-if="effect === 'pulse'" class="m-loading-pulse">
        <span class="m-loading-pulse__ring" />
        <span class="m-loading-pulse__ring" />
        <span class="m-loading-pulse__ring" />
        <span class="m-loading-pulse__ring" />
      </div>

      <div v-else-if="effect === 'stardust'" class="m-loading-stardust">
        <span
          v-for="i in 8"
          :key="i"
          class="m-loading-stardust__dot"
          :style="{ '--i': String(i - 1) }"
        />
      </div>

      <div v-else class="m-loading-circular">
        <svg class="m-loading-circular__svg" viewBox="0 0 50 50">
          <circle class="m-loading-circular__path" cx="25" cy="25" r="20" fill="none" />
        </svg>
      </div>
    </div>

    <p v-if="text" class="m-loading-indicator__tip">
      {{ text }}
    </p>
  </div>
</template>
