<script setup lang="ts">
import type { LayoutHeaderProps } from './types'
import { computed } from 'vue'

defineOptions({ name: 'WiLayoutHeader' })

const props = withDefaults(defineProps<LayoutHeaderProps>(), {
  bordered: false,
  inverted: false,
  position: 'static',
})

const rootClass = computed(() => [
  'wi-layout-header',
  `wi-layout-header--${props.position}-positioned`,
  {
    'wi-layout-header--bordered': props.bordered,
    'wi-layout-header--inverted': props.inverted,
  },
])
</script>

<template>
  <header :class="rootClass">
    <slot />
  </header>
</template>
