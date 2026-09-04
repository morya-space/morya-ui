<script setup lang="ts">
import type { SwitchProps } from './types'
import { computed, onMounted, useAttrs, useSlots } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { useWdId } from '../../shared/useWdId'

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
const autoInputId = useWdId('wd-switch')
const resolvedInputId = computed(
  () => props.inputId ?? props.id ?? autoInputId,
)
const sizeClass = useConfiguredSize('Switch', () => props.size)
const isDisabled = computed(() => props.disabled || props.loading)
const stateText = computed(() => (props.modelValue ? props.checkedText : props.uncheckedText))

const rootClass = computed(() => [
  'wd-switch',
  `wd-switch--${sizeClass.value}`,
  {
    'wd-switch--disabled': isDisabled.value,
    'wd-switch--invalid': props.invalid,
    'wd-switch--loading': props.loading,
  },
])

function updateValue(event: Event) {
  if (isDisabled.value) return
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}

onMounted(() => {
  if (import.meta.env.DEV && !props.label && !slots.default) {
    console.warn('[WdSwitch] Provide `label` prop or default slot for an accessible name.')
  }
})
</script>

<template>
  <label :class="rootClass" :for="resolvedInputId">
    <input
      v-bind="attrs"
      :id="resolvedInputId"
      class="wd-switch__input"
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
    <span class="wd-switch__track" aria-hidden="true">
      <span v-if="stateText" class="wd-switch__text">{{ stateText }}</span>
      <span class="wd-switch__thumb">
        <span v-if="loading" class="wd-switch__spinner" />
      </span>
    </span>
    <span v-if="label || $slots.default" class="wd-switch__label"><slot>{{ label }}</slot></span>
  </label>
</template>
