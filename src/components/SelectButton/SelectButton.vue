<script setup lang="ts">
import type { SelectButtonOption, SelectButtonProps, SelectButtonValue } from './types'
import { computed } from 'vue'
import { useConfiguredSize } from '../../shared/config'

const props = withDefaults(defineProps<SelectButtonProps>(), {
  multiple: false,
  disabled: false,
  invalid: false,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: SelectButtonValue | SelectButtonValue[] | undefined): void
}>()

const sizeClass = useConfiguredSize('SelectButton', () => props.size)

const rootClass = computed(() => [
  'wi-selectbutton',
  `wi-selectbutton--${sizeClass.value}`,
  {
    'wi-selectbutton--disabled': props.disabled,
    'wi-selectbutton--invalid': props.invalid,
  },
])

function isActive(option: SelectButtonOption): boolean {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : []
    return values.includes(option.value)
  }
  return props.modelValue === option.value
}

function select(option: SelectButtonOption) {
  if (props.disabled || option.disabled) return
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = values.indexOf(option.value)
    if (index >= 0) values.splice(index, 1)
    else values.push(option.value)
    emit('update:modelValue', values)
    return
  }
  emit('update:modelValue', option.value)
}
</script>

<template>
  <div :class="rootClass" role="group">
    <button
      v-for="option in options"
      :key="String(option.value)"
      type="button"
      class="wi-selectbutton__button"
      :class="{ 'wi-selectbutton__button--active': isActive(option) }"
      :disabled="disabled || option.disabled"
      :aria-pressed="isActive(option)"
      @click="select(option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
