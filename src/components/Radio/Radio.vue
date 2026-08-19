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
const inputId = computed(() => props.id ?? `wd-radio-${Math.random().toString(36).slice(2, 8)}`)
const isChecked = computed(() => props.modelValue === props.value)

function updateValue(event: Event) {
  if (!props.disabled && (event.target as HTMLInputElement).checked) emit('update:modelValue', props.value)
}
</script>

<template>
  <label
    class="wd-radio"
    :class="{ 'wd-radio--disabled': disabled, 'wd-radio--invalid': invalid }"
    :for="inputId"
  >
    <input
      v-bind="attrs"
      :id="inputId"
      class="wd-radio__input"
      type="radio"
      :name="name"
      :value="String(value)"
      :checked="isChecked"
      :disabled="disabled"
      :required="required"
      :aria-invalid="invalid || undefined"
      @change="updateValue"
    />
    <span class="wd-radio__control" aria-hidden="true" />
    <span v-if="label || $slots.default" class="wd-radio__label"><slot>{{ label }}</slot></span>
  </label>
</template>
