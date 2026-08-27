<script setup lang="ts">
import type { InplaceProps } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<InplaceProps>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const rootClass = computed(() => [
  'wi-inplace',
  {
    'wi-inplace--active': props.modelValue,
    'wi-inplace--disabled': props.disabled,
  },
])

function activate() {
  if (props.disabled || props.modelValue) return
  emit('update:modelValue', true)
}

function deactivate() {
  if (props.disabled) return
  emit('update:modelValue', false)
}

defineExpose({ activate, deactivate })
</script>

<template>
  <div :class="rootClass">
    <div
      v-if="!modelValue"
      class="wi-inplace__display"
      role="button"
      :tabindex="disabled ? -1 : 0"
      @click="activate"
      @keydown.enter.prevent="activate"
      @keydown.space.prevent="activate"
    >
      <slot name="display" />
    </div>
    <div v-else class="wi-inplace__content">
      <slot name="content" :close="deactivate" />
    </div>
  </div>
</template>
