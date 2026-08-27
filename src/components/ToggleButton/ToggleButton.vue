<script setup lang="ts">
import type { ToggleButtonProps } from './types'
import { computed } from 'vue'
import { useConfiguredSize } from '../../shared/config'

const props = withDefaults(defineProps<ToggleButtonProps>(), {
  modelValue: false,
  onLabel: 'On',
  offLabel: 'Off',
  disabled: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const sizeClass = useConfiguredSize('ToggleButton', () => props.size)

const rootClass = computed(() => [
  'wi-togglebutton',
  `wi-togglebutton--${sizeClass.value}`,
  {
    'wi-togglebutton--checked': props.modelValue,
    'wi-togglebutton--disabled': props.disabled,
  },
])

const label = computed(() => (props.modelValue ? props.onLabel : props.offLabel))
const icon = computed(() => (props.modelValue ? props.onIcon : props.offIcon))

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    type="button"
    :class="rootClass"
    :disabled="disabled"
    :aria-pressed="modelValue"
    @click="toggle"
  >
    <span v-if="icon" class="wi-togglebutton__icon" aria-hidden="true">{{ icon }}</span>
    <span class="wi-togglebutton__label">{{ label }}</span>
  </button>
</template>
