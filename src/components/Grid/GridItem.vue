<script setup lang="ts">
import type {GridItemProps} from './types';
import { computed, inject, useAttrs } from 'vue'
import { parseResponsiveValue } from '../../shared/responsive'
import { useRootParts } from '../../shared/useComponentAttrs'
import {  M_GRID_ITEM_FLAG, M_GRID_KEY } from './types'

defineOptions({
  name: 'MGridItem',
  inheritAttrs: false,
  [M_GRID_ITEM_FLAG]: true,
} as Record<string, unknown>)

const props = withDefaults(defineProps<GridItemProps>(), {
  span: 1,
  offset: 0,
  suffix: false,
})

const attrs = useAttrs()
const userAttrs = computed(() => {
  const { privateSpan, privateOffset, privateColStart, privateShow, ...rest } = attrs
  return rest as Record<string, unknown>
})
const { rootAttrs } = useRootParts(userAttrs, () => props.pt)
const grid = inject(M_GRID_KEY, null)

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
  <div v-bind="rootAttrs" class="m-grid-item" :style="itemStyle">
    <slot :overflow="overflow" />
  </div>
</template>
