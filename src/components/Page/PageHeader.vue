<script setup lang="ts">
import { useRootParts } from '../../shared/useComponentAttrs'
import type { PageHeaderProps } from './types'
import { computed, useAttrs, useSlots } from 'vue'

defineOptions({ name: 'MPageHeader', inheritAttrs: false })

const props = withDefaults(defineProps<PageHeaderProps>(), {
  headingLevel: 1,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const slots = useSlots()

const titleTag = computed(() => `h${props.headingLevel}` as const)
const hasActions = computed(() => Boolean(slots.actions))
</script>

<template>
  <header v-bind="rootAttrs" class="m-page-header">
    <div class="m-page-header__main">
      <component :is="titleTag" v-if="title" class="m-page-header__title">
        {{ title }}
      </component>
      <slot v-else name="title" />
      <p v-if="description" class="m-page-header__description">
        {{ description }}
      </p>
      <slot v-else-if="slots.description" name="description" />
    </div>
    <div v-if="hasActions" class="m-page-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>
