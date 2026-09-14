<script setup lang="ts">
import MCard from '../Card/Card.vue'
import MIcon from '../Icon/Icon.vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import type { PageStatProps } from './types'
import { computed, useAttrs } from 'vue'

defineOptions({ name: 'MPageStat', inheritAttrs: false })

const props = withDefaults(defineProps<PageStatProps>(), {
  trendSeverity: 'primary',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const trendClass = computed(() => [
  'm-page-stat__trend',
  `m-page-stat__trend--${props.trendSeverity}`,
])
</script>

<template>
  <MCard v-bind="rootAttrs" class="m-page-stat" :aria-label="label">
    <div class="m-page-stat__body">
      <div>
        <p v-if="label" class="m-page-stat__label">{{ label }}</p>
        <p v-if="value != null && value !== ''" class="m-page-stat__value">{{ value }}</p>
        <p v-if="trend" :class="trendClass">{{ trend }}</p>
        <slot />
      </div>
      <MIcon
        v-if="icon"
        :name="icon"
        size="lg"
        class="m-page-stat__icon"
        aria-hidden="true"
      />
    </div>
  </MCard>
</template>
