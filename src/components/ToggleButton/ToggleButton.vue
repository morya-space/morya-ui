<script setup lang="ts">
import type { ToggleButtonProps } from './types'
import { computed } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { resolveMenuIcon } from '../../shared/menu'
import MIcon from '../Icon/Icon.vue'

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
  'm-togglebutton',
  `m-togglebutton--${sizeClass.value}`,
  {
    'm-togglebutton--checked': props.modelValue,
    'm-togglebutton--disabled': props.disabled,
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
    <span v-if="resolvedIcon" class="m-togglebutton__icon" aria-hidden="true">
      <MIcon :name="resolvedIcon" size="sm" />
    </span>
    <slot>
      <span class="m-togglebutton__label">{{ label }}</span>
    </slot>
  </button>
</template>
