<script setup lang="ts">
import { computed, type CSSProperties, useSlots } from 'vue'
import { useConfiguredGapSize } from '../../shared/config'
import {
  resolveAlign,
  resolveFlexDirection,
  resolveGap,
  resolveJustify,
} from '../../shared/gap'
import { flattenVNodes } from '../../shared/vnode'
import type { FlexProps } from './types'

const props = withDefaults(defineProps<FlexProps>(), {
  justify: 'start',
  inline: false,
  vertical: false,
  reverse: false,
  wrap: true,
})

const slots = useSlots()
const resolvedSize = useConfiguredGapSize('Flex', () => props.size)
const children = computed(() => flattenVNodes(slots.default?.()))

const rootStyle = computed((): CSSProperties | undefined => {
  if (!children.value.length) return undefined
  const gap = resolveGap(resolvedSize.value)
  return {
    display: props.inline ? 'inline-flex' : 'flex',
    flexDirection: resolveFlexDirection(props.vertical, props.reverse),
    justifyContent: resolveJustify(props.justify),
    alignItems: resolveAlign(props.align),
    flexWrap: !props.wrap || props.vertical ? 'nowrap' : 'wrap',
    gap: gap.css,
  }
})
</script>

<template>
  <div v-if="children.length" class="wi-flex" role="none" :style="rootStyle">
    <component :is="child" v-for="(child, index) in children" :key="index" />
  </div>
</template>
