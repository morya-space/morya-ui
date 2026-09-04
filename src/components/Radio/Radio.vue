<script setup lang="ts">
import type {RadioProps} from './types';
import { computed, inject, useAttrs } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { useWiId } from '../../shared/useWiId'
import {  WI_RADIO_GROUP_KEY } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RadioProps>(), {
  invalid: false,
  disabled: false,
  required: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: string | number | boolean): void }>()
const attrs = useAttrs()
const group = inject(WI_RADIO_GROUP_KEY, null)
const autoInputId = useWiId('wi-radio')
const inputId = computed(() => props.id ?? autoInputId)
const sizeClass = useConfiguredSize('Radio', () => props.size ?? group?.size.value)
const isDisabled = computed(() => props.disabled || Boolean(group?.disabled.value))
const isInvalid = computed(() => props.invalid || Boolean(group?.invalid.value))
const inputName = computed(() => props.name ?? group?.name.value)
const currentValue = computed(() => (group ? group.modelValue.value : props.modelValue))
const isChecked = computed(() => currentValue.value === props.value)

const rootClass = computed(() => [
  'wi-radio',
  `wi-radio--${sizeClass.value}`,
  {
    'wi-radio--disabled': isDisabled.value,
    'wi-radio--invalid': isInvalid.value,
  },
])

function updateValue(event: Event) {
  if (isDisabled.value || !(event.target as HTMLInputElement).checked) return
  if (group) {
    group.select(props.value)
    return
  }
  emit('update:modelValue', props.value)
}
</script>

<template>
  <label :class="rootClass" :for="inputId">
    <input
      v-bind="attrs"
      :id="inputId"
      class="wi-radio__input"
      type="radio"
      :name="inputName"
      :value="String(value)"
      :checked="isChecked"
      :disabled="isDisabled"
      :required="required"
      :aria-invalid="isInvalid || undefined"
      @change="updateValue"
    >
    <span class="wi-radio__control" aria-hidden="true" />
    <span v-if="label || $slots.default" class="wi-radio__label"><slot>{{ label }}</slot></span>
  </label>
</template>
