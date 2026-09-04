<script setup lang="ts">
import type { StepperProps, StepperStatus } from './types'
import { computed } from 'vue'
import WdIcon from '../Icon/Icon.vue'

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
  'wd-stepper',
  { 'wd-stepper--vertical': isVertical.value },
])
</script>

<template>
  <div :class="rootClass" role="tablist">
    <button
      v-for="(step, index) in steps"
      :key="`${step.label}-${index}`"
      type="button"
      class="wd-stepper__step"
      :class="{
        'wd-stepper__step--active': index === activeIndex,
        'wd-stepper__step--completed': index < activeIndex,
        'wd-stepper__step--disabled': !canSelect(index, step.disabled),
        [`wd-stepper__step--${stepStatus(index, step.status)}`]: true,
      }"
      role="tab"
      :aria-selected="index === activeIndex"
      :disabled="!canSelect(index, step.disabled)"
      @click="select(index, step.disabled)"
    >
      <span class="wd-stepper__marker" aria-hidden="true">
        <slot
          name="icon"
          :step="step"
          :index="index"
          :status="stepStatus(index, step.status)"
        >
          <WdIcon v-if="stepStatus(index, step.status) === 'finish'" name="check" />
          <WdIcon v-else-if="stepStatus(index, step.status) === 'error'" name="warning" />
          <template v-else>{{ index + 1 }}</template>
        </slot>
      </span>
      <span class="wd-stepper__copy">
        <span class="wd-stepper__label">{{ step.label }}</span>
        <span v-if="step.description" class="wd-stepper__description">{{ step.description }}</span>
      </span>
    </button>
  </div>
  <div v-if="$slots.default" class="wd-stepper__content">
    <slot :active-index="activeIndex" />
  </div>
</template>
