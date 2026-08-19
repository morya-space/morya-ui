<script setup lang="ts">
import { computed } from 'vue'
import { useWdLocale } from '../../locale'
import type { SliderProps } from './types'

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  range: false,
  disabled: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: number | number[]): void }>()
const locale = useWdLocale()

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

const rootClass = computed(() => [
  'wd-slider',
  {
    'wd-slider--disabled': props.disabled,
    'wd-slider--range': props.range,
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
  <div :class="rootClass">
    <template v-if="range">
      <input
        class="wd-slider__input wd-slider__input--start"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="rangeValues[0]"
        :disabled="disabled"
        :aria-label="locale.rangeStart"
        @input="emitRange(0, $event)"
      />
      <input
        class="wd-slider__input wd-slider__input--end"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="rangeValues[1]"
        :disabled="disabled"
        :aria-label="locale.rangeEnd"
        @input="emitRange(1, $event)"
      />
    </template>
    <input
      v-else
      class="wd-slider__input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="singleValue"
      :disabled="disabled"
      @input="emitSingle"
    />
  </div>
</template>
