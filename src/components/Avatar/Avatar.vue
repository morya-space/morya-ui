<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import WiIcon from '../Icon/Icon.vue'
import type { AvatarProps, AvatarSize } from './types'

const props = withDefaults(defineProps<AvatarProps>(), {
  shape: 'circle',
  size: 'normal',
})

const emit = defineEmits<{ (event: 'error', value: Event): void }>()
const imageFailed = ref(false)

watch(
  () => props.image,
  () => {
    imageFailed.value = false
  },
)

const resolvedSize = computed((): AvatarSize => {
  if (props.size === 'sm') return 'normal'
  if (props.size === 'lg' || props.size === 'large') return 'large'
  if (props.size === 'xlarge') return 'xlarge'
  return 'normal'
})

const avatarClass = computed(() => [
  'wi-avatar',
  `wi-avatar--${props.shape}`,
  {
    'wi-avatar--large': resolvedSize.value === 'large',
    'wi-avatar--xlarge': resolvedSize.value === 'xlarge',
  },
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
    />
    <WiIcon v-else-if="displayMode === 'icon'" class="wi-avatar__icon" :name="icon!" size="sm" />
    <span v-else-if="label" class="wi-avatar__label">{{ label }}</span>
  </span>
</template>
