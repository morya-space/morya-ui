<script setup lang="ts">
import type { ColProps, ColResponsiveConfig } from './rowColTypes'
import { computed, inject, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { M_ROW_KEY, mergeColResponsive } from './rowColTypes'
import { GRID_BREAKPOINT_ORDER, useGridBreakpoint } from './useGridBreakpoint'

defineOptions({ inheritAttrs: false, name: 'MCol' })

const props = withDefaults(defineProps<ColProps>(), {
  span: 24,
  offset: 0,
  push: 0,
  pull: 0,
  component: 'div',
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const breakpoints = useGridBreakpoint()
const gutter = inject(M_ROW_KEY, null)

/**
 * Merge responsive overrides in ascending breakpoint order, so the largest
 * satisfied breakpoint wins — the same result Ant Design's media queries give.
 */
const resolved = computed<ColResponsiveConfig>(() => {
  let current: ColResponsiveConfig = {
    span: props.span,
    offset: props.offset,
    push: props.push,
    pull: props.pull,
    order: props.order,
  }

  for (const breakpoint of GRID_BREAKPOINT_ORDER) {
    if (breakpoint !== 'xs' && !breakpoints.value.includes(breakpoint)) continue
    current = mergeColResponsive(current, props[breakpoint])
  }

  return current
})

const rootStyle = computed(() => {
  const style: Record<string, string | number> = {}
  const [horizontal] = gutter?.value ?? [0, 0]

  if (horizontal > 0) {
    style.paddingInlineStart = `${horizontal / 2}px`
    style.paddingInlineEnd = `${horizontal / 2}px`
  }

  const { flex } = props
  if (flex != null) {
    style.flex = typeof flex === 'number' ? `${flex} ${flex} auto` : flex
  }
  else if (resolved.value.span != null) {
    const width = `${(resolved.value.span / 24) * 100}%`
    style.flex = `0 0 ${width}`
    style.maxWidth = width
  }

  const { offset, push, pull, order } = resolved.value
  if (offset) style.marginInlineStart = `${(offset / 24) * 100}%`
  if (push) {
    style.position = 'relative'
    style.insetInlineStart = `${(push / 24) * 100}%`
  }
  if (pull) {
    style.position = 'relative'
    style.insetInlineEnd = `${(pull / 24) * 100}%`
  }
  if (order != null) style.order = order

  return style
})
</script>

<template>
  <component
    :is="component"
    v-bind="rootAttrs"
    class="m-col"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
