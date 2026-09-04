<script setup lang="ts">
import type { RatingProps } from './types'
import { computed } from 'vue'
import { formatLocale, useWdLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { useWdId } from '../../shared/useWdId'
import { useFieldFeedback } from '../../shared/useFieldFeedback'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: 0,
  stars: 5,
  disabled: false,
  readonly: false,
  invalid: false,
  cancel: undefined,
  allowClear: null,
  allowHalf: false,
  ariaLabel: undefined,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: number): void }>()
const locale = useWdLocale()
const sizeClass = useConfiguredSize('Rating', () => props.size)
const fieldId = useWdId('wd-rating')
const { isInvalid, feedbackText, feedbackIsError } = useFieldFeedback(props)

const canClear = computed(() => props.allowClear ?? props.cancel ?? true)
const sliderLabel = computed(() => props.ariaLabel ?? props.label ?? locale.value.rating)
const valueText = computed(() => formatLocale(locale.value.star, { value: props.modelValue ?? 0 }))
const starList = computed(() => Array.from({ length: Math.max(1, props.stars) }, (_, index) => index + 1))

const rootClass = computed(() => [
  'wd-rating',
  `wd-rating--${sizeClass.value}`,
  {
    'wd-rating--disabled': props.disabled,
    'wd-rating--readonly': props.readonly,
    'wd-rating--half': props.allowHalf,
    'wd-rating--invalid': isInvalid.value,
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

function onSliderKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  const current = props.modelValue ?? 0
  const delta = props.allowHalf && event.shiftKey ? 0.5 : 1
  let next: number | null = null
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + delta
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - delta
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = props.stars
  if (next == null) return
  event.preventDefault()
  const clamped = Math.min(props.stars, Math.max(0, next))
  const snapped = props.allowHalf ? Math.round(clamped * 2) / 2 : Math.round(clamped)
  if (snapped !== current) emit('update:modelValue', snapped)
}
</script>

<template>
  <div class="wd-rating-field">
    <label v-if="label" class="wd-rating-field__label" :id="`${fieldId}-label`">{{ label }}</label>
    <div
      :class="rootClass"
      role="slider"
      :aria-valuenow="modelValue"
      :aria-valuemin="0"
      :aria-valuemax="stars"
      :aria-valuetext="valueText"
      :aria-label="label ? undefined : sliderLabel"
      :aria-labelledby="label ? `${fieldId}-label` : undefined"
      :aria-describedby="feedbackText ? `${fieldId}-help` : undefined"
      :aria-invalid="isInvalid || undefined"
      :aria-disabled="disabled || undefined"
      :aria-readonly="readonly || undefined"
      :tabindex="disabled || readonly ? -1 : 0"
      @keydown="onSliderKeydown"
    >
    <button
      v-if="canClear"
      type="button"
      class="wd-rating__cancel"
      :aria-label="locale.clearRating"
      :disabled="disabled || readonly"
      tabindex="-1"
      @click="clearRating"
    >
      <WdIcon name="close" size="sm" />
    </button>
    <button
      v-for="star in starList"
      :key="star"
      type="button"
      class="wd-rating__star"
      :class="{
        'wd-rating__star--on': starFill(star) === 1,
        'wd-rating__star--half': starFill(star) === 0.5,
      }"
      :aria-label="formatLocale(locale.star, { value: star })"
      :disabled="disabled || readonly"
      tabindex="-1"
      aria-hidden="true"
      @click="onStarClick(star, $event)"
    >
      <slot
        name="icon"
        :star="star"
        :filled="starFill(star) === 1"
        :half="starFill(star) === 0.5"
      >
        <span class="wd-rating__star-off" aria-hidden="true">
          <WdIcon name="star" size="lg" />
        </span>
        <span class="wd-rating__star-on" aria-hidden="true">
          <WdIcon name="star" size="lg" />
        </span>
      </slot>
    </button>
    </div>
    <span
      v-if="feedbackText"
      :id="`${fieldId}-help`"
      class="wd-rating-field__help"
      :class="{ 'wd-rating-field__help--invalid': feedbackIsError }"
      :role="feedbackIsError ? 'alert' : undefined"
    >
      {{ feedbackText }}
    </span>
  </div>
</template>
