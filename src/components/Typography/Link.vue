<script setup lang="ts">
import type { LinkProps } from './types'
import { computed, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { typographyTypeClass } from './decoration'
import MTypographyContent from './TypographyContent.vue'

defineOptions({ inheritAttrs: false, name: 'MLink' })

const props = withDefaults(defineProps<LinkProps>(), {
  underline: true,
  disabled: false,
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootClass = computed(() => [
  'm-typography',
  'm-typography-link',
  typographyTypeClass(props.type),
  {
    'm-typography--underline': props.underline,
    'm-typography--disabled': props.disabled,
  },
])

const rel = computed(() =>
  props.target === '_blank' ? 'noopener noreferrer' : undefined,
)

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>

<template>
  <a
    v-bind="rootAttrs"
    :class="rootClass"
    :href="disabled ? undefined : href"
    :target="disabled ? undefined : target"
    :rel="disabled ? undefined : rel"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="onClick"
  >
    <MTypographyContent :decorations="{ copyable: props.copyable }" :disabled="props.disabled">
      <slot />
    </MTypographyContent>
  </a>
</template>
