<script setup lang="ts">
import type { RowProps } from './rowColTypes'
import { computed, provide, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { M_ROW_KEY, resolveGutter } from './rowColTypes'
import { useGridBreakpoint } from './useGridBreakpoint'

defineOptions({ inheritAttrs: false, name: 'MRow' })

const props = withDefaults(defineProps<RowProps>(), {
  gutter: 0,
  justify: 'start',
  align: 'top',
  wrap: true,
  component: 'div',
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const breakpoints = useGridBreakpoint()

/** `[horizontal, vertical]` for the current viewport. */
const resolvedGutter = computed(() => resolveGutter(props.gutter, breakpoints.value))
provide(M_ROW_KEY, resolvedGutter)

const rootStyle = computed(() => {
  const [horizontal, vertical] = resolvedGutter.value
  const style: Record<string, string> = {}

  if (horizontal > 0) {
    // Negative margins cancel the column padding so the row stays flush.
    style.marginInlineStart = `${-horizontal / 2}px`
    style.marginInlineEnd = `${-horizontal / 2}px`
  }
  if (vertical > 0) style.rowGap = `${vertical}px`

  return style
})

const rootClass = computed(() => [
  'm-row',
  `m-row--justify-${props.justify}`,
  `m-row--align-${props.align}`,
  { 'm-row--nowrap': !props.wrap },
])
</script>

<template>
  <component
    :is="component"
    v-bind="rootAttrs"
    :class="rootClass"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
