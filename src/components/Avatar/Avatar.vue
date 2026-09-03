<script setup lang="ts">
import type { AvatarProps, AvatarSize } from './types'
import { computed, ref, watch } from 'vue'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<AvatarProps>(), {
  shape: 'circle',
  size: 'medium',
})

const emit = defineEmits<{ (event: 'error', value: Event): void }>()
const imageFailed = ref(false)

watch(
  () => props.image,
  () => {
    imageFailed.value = false
  },
)

function resolveAvatarSize(size: AvatarProps['size']): AvatarSize {
  if (size === 'sm' || size === 'small') return 'small'
  if (size === 'normal' || size === 'md' || size === 'medium') return 'medium'
  if (size === 'lg' || size === 'large') return 'large'
  if (size === 'xlarge') return 'xlarge'
  return 'medium'
}

const resolvedSize = computed(() => resolveAvatarSize(props.size))

const iconSize = computed(() => {
  if (resolvedSize.value === 'xlarge') return 'lg'
  if (resolvedSize.value === 'large') return 'lg'
  if (resolvedSize.value === 'small') return 'sm'
  return 'md'
})

const avatarClass = computed(() => [
  'wi-avatar',
  `wi-avatar--${props.shape}`,
  `wi-avatar--${resolvedSize.value}`,
])

const displayMode = computed(() => {
  if (props.image && !imageFailed.value) return 'image' as const
  if (props.icon) return 'icon' as const
  return 'label' as const
})

function onImageError(event: Event) {
  imageFailed.value = true
  emit('error', event)
}
</script>

<template>
  <span :class="avatarClass" role="img" :aria-label="label || undefined">
    <img
      v-if="displayMode === 'image'"
      class="wi-avatar__image"
      :src="image"
      :alt="label || ''"
      @error="onImageError"
    >
    <span v-else-if="displayMode === 'icon'" class="wi-avatar__icon">
      <WiIcon :name="icon!" :size="iconSize" />
    </span>
    <span v-else-if="label" class="wi-avatar__label">{{ label }}</span>
  </span>
</template>
