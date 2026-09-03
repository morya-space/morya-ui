<script setup lang="ts">
import type { ToggleButtonProps } from './types'
import { computed } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { resolveMenuIcon } from '../../shared/menu'
import WiIcon from '../Icon/Icon.vue'

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
const resolvedIcon = computed(() => resolveMenuIcon(icon.value))

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
    <span v-if="resolvedIcon" class="wi-togglebutton__icon" aria-hidden="true">
      <WiIcon :name="resolvedIcon" size="sm" />
    </span>
    <slot>
      <span class="wi-togglebutton__label">{{ label }}</span>
    </slot>
  </button>
</template>
