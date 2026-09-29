<script setup lang="ts">
import type { ParagraphProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { typographyDecorationClass } from './decoration'
import MTypographyContent from './TypographyContent.vue'

defineOptions({ inheritAttrs: false, name: 'MParagraph' })

const props = withDefaults(defineProps<ParagraphProps>(), {
  code: false,
  delete: false,
  mark: false,
  underline: false,
  strong: false,
  italic: false,
  ellipsis: false,
  disabled: false,
  spacing: true,
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootClass = computed(() => [
  'm-typography',
  'm-typography-paragraph',
  typographyDecorationClass(props),
  { 'm-typography-paragraph--spacing': props.spacing },
])
</script>

<template>
  <p
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <MTypographyContent :decorations="props" :disabled="props.disabled">
      <slot />
    </MTypographyContent>
  </p>
</template>
