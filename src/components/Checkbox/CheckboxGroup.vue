<script setup lang="ts">
import type {CheckboxGroupProps, CheckboxValue} from './types';
import { computed, provide } from 'vue'
import {   WD_CHECKBOX_GROUP_KEY } from './types'

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{ (event: 'update:modelValue', value: CheckboxValue[]): void }>()

function toggle(value: CheckboxValue, checked: boolean) {
  if (props.disabled) return
  const current = props.modelValue ?? []
  if (checked) {
    if (current.includes(value)) return
    emit('update:modelValue', [...current, value])
    return
  }
  emit('update:modelValue', current.filter((item) => item !== value))
}

provide(WD_CHECKBOX_GROUP_KEY, {
  modelValue: computed(() => props.modelValue ?? []),
  name: computed(() => props.name),
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
  invalid: computed(() => props.invalid),
  toggle,
})
</script>

<template>
  <div
    class="wd-checkbox-group"
    role="group"
    :aria-label="label"
    :class="{ 'wd-checkbox-group--disabled': disabled, 'wd-checkbox-group--invalid': invalid }"
  >
    <slot />
  </div>
</template>
