<script setup lang="ts">
import type { StatisticProps } from './types'
import { computed, useAttrs, useSlots } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import MSkeleton from '../Skeleton/Skeleton.vue'
import { formatNumberValue } from './utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<StatisticProps>(), {
  value: 0,
  loading: false,
  decimalSeparator: '.',
  groupSeparator: ',',
})

const attrs = useAttrs()
const slots = useSlots()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const displayValue = computed(() => {
  if (props.formatter) return props.formatter(props.value ?? 0)
  return formatNumberValue(
    props.value ?? 0,
    props.precision,
    props.decimalSeparator,
    props.groupSeparator,
  )
})

const valueStyleComputed = computed(() => props.valueStyle)
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="m-statistic"
  >
    <div
      v-if="slots.title || title"
      class="m-statistic__title"
    >
      <slot name="title">
        {{ title }}
      </slot>
    </div>

    <div class="m-statistic__content">
      <MSkeleton
        v-if="loading"
        width="6rem"
        height="1.75rem"
      />
      <div
        v-else
        class="m-statistic__value-row"
        :style="valueStyleComputed"
      >
        <span
          v-if="slots.prefix || prefix"
          class="m-statistic__affix m-statistic__prefix"
        >
          <slot name="prefix">
            {{ prefix }}
          </slot>
        </span>
        <span class="m-statistic__value">
          <slot name="value">
            {{ displayValue }}
          </slot>
        </span>
        <span
          v-if="slots.suffix || suffix"
          class="m-statistic__affix m-statistic__suffix"
        >
          <slot name="suffix">
            {{ suffix }}
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>
