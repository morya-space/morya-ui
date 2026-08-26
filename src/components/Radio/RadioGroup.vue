<script setup lang="ts">
import { computed, provide } from 'vue'
import { WI_RADIO_GROUP_KEY, type RadioGroupProps, type RadioValue } from './types'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{ (event: 'update:modelValue', value: RadioValue): void }>()
const fallbackName = `wi-radio-group-${Math.random().toString(36).slice(2, 8)}`

function select(value: RadioValue) {
  if (props.disabled) return
  emit('update:modelValue', value)
}

provide(WI_RADIO_GROUP_KEY, {
  modelValue: computed(() => props.modelValue),
  name: computed(() => props.name ?? fallbackName),
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
  invalid: computed(() => props.invalid),
  select,
})
</script>

<template>
  <div
    class="wi-radio-group"
    role="radiogroup"
    :class="{ 'wi-radio-group--disabled': disabled, 'wi-radio-group--invalid': invalid }"
  >
    <slot />
  </div>
</template>
