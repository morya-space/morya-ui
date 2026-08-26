<script setup lang="ts">
import { computed } from 'vue'
import type { LayoutFooterProps } from './types'

defineOptions({ name: 'WiLayoutFooter' })

const props = withDefaults(defineProps<LayoutFooterProps>(), {
  bordered: false,
  inverted: false,
  position: 'static',
})

const rootClass = computed(() => [
  'wi-layout-footer',
  `wi-layout-footer--${props.position}-positioned`,
  {
    'wi-layout-footer--bordered': props.bordered,
    'wi-layout-footer--inverted': props.inverted,
  },
])
</script>

<template>
  <footer :class="rootClass">
    <slot />
  </footer>
</template>
