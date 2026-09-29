<script setup lang="ts">
import type { TextProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { typographyDecorationClass } from './decoration'

defineOptions({ inheritAttrs: false, name: 'MText' })

const props = withDefaults(defineProps<TextProps>(), {
  code: false,
  delete: false,
  mark: false,
  underline: false,
  strong: false,
  italic: false,
  ellipsis: false,
  disabled: false,
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootClass = computed(() => [
  'm-typography',
  'm-typography-text',
  typographyDecorationClass(props),
])
</script>

<template>
  <span
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <slot />
  </span>
</template>
