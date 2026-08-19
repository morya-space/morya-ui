<script setup lang="ts">
import { computed } from 'vue'
import type { StepperProps } from './types'

const props = withDefaults(defineProps<StepperProps>(), {
  modelValue: 0,
  linear: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const activeIndex = computed(() => props.modelValue ?? 0)

function canSelect(index: number, disabled?: boolean) {
  if (disabled) return false
  if (props.linear && index > activeIndex.value) return false
  return true
}

function select(index: number, disabled?: boolean) {
  if (!canSelect(index, disabled)) return
  emit('update:modelValue', index)
}
</script>

<template>
  <div class="wd-stepper" role="tablist">
    <button
      v-for="(step, index) in steps"
      :key="`${step.label}-${index}`"
      type="button"
      class="wd-stepper__step"
      :class="{
        'wd-stepper__step--active': index === activeIndex,
        'wd-stepper__step--completed': index < activeIndex,
        'wd-stepper__step--disabled': !canSelect(index, step.disabled),
      }"
      role="tab"
      :aria-selected="index === activeIndex"
      :disabled="!canSelect(index, step.disabled)"
      @click="select(index, step.disabled)"
    >
      <span class="wd-stepper__marker" aria-hidden="true">{{ index + 1 }}</span>
      <span class="wd-stepper__label">{{ step.label }}</span>
    </button>
  </div>
  <div v-if="$slots.default" class="wd-stepper__content">
    <slot :active-index="activeIndex" />
  </div>
</template>
