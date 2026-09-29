<script setup lang="ts">
import type { DescriptionsProps } from './types'
import { computed, provide, toRef, useAttrs, useSlots } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { useRootParts } from '../../shared/useComponentAttrs'
import { DESCRIPTIONS_KEY } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DescriptionsProps>(), {
  bordered: false,
  column: 3,
  layout: 'horizontal',
  colon: true,
})

const attrs = useAttrs()
const slots = useSlots()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const sizeClass = useConfiguredSize('Descriptions', () => props.size)

const column = computed(() => Math.max(1, Math.floor(props.column) || 3))

provide(DESCRIPTIONS_KEY, {
  bordered: toRef(props, 'bordered'),
  layout: toRef(props, 'layout'),
  sizeClass,
  colon: toRef(props, 'colon'),
  column,
})

const showHeader = computed(() => Boolean(slots.title || props.title || slots.extra))

const rootClass = computed(() => [
  'm-descriptions',
  `m-descriptions--${sizeClass.value}`,
  `m-descriptions--${props.layout}`,
  {
    'm-descriptions--bordered': props.bordered,
  },
])

const viewStyle = computed(() => ({
  '--m-descriptions-cols': String(column.value),
}))
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <div
      v-if="showHeader"
      class="m-descriptions__header"
    >
      <div
        v-if="slots.title || title"
        class="m-descriptions__title"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div
        v-if="slots.extra"
        class="m-descriptions__extra"
      >
        <slot name="extra" />
      </div>
    </div>
    <div
      class="m-descriptions__view"
      :style="viewStyle"
    >
      <slot />
    </div>
  </div>
</template>
