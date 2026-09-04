<script setup lang="ts">
import type { SliderProps } from './types'
import { computed, ref } from 'vue'
import { useWiLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { useWiId } from '../../shared/useWiId'
import { useFieldFeedback } from '../../shared/useFieldFeedback'

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  range: false,
  disabled: false,
  invalid: false,
  tooltip: false,
  vertical: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: number | number[]): void }>()
const locale = useWiLocale()
const hovering = ref(false)
const sizeClass = useConfiguredSize('Slider', () => props.size)
const fieldId = useWiId('wi-slider')
const { isInvalid, feedbackText, feedbackIsError } = useFieldFeedback(props)

const singleValue = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue[0] ?? props.min
  return props.modelValue ?? props.min
})

const rangeValues = computed(() => {
  if (Array.isArray(props.modelValue) && props.modelValue.length >= 2) {
    return [props.modelValue[0], props.modelValue[1]] as [number, number]
  }
  return [props.min, props.max] as [number, number]
})

const markItems = computed(() => {
  if (!props.marks) return []
  const span = props.max - props.min || 1
  if (Array.isArray(props.marks)) {
    return props.marks.map((value) => ({
      value,
      label: String(value),
      percent: ((value - props.min) / span) * 100,
    }))
  }
  return Object.entries(props.marks).map(([raw, label]) => {
    const value = Number(raw)
    return { value, label, percent: ((value - props.min) / span) * 100 }
  })
})

const tooltipText = computed(() => {
  if (props.range) return `${rangeValues.value[0]} – ${rangeValues.value[1]}`
  return String(singleValue.value)
})

const rootClass = computed(() => [
  'wi-slider',
  `wi-slider--${sizeClass.value}`,
  {
    'wi-slider--disabled': props.disabled,
    'wi-slider--range': props.range,
    'wi-slider--vertical': props.vertical,
    'wi-slider--tooltip': props.tooltip,
    'wi-slider--invalid': isInvalid.value,
  },
])

function emitSingle(event: Event) {
  if (props.disabled) return
  emit('update:modelValue', Number((event.target as HTMLInputElement).value))
}

function emitRange(index: 0 | 1, event: Event) {
  if (props.disabled) return
  const next = [...rangeValues.value] as [number, number]
  next[index] = Number((event.target as HTMLInputElement).value)
  if (next[0] > next[1]) {
    if (index === 0) next[1] = next[0]
    else next[0] = next[1]
  }
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="wi-slider-field">
    <label v-if="label" :id="`${fieldId}-label`" class="wi-slider-field__label">{{ label }}</label>
    <div
      :class="rootClass"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="feedbackText ? `${fieldId}-help` : undefined"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
      @focusin="hovering = true"
      @focusout="hovering = false"
    >
      <span v-if="tooltip && hovering" class="wi-slider__tooltip">{{ tooltipText }}</span>
      <template v-if="range">
        <input
          class="wi-slider__input wi-slider__input--start"
          type="range"
          :min="min"
          :max="max"
          :step="step"
          :value="rangeValues[0]"
          :disabled="disabled"
          :orient="vertical ? 'vertical' : undefined"
          :aria-label="locale.rangeStart"
          :aria-valuetext="String(rangeValues[0])"
          @input="emitRange(0, $event)"
        >
        <input
          class="wi-slider__input wi-slider__input--end"
          type="range"
          :min="min"
          :max="max"
          :step="step"
          :value="rangeValues[1]"
          :disabled="disabled"
          :orient="vertical ? 'vertical' : undefined"
          :aria-label="locale.rangeEnd"
          :aria-valuetext="String(rangeValues[1])"
          @input="emitRange(1, $event)"
        >
      </template>
      <input
        v-else
        class="wi-slider__input"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="singleValue"
        :disabled="disabled"
        :orient="vertical ? 'vertical' : undefined"
        :aria-label="ariaLabel ?? locale.sliderControl"
        :aria-labelledby="label ? `${fieldId}-label` : undefined"
        :aria-valuetext="tooltipText"
        @input="emitSingle"
      >
      <div v-if="markItems.length" class="wi-slider__marks" aria-hidden="true">
        <span
          v-for="mark in markItems"
          :key="mark.value"
          class="wi-slider__mark"
          :style="vertical ? { bottom: `${mark.percent}%` } : { left: `${mark.percent}%` }"
        >
          {{ mark.label }}
        </span>
      </div>
    </div>
    <span
      v-if="feedbackText"
      :id="`${fieldId}-help`"
      class="wi-slider-field__help"
      :class="{ 'wi-slider-field__help--invalid': feedbackIsError }"
      :role="feedbackIsError ? 'alert' : undefined"
    >
      {{ feedbackText }}
    </span>
  </div>
</template>
