<script setup lang="ts">
import type { MeterGroupProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<MeterGroupProps>(), {
  max: undefined,
})

const totalMax = computed(() => {
  if (props.max !== undefined) return props.max
  const sum = props.value.reduce((acc, item) => acc + item.value, 0)
  return sum > 0 ? sum : 1
})

const totalValue = computed(() => props.value.reduce((acc, item) => acc + item.value, 0))

const segments = computed(() =>
  props.value.map((item) => ({
    ...item,
    width: `${Math.max(0, (item.value / totalMax.value) * 100)}%`,
  })),
)
</script>

<template>
  <div class="wi-metergroup">
    <div class="wi-metergroup__meter" role="meter" :aria-valuemin="0" :aria-valuemax="totalMax" :aria-valuenow="totalValue">
      <div
        v-for="(segment, index) in segments"
        :key="`${segment.label}-${index}`"
        class="wi-metergroup__segment"
        :style="{ width: segment.width, background: segment.color }"
        :title="`${segment.label}: ${segment.value}`"
      />
    </div>
    <ul class="wi-metergroup__legend">
      <li v-for="(item, index) in value" :key="`${item.label}-${index}`" class="wi-metergroup__legend-item">
        <span class="wi-metergroup__swatch"
          :style="{ background: item.color ?? 'var(--wi-color-primary)' }"
          aria-hidden="true"
        />
        <slot name="label" :item="item" :index="index">
          <span>{{ item.label }}</span>
        </slot>
        <span class="wi-metergroup__value">{{ item.value }}</span>
      </li>
    </ul>
  </div>
</template>
