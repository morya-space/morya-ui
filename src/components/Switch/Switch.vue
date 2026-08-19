<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { SwitchProps } from './types'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  invalid: false,
  disabled: false,
  required: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>()
const resolvedInputId = computed(
  () => props.inputId ?? props.id ?? `wd-switch-${Math.random().toString(36).slice(2, 8)}`,
)

function updateValue(event: Event) {
  if (props.disabled) return
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label
    class="wd-switch"
    :class="{ 'wd-switch--disabled': disabled, 'wd-switch--invalid': invalid }"
    :for="resolvedInputId"
  >
    <input
      v-bind="attrs"
      :id="resolvedInputId"
      class="wd-switch__input"
      type="checkbox"
      role="switch"
      :name="name"
      :value="value"
      :checked="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="invalid || undefined"
      :aria-checked="modelValue"
      @change="updateValue"
    />
    <span class="wd-switch__track" aria-hidden="true"><span class="wd-switch__thumb" /></span>
    <span v-if="label || $slots.default" class="wd-switch__label"><slot>{{ label }}</slot></span>
  </label>
</template>
