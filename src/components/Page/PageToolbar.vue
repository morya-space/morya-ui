<script setup lang="ts">
import type { PageToolbarProps } from './types'
import { computed, useAttrs, useSlots } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'

defineOptions({ name: 'MPageToolbar', inheritAttrs: false })

const props = withDefaults(defineProps<PageToolbarProps>(), {
  headingLevel: 1,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const slots = useSlots()

const titleTag = computed(() => `h${props.headingLevel}` as const)
const hasActions = computed(() => Boolean(slots.actions))
</script>

<template>
  <header v-bind="rootAttrs" class="m-page-toolbar">
    <component :is="titleTag" v-if="title" class="m-page-toolbar__title">
      {{ title }}
    </component>
    <slot v-else />
    <div v-if="hasActions" class="m-page-toolbar__actions">
      <slot name="actions" />
    </div>
  </header>
</template>
