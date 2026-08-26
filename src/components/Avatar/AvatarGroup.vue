<script setup lang="ts">
import { Comment, Fragment, Text, computed, useSlots, type VNode, type VNodeChild } from 'vue'
import type { AvatarGroupProps, AvatarSize } from './types'

const props = defineProps<AvatarGroupProps>()
const slots = useSlots()

const resolvedSize = computed((): AvatarSize => {
  if (props.size === 'sm') return 'normal'
  if (props.size === 'lg' || props.size === 'large') return 'large'
  if (props.size === 'xlarge') return 'xlarge'
  return 'normal'
})

function flatten(nodes: VNodeChild[] | undefined): VNode[] {
  if (!nodes) return []
  const result: VNode[] = []
  for (const node of nodes) {
    if (node == null || typeof node === 'boolean' || typeof node === 'string' || typeof node === 'number') continue
    if (Array.isArray(node)) {
      result.push(...flatten(node))
      continue
    }
    if (typeof node === 'object' && 'type' in node) {
      const vnode = node as VNode
      if (vnode.type === Comment || vnode.type === Text) continue
      if (vnode.type === Fragment) {
        result.push(...flatten(vnode.children as VNodeChild[]))
        continue
      }
      result.push(vnode)
    }
  }
  return result
}

const children = computed(() => flatten(slots.default?.()))
const visible = computed(() => {
  if (props.max == null || props.max < 0) return children.value
  return children.value.slice(0, props.max)
})
const overflow = computed(() => Math.max(0, children.value.length - visible.value.length))

const groupClass = computed(() => [
  'wi-avatar-group',
  {
    'wi-avatar-group--large': resolvedSize.value === 'large',
    'wi-avatar-group--xlarge': resolvedSize.value === 'xlarge',
  },
])
</script>

<template>
  <div :class="groupClass">
    <component :is="child" v-for="(child, index) in visible" :key="index" />
    <span
      v-if="overflow > 0"
      class="wi-avatar wi-avatar--circle wi-avatar-group__overflow"
      :class="{
        'wi-avatar--large': resolvedSize === 'large',
        'wi-avatar--xlarge': resolvedSize === 'xlarge',
      }"
    >
      +{{ overflow }}
    </span>
  </div>
</template>
