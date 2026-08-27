<script setup lang="ts">
import type { SwitchProps } from './types'
import { computed, useAttrs } from 'vue'
import { useConfiguredSize } from '../../shared/config'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  loading: false,
  invalid: false,
  disabled: false,
  required: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>()
const attrs = useAttrs()
const resolvedInputId = computed(
  () => props.inputId ?? props.id ?? `wi-switch-${Math.random().toString(36).slice(2, 8)}`,
)
const sizeClass = useConfiguredSize('Switch', () => props.size)
const isDisabled = computed(() => props.disabled || props.loading)
const stateText = computed(() => (props.modelValue ? props.checkedText : props.uncheckedText))

const rootClass = computed(() => [
  'wi-switch',
  `wi-switch--${sizeClass.value}`,
  {
    'wi-switch--disabled': isDisabled.value,
    'wi-switch--invalid': props.invalid,
    'wi-switch--loading': props.loading,
  },
])

function updateValue(event: Event) {
  if (isDisabled.value) return
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label :class="rootClass" :for="resolvedInputId">
    <input
      v-bind="attrs"
      :id="resolvedInputId"
      class="wi-switch__input"
      type="checkbox"
      role="switch"
      :name="name"
      :value="value"
      :checked="modelValue"
      :disabled="isDisabled"
      :required="required"
      :aria-invalid="invalid || undefined"
      :aria-checked="modelValue"
      :aria-busy="loading || undefined"
      @change="updateValue"
    >
    <span class="wi-switch__track" aria-hidden="true">
      <span v-if="stateText" class="wi-switch__text">{{ stateText }}</span>
      <span class="wi-switch__thumb">
        <span v-if="loading" class="wi-switch__spinner" />
      </span>
    </span>
    <span v-if="label || $slots.default" class="wi-switch__label"><slot>{{ label }}</slot></span>
  </label>
</template>
