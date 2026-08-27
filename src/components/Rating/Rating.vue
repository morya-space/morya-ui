<script setup lang="ts">
import type { RatingProps } from './types'
import { computed } from 'vue'
import { formatLocale, useWiLocale } from '../../locale'

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: 0,
  stars: 5,
  disabled: false,
  readonly: false,
  cancel: true,
  allowClear: null,
  allowHalf: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: number): void }>()
const locale = useWiLocale()

const canClear = computed(() => props.allowClear ?? props.cancel)
const starList = computed(() => Array.from({ length: Math.max(1, props.stars) }, (_, index) => index + 1))

const rootClass = computed(() => [
  'wi-rating',
  {
    'wi-rating--disabled': props.disabled,
    'wi-rating--readonly': props.readonly,
    'wi-rating--half': props.allowHalf,
  },
])

function starFill(star: number) {
  const value = props.modelValue ?? 0
  if (value >= star) return 1
  if (props.allowHalf && value >= star - 0.5) return 0.5
  return 0
}

function setValue(value: number) {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', value)
}

function onStarClick(star: number, event: MouseEvent) {
  if (!props.allowHalf) {
    setValue(star)
    return
  }
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const half = event.clientX - rect.left < rect.width / 2
  setValue(half ? star - 0.5 : star)
}

function clearRating() {
  if (props.disabled || props.readonly || !canClear.value) return
  emit('update:modelValue', 0)
}
</script>

<template>
  <div :class="rootClass" role="slider" :aria-valuenow="modelValue" :aria-valuemin="0" :aria-valuemax="stars">
    <button
      v-if="canClear"
      type="button"
      class="wi-rating__cancel"
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
      class="wi-rating__star"
      :class="{
        'wi-rating__star--on': starFill(star) === 1,
        'wi-rating__star--half': starFill(star) === 0.5,
      }"
      :aria-label="formatLocale(locale.star, { value: star })"
      :disabled="disabled || readonly"
      @click="onStarClick(star, $event)"
    >
      <span class="wi-rating__star-off" aria-hidden="true">☆</span>
      <span class="wi-rating__star-on" aria-hidden="true">★</span>
    </button>
  </div>
</template>
