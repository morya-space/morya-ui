<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { RadioProps } from './types'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const props = withDefaults(defineProps<RadioProps>(), {
  invalid: false,
  disabled: false,
  required: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: string | number | boolean): void }>()
const inputId = computed(() => props.id ?? `wi-radio-${Math.random().toString(36).slice(2, 8)}`)
const isChecked = computed(() => props.modelValue === props.value)

function updateValue(event: Event) {
  if (!props.disabled && (event.target as HTMLInputElement).checked) emit('update:modelValue', props.value)
}
</script>

<template>
  <label
    class="wi-radio"
    :class="{ 'wi-radio--disabled': disabled, 'wi-radio--invalid': invalid }"
    :for="inputId"
  >
    <input
      v-bind="attrs"
      :id="inputId"
      class="wi-radio__input"
      type="radio"
      :name="name"
      :value="String(value)"
      :checked="isChecked"
      :disabled="disabled"
      :required="required"
      :aria-invalid="invalid || undefined"
      @change="updateValue"
    />
    <span class="wi-radio__control" aria-hidden="true" />
    <span v-if="label || $slots.default" class="wi-radio__label"><slot>{{ label }}</slot></span>
  </label>
</template>
