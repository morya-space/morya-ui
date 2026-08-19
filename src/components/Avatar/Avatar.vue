<script setup lang="ts">
import { computed } from 'vue'
import WdIcon from '../Icon/Icon.vue'
import type { AvatarProps, AvatarSize } from './types'

const props = withDefaults(defineProps<AvatarProps>(), {
  shape: 'circle',
  size: 'normal',
})

const resolvedSize = computed((): AvatarSize => {
  if (props.size === 'sm') return 'normal'
  if (props.size === 'lg' || props.size === 'large') return 'large'
  if (props.size === 'xlarge') return 'xlarge'
  return 'normal'
})

const avatarClass = computed(() => [
  'wd-avatar',
  `wd-avatar--${props.shape}`,
  {
    'wd-avatar--large': resolvedSize.value === 'large',
    'wd-avatar--xlarge': resolvedSize.value === 'xlarge',
  },
])

const displayMode = computed(() => {
  if (props.image) return 'image' as const
  if (props.icon) return 'icon' as const
  return 'label' as const
})
</script>

<template>
  <span :class="avatarClass" role="img" :aria-label="label || undefined">
    <img v-if="displayMode === 'image'" class="wd-avatar__image" :src="image" :alt="label || ''" />
    <WdIcon v-else-if="displayMode === 'icon'" class="wd-avatar__icon" :name="icon!" size="sm" />
    <span v-else-if="label" class="wd-avatar__label">{{ label }}</span>
  </span>
</template>
