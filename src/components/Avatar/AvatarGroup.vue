<script setup lang="ts">
import type { VNode, VNodeChild } from 'vue'
import type { AvatarGroupProps, AvatarSize } from './types'
import { Comment, computed, Fragment, Text, useSlots } from 'vue'

const props = defineProps<AvatarGroupProps>()
const slots = useSlots()

function resolveAvatarSize(size: AvatarGroupProps['size']): AvatarSize {
  if (size === 'sm' || size === 'small') return 'small'
  if (size === 'normal' || size === 'md' || size === 'medium') return 'medium'
  if (size === 'lg' || size === 'large') return 'large'
  if (size === 'xlarge') return 'xlarge'
  return 'medium'
}

const resolvedSize = computed(() => resolveAvatarSize(props.size))

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
  'wd-avatar-group',
  `wd-avatar-group--${resolvedSize.value}`,
])
</script>

<template>
  <div :class="groupClass">
    <component :is="child" v-for="(child, index) in visible" :key="index" />
    <span
      v-if="overflow > 0"
      class="wd-avatar wd-avatar--circle wd-avatar-group__overflow"
      :class="`wd-avatar--${resolvedSize}`"
    >
      +{{ overflow }}
    </span>
  </div>
</template>
