<script setup lang="ts">
import type {RadioGroupProps, RadioValue} from './types';
import { computed, provide } from 'vue'
import { useWdId } from '../../shared/useWdId'
import {   WD_RADIO_GROUP_KEY } from './types'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{ (event: 'update:modelValue', value: RadioValue): void }>()
const fallbackName = useWdId('wd-radio-group')

function select(value: RadioValue) {
  if (props.disabled) return
  emit('update:modelValue', value)
}

provide(WD_RADIO_GROUP_KEY, {
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
    class="wd-radio-group"
    role="radiogroup"
    :aria-label="label"
    :class="{ 'wd-radio-group--disabled': disabled, 'wd-radio-group--invalid': invalid }"
  >
    <slot />
  </div>
</template>
