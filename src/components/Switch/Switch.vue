<script setup lang="ts">
import type { SwitchProps } from './types'
import { computed, onMounted, useAttrs, useSlots } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { useWkId } from '../../shared/useWkId'

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
const slots = useSlots()
const autoInputId = useWkId('wk-switch')
const resolvedInputId = computed(
  () => props.inputId ?? props.id ?? autoInputId,
)
const sizeClass = useConfiguredSize('Switch', () => props.size)
const isDisabled = computed(() => props.disabled || props.loading)
const stateText = computed(() => (props.modelValue ? props.checkedText : props.uncheckedText))

const rootClass = computed(() => [
  'wk-switch',
  `wk-switch--${sizeClass.value}`,
  {
    'wk-switch--disabled': isDisabled.value,
    'wk-switch--invalid': props.invalid,
    'wk-switch--loading': props.loading,
  },
])

function updateValue(event: Event) {
  if (isDisabled.value) return
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}

onMounted(() => {
  if (import.meta.env.DEV && !props.label && !slots.default) {
    console.warn('[WkSwitch] Provide `label` prop or default slot for an accessible name.')
  }
})
</script>

<template>
  <label :class="rootClass" :for="resolvedInputId">
    <input
      v-bind="attrs"
      :id="resolvedInputId"
      class="wk-switch__input"
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
    <span class="wk-switch__track" aria-hidden="true">
      <span v-if="stateText" class="wk-switch__text">{{ stateText }}</span>
      <span class="wk-switch__thumb">
        <span v-if="loading" class="wk-switch__spinner" />
      </span>
    </span>
    <span v-if="label || $slots.default" class="wk-switch__label"><slot>{{ label }}</slot></span>
  </label>
</template>
