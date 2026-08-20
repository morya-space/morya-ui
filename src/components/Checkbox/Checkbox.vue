<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { CheckboxProps } from './types'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  invalid: false,
  disabled: false,
  required: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>()
const inputId = computed(() => props.id ?? `wi-checkbox-${Math.random().toString(36).slice(2, 8)}`)

function updateValue(event: Event) {
  if (props.disabled) return
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label
    class="wi-checkbox"
    :class="{ 'wi-checkbox--disabled': disabled, 'wi-checkbox--invalid': invalid }"
    :for="inputId"
  >
    <input
      v-bind="attrs"
      :id="inputId"
      class="wi-checkbox__input"
      type="checkbox"
      :name="name"
      :value="value"
      :checked="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="invalid || undefined"
      @change="updateValue"
    />
    <span class="wi-checkbox__control" aria-hidden="true">
      <svg viewBox="0 0 16 16" focusable="false">
        <path d="m3.5 8.5 3 3 6-7" />
      </svg>
    </span>
    <span v-if="label || $slots.default" class="wi-checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>
