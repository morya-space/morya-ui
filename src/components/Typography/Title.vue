<script setup lang="ts">
import type { TitleProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { typographyDecorationClass } from './decoration'
import MTypographyContent from './TypographyContent.vue'

defineOptions({ inheritAttrs: false, name: 'MTitle' })

const props = withDefaults(defineProps<TitleProps>(), {
  level: 1,
  code: false,
  delete: false,
  mark: false,
  underline: false,
  strong: false,
  italic: false,
  ellipsis: false,
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const tag = computed(() => `h${props.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5')

const rootClass = computed(() => [
  'm-typography',
  'm-typography-title',
  `m-typography-title--h${props.level}`,
  typographyDecorationClass(props),
])
</script>

<template>
  <component
    :is="tag"
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <MTypographyContent :decorations="props">
      <slot />
    </MTypographyContent>
  </component>
</template>
