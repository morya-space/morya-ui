<script setup lang="ts">
import type { PagePlaceholderProps } from './types'
import { computed, useAttrs, useSlots } from 'vue'
import { toCssLength } from '../../shared/responsive'
import { useRootParts } from '../../shared/useComponentAttrs'
import MEmpty from '../Empty/Empty.vue'

defineOptions({ name: 'MPagePlaceholder', inheritAttrs: false })

const props = withDefaults(defineProps<PagePlaceholderProps>(), {
  description: '',
  ariaLabel: 'Placeholder',
  minHeight: '12rem',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const slots = useSlots()

const rootStyle = computed(() => ({
  '--m-page-placeholder-min-height': toCssLength(props.minHeight),
}))
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="m-page-placeholder"
    :style="rootStyle"
  >
    <MEmpty
      class="m-page-placeholder__empty"
      :description="description"
      :aria-label="ariaLabel"
    >
      <template v-if="slots.default" #default>
        <slot />
      </template>
      <template v-if="slots.icon" #icon>
        <slot name="icon" />
      </template>
      <template v-if="slots.extra" #extra>
        <slot name="extra" />
      </template>
    </MEmpty>
  </div>
</template>
