<script setup lang="ts">
import type { StepperProps, StepperStatus } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<StepperProps>(), {
  modelValue: 0,
  linear: false,
  vertical: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const activeIndex = computed(() => props.modelValue ?? 0)
const isVertical = computed(() => props.vertical || props.orientation === 'vertical')

function canSelect(index: number, disabled?: boolean) {
  if (disabled) return false
  if (props.linear && index > activeIndex.value) return false
  return true
}

function select(index: number, disabled?: boolean) {
  if (!canSelect(index, disabled)) return
  emit('update:modelValue', index)
}

function stepStatus(index: number, explicit?: StepperStatus): StepperStatus {
  if (explicit) return explicit
  if (index < activeIndex.value) return 'finish'
  if (index === activeIndex.value) return 'process'
  return 'wait'
}

const rootClass = computed(() => [
  'wi-stepper',
  { 'wi-stepper--vertical': isVertical.value },
])
</script>

<template>
  <div :class="rootClass" role="tablist">
    <button
      v-for="(step, index) in steps"
      :key="`${step.label}-${index}`"
      type="button"
      class="wi-stepper__step"
      :class="{
        'wi-stepper__step--active': index === activeIndex,
        'wi-stepper__step--completed': index < activeIndex,
        'wi-stepper__step--disabled': !canSelect(index, step.disabled),
        [`wi-stepper__step--${stepStatus(index, step.status)}`]: true,
      }"
      role="tab"
      :aria-selected="index === activeIndex"
      :disabled="!canSelect(index, step.disabled)"
      @click="select(index, step.disabled)"
    >
      <span class="wi-stepper__marker" aria-hidden="true">{{ index + 1 }}</span>
      <span class="wi-stepper__copy">
        <span class="wi-stepper__label">{{ step.label }}</span>
        <span v-if="step.description" class="wi-stepper__description">{{ step.description }}</span>
      </span>
    </button>
  </div>
  <div v-if="$slots.default" class="wi-stepper__content">
    <slot :active-index="activeIndex" />
  </div>
</template>
