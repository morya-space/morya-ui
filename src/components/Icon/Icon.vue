<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { resolveSizeClass } from '../../shared/types'
import { getIconDefinition, isIconName } from './icons'
import type { IconProps } from './types'

const props = withDefaults(defineProps<IconProps>(), { size: 'md' })
const slots = useSlots()
const sizeClass = computed(() => resolveSizeClass(props.size))

const definition = computed(() => {
  if (!props.name || !isIconName(props.name)) return undefined
  return getIconDefinition(props.name)
})

const useSlot = computed(() => Boolean(slots.default))
const hasContent = computed(() => useSlot.value || Boolean(definition.value))

const rootClass = computed(() => [
  'wi-icon',
  `wi-icon--${sizeClass.value}`,
  { 'wi-icon--spin': definition.value?.spin },
])
</script>

<template>
  <span
    v-if="hasContent"
    :class="rootClass"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    role="img"
  >
    <slot v-if="useSlot" />
    <svg
      v-else-if="definition"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <template v-for="(node, index) in definition.primitives" :key="index">
        <path v-if="node.tag === 'path'" :d="node.d" />
        <circle
          v-else-if="node.tag === 'circle'"
          :cx="node.cx"
          :cy="node.cy"
          :r="node.r"
          :fill="node.fill ?? 'none'"
        />
        <line
          v-else-if="node.tag === 'line'"
          :x1="node.x1"
          :y1="node.y1"
          :x2="node.x2"
          :y2="node.y2"
        />
        <polyline v-else-if="node.tag === 'polyline'" :points="node.points" />
        <rect
          v-else-if="node.tag === 'rect'"
          :x="node.x"
          :y="node.y"
          :width="node.width"
          :height="node.height"
          :rx="node.rx"
        />
      </template>
    </svg>
  </span>
</template>
