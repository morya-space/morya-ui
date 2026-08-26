<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue'
import { parseResponsiveValue } from '../../shared/responsive'
import { WI_GRID_ITEM_FLAG, WI_GRID_KEY, type GridItemProps } from './types'

defineOptions({
  name: 'WiGridItem',
  inheritAttrs: false,
  [WI_GRID_ITEM_FLAG]: true,
} as Record<string, unknown>)

const props = withDefaults(defineProps<GridItemProps>(), {
  span: 1,
  offset: 0,
  suffix: false,
})

const attrs = useAttrs()
const grid = inject(WI_GRID_KEY, null)

const privateSpan = computed(() => {
  const fromAttrs = attrs.privateSpan as number | undefined
  if (typeof fromAttrs === 'number') return fromAttrs
  return parseResponsiveValue(props.span, undefined) ?? 1
})

const privateOffset = computed(() => {
  const fromAttrs = attrs.privateOffset as number | undefined
  if (typeof fromAttrs === 'number') return fromAttrs
  return parseResponsiveValue(props.offset, undefined) ?? 0
})

const privateColStart = computed(() => attrs.privateColStart as number | undefined)

const privateShow = computed(() => attrs.privateShow !== false)

const itemStyle = computed(() => {
  const span = privateSpan.value
  const offset = privateOffset.value
  const xGap = grid?.xGap.value ?? '0px'
  const colStart = privateColStart.value

  return [
    grid?.itemStyle.value,
    attrs.style as string | Record<string, string> | undefined,
    {
      display: privateShow.value ? undefined : 'none',
      gridColumn: colStart ? `${colStart} / span ${span}` : `span ${span} / span ${span}`,
      marginLeft:
        offset > 0
          ? `calc((100% - (${span} - 1) * ${xGap}) / ${span} * ${offset} + ${xGap} * ${offset})`
          : undefined,
    },
  ]
})

const overflow = computed(() => grid?.overflow.value ?? false)
</script>

<template>
  <div class="wi-grid-item" :class="attrs.class as string | undefined" :style="itemStyle">
    <slot :overflow="overflow" />
  </div>
</template>
