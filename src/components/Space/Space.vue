<script setup lang="ts">
import type {CSSProperties} from 'vue';
import type { SpaceProps } from './types'
import { Comment, computed,  useSlots } from 'vue'
import { useConfiguredGapSize } from '../../shared/config'
import {
  resolveAlign,
  resolveFlexDirection,
  resolveGap,
  resolveJustify,
} from '../../shared/gap'
import { flattenVNodes } from '../../shared/vnode'

const props = withDefaults(defineProps<SpaceProps>(), {
  align: 'center',
  justify: 'start',
  inline: false,
  vertical: false,
  reverse: false,
  wrapItem: true,
  wrap: true,
})

const slots = useSlots()
const resolvedSize = useConfiguredGapSize('Space', () => props.size)

const children = computed(() => flattenVNodes(slots.default?.()))

const rootStyle = computed((): CSSProperties => {
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
  <div class="wd-space" :style="rootStyle">
    <template v-if="!wrapItem">
      <slot />
    </template>
    <template v-else>
      <template v-for="(child, index) in children" :key="index">
        <component :is="child" v-if="child.type === Comment" />
        <div v-else class="wd-space__item" :class="itemClass" :style="itemStyle">
          <component :is="child" />
        </div>
      </template>
    </template>
  </div>
</template>
