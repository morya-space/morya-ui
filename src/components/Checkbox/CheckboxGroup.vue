<script setup lang="ts">

import type {CheckboxGroupProps, CheckboxValue} from './types';
import { computed, provide, useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import {   M_CHECKBOX_GROUP_KEY } from './types'
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{ (event: 'update:modelValue', value: CheckboxValue[]): void }>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

function toggle(value: CheckboxValue, checked: boolean) {
  if (props.disabled) return
  const current = props.modelValue ?? []
  if (checked) {
    if (current.includes(value)) return
    emit('update:modelValue', [...current, value])
    return
  }
  emit('update:modelValue', current.filter((item) => item !== value))
}

provide(M_CHECKBOX_GROUP_KEY, {
  modelValue: computed(() => props.modelValue ?? []),
  name: computed(() => props.name),
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
  invalid: computed(() => props.invalid),
  toggle,
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="m-checkbox-group"
    role="group"
    :aria-label="label"
    :class="{ 'm-checkbox-group--disabled': disabled, 'm-checkbox-group--invalid': invalid }"
  >
    <slot />
  </div>
</template>
