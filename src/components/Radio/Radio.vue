<script setup lang="ts">
import type {RadioProps} from './types';
import { computed, inject, useAttrs } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { useRdId } from '../../shared/useRdId'
import {  RD_RADIO_GROUP_KEY } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RadioProps>(), {
  invalid: false,
  disabled: false,
  required: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: string | number | boolean): void }>()
const attrs = useAttrs()
const group = inject(RD_RADIO_GROUP_KEY, null)
const autoInputId = useRdId('rd-radio')
const inputId = computed(() => props.id ?? autoInputId)
const sizeClass = useConfiguredSize('Radio', () => props.size ?? group?.size.value)
const isDisabled = computed(() => props.disabled || Boolean(group?.disabled.value))
const isInvalid = computed(() => props.invalid || Boolean(group?.invalid.value))
const inputName = computed(() => props.name ?? group?.name.value)
const currentValue = computed(() => (group ? group.modelValue.value : props.modelValue))
const isChecked = computed(() => currentValue.value === props.value)

const rootClass = computed(() => [
  'rd-radio',
  `rd-radio--${sizeClass.value}`,
  {
    'rd-radio--disabled': isDisabled.value,
    'rd-radio--invalid': isInvalid.value,
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
      class="rd-radio__input"
      type="radio"
      :name="inputName"
      :value="String(value)"
      :checked="isChecked"
      :disabled="isDisabled"
      :required="required"
      :aria-invalid="isInvalid || undefined"
      @change="updateValue"
    >
    <span class="rd-radio__control" aria-hidden="true" />
    <span v-if="label || $slots.default" class="rd-radio__label"><slot>{{ label }}</slot></span>
  </label>
</template>
