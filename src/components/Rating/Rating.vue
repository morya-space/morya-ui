<script setup lang="ts">
import { computed } from 'vue'
import { formatLocale, useWdLocale } from '../../locale'
import type { RatingProps } from './types'

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: 0,
  stars: 5,
  disabled: false,
  readonly: false,
  cancel: true,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: number): void }>()
const locale = useWdLocale()

const starList = computed(() => Array.from({ length: Math.max(1, props.stars) }, (_, index) => index + 1))

const rootClass = computed(() => [
  'wd-rating',
  {
    'wd-rating--disabled': props.disabled,
    'wd-rating--readonly': props.readonly,
  },
])

function setValue(value: number) {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', value)
}

function clearRating() {
  if (props.disabled || props.readonly || !props.cancel) return
  emit('update:modelValue', 0)
}
</script>

<template>
  <div :class="rootClass" role="slider" :aria-valuenow="modelValue" :aria-valuemin="0" :aria-valuemax="stars">
    <button
      v-if="cancel"
      type="button"
      class="wd-rating__cancel"
      :aria-label="locale.clearRating"
      :disabled="disabled || readonly"
      @click="clearRating"
    >
      ×
    </button>
    <button
      v-for="star in starList"
      :key="star"
      type="button"
      class="wd-rating__star"
      :class="{ 'wd-rating__star--on': star <= modelValue }"
      :aria-label="formatLocale(locale.star, { value: star })"
      :disabled="disabled || readonly"
      @click="setValue(star)"
    >
      {{ star <= modelValue ? '★' : '☆' }}
    </button>
  </div>
</template>
