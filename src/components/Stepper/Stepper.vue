<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { StepperProps, StepperStatus } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, useAttrs } from 'vue'
import MIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<StepperProps>(), {
  modelValue: 0,
  linear: false,
  vertical: false,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


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
  'm-stepper',
  { 'm-stepper--vertical': isVertical.value },
])
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass" role="tablist">
    <button
      v-for="(step, index) in steps"
      :key="`${step.label}-${index}`"
      type="button"
      class="m-stepper__step"
      :class="{
        'm-stepper__step--active': index === activeIndex,
        'm-stepper__step--completed': index < activeIndex,
        'm-stepper__step--disabled': !canSelect(index, step.disabled),
        [`m-stepper__step--${stepStatus(index, step.status)}`]: true,
      }"
      role="tab"
      :aria-selected="index === activeIndex"
      :disabled="!canSelect(index, step.disabled)"
      @click="select(index, step.disabled)"
    >
      <span class="m-stepper__marker" aria-hidden="true">
        <slot
          name="icon"
          :step="step"
          :index="index"
          :status="stepStatus(index, step.status)"
        >
          <MIcon v-if="stepStatus(index, step.status) === 'finish'" name="check" />
          <MIcon v-else-if="stepStatus(index, step.status) === 'error'" name="warning" />
          <template v-else>{{ index + 1 }}</template>
        </slot>
      </span>
      <span class="m-stepper__copy">
        <span class="m-stepper__label">{{ step.label }}</span>
        <span v-if="step.description" class="m-stepper__description">{{ step.description }}</span>
      </span>
    </button>
  </div>
  <div v-if="$slots.default" class="m-stepper__content">
    <slot :active-index="activeIndex" />
  </div>
</template>
