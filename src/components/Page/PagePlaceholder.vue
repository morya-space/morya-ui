<script setup lang="ts">
import type { PagePlaceholderProps } from './types'
import { computed, useAttrs } from 'vue'
import { toCssLength } from '../../shared/responsive'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ name: 'MPagePlaceholder', inheritAttrs: false })

const props = withDefaults(defineProps<PagePlaceholderProps>(), {
  description: '',
  ariaLabel: 'Placeholder',
  minHeight: '12rem',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootStyle = computed(() => ({
  '--m-page-placeholder-min-height': toCssLength(props.minHeight),
}))
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="m-page-placeholder"
    role="img"
    :aria-label="ariaLabel"
    :style="rootStyle"
  >
    <slot>{{ description }}</slot>
  </div>
</template>
