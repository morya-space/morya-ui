<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { ProgressSpinnerProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, onBeforeUnmount, ref, useAttrs, useSlots, watch } from 'vue'
import { useMLocale } from '../../locale'
import { resolveSizeClass } from '../../shared/types'

const props = withDefaults(defineProps<ProgressSpinnerProps>(), {
  strokeWidth: '2',
  animationDuration: '1s',
  show: true,
  delay: 0,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const slots = useSlots()
const locale = useMLocale()
const label = computed(() => props.ariaLabel ?? locale.value.loading)
const wrapping = computed(() => Boolean(slots.default))
const sizeTone = computed(() => resolveSizeClass(props.size))
const visible = ref(props.show && props.delay <= 0)
let delayTimer: ReturnType<typeof setTimeout> | null = null

function clearDelay() {
  if (delayTimer !== null) {
    clearTimeout(delayTimer)
    delayTimer = null
  }
}

watch(
  () => [props.show, props.delay, wrapping.value] as const,
  ([show, delay]) => {
    clearDelay()
    if (!show) {
      visible.value = false
      return
    }
    if (!delay) {
      visible.value = true
      return
    }
    visible.value = false
    delayTimer = setTimeout(() => {
      visible.value = true
      delayTimer = null
    }, delay)
  },
  { immediate: true },
)

onBeforeUnmount(clearDelay)

const spinnerStyle = computed(() => ({
  animationDuration: props.animationDuration,
}))

const sizeClass = computed(() => ({
  'm-progress-spinner--small': sizeTone.value === 'small',
  'm-progress-spinner--large': sizeTone.value === 'large',
}))
</script>

<template>
  <div v-bind="rootAttrs" v-if="wrapping" class="m-progress-spinner-wrap" :class="{ 'm-progress-spinner-wrap--active': visible }" :aria-busy="visible || undefined">
    <div class="m-progress-spinner-wrap__content" :inert="visible || undefined">
      <slot />
    </div>
    <div v-if="visible" class="m-progress-spinner-wrap__overlay">
      <svg
        class="m-progress-spinner"
        :class="sizeClass"
        viewBox="0 0 50 50"
        role="status"
        :aria-label="label"
        :style="spinnerStyle"
      >
        <circle
          class="m-progress-spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          :stroke-width="strokeWidth"
        />
      </svg>
      <p v-if="description" class="m-progress-spinner__description">
        {{ description }}
      </p>
    </div>
  </div>
  <svg
    v-else
    v-bind="rootAttrs"
    class="m-progress-spinner"
    :class="sizeClass"
    viewBox="0 0 50 50"
    role="status"
    :aria-label="label"
    :style="spinnerStyle"
  >
    <circle
      class="m-progress-spinner__circle"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>
