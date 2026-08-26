<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { WI_CHECKBOX_GROUP_KEY, type CheckboxProps } from './types'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  invalid: false,
  disabled: false,
  required: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>()
const group = inject(WI_CHECKBOX_GROUP_KEY, null)
const inputId = computed(() => props.id ?? `wi-checkbox-${Math.random().toString(36).slice(2, 8)}`)
const sizeClass = useConfiguredSize('Checkbox', () => props.size ?? group?.size.value)
const isDisabled = computed(() => props.disabled || Boolean(group?.disabled.value))
const isInvalid = computed(() => props.invalid || Boolean(group?.invalid.value))
const inputName = computed(() => props.name ?? group?.name.value)
const isGrouped = computed(() => group != null && props.value !== undefined)
const isChecked = computed(() => {
  if (isGrouped.value) return group!.modelValue.value.includes(props.value!)
  return props.modelValue
})

const rootClass = computed(() => [
  'wi-checkbox',
  `wi-checkbox--${sizeClass.value}`,
  {
    'wi-checkbox--disabled': isDisabled.value,
    'wi-checkbox--invalid': isInvalid.value,
    'wi-checkbox--indeterminate': props.indeterminate,
  },
])

function updateValue(event: Event) {
  if (isDisabled.value) return
  const checked = (event.target as HTMLInputElement).checked
  if (isGrouped.value) {
    group!.toggle(props.value!, checked)
    return
  }
  emit('update:modelValue', checked)
}
</script>

<template>
  <label :class="rootClass" :for="inputId">
    <input
      v-bind="attrs"
      :id="inputId"
      class="wi-checkbox__input"
      type="checkbox"
      :name="inputName"
      :value="value == null ? undefined : String(value)"
      :checked="isChecked"
      :indeterminate="indeterminate"
      :disabled="isDisabled"
      :required="required"
      :aria-invalid="isInvalid || undefined"
      :aria-checked="indeterminate ? 'mixed' : isChecked"
      @change="updateValue"
    />
    <span class="wi-checkbox__control" aria-hidden="true">
      <svg viewBox="0 0 16 16" focusable="false">
        <path v-if="indeterminate" d="M4 8h8" />
        <path v-else d="m3.5 8.5 3 3 6-7" />
      </svg>
    </span>
    <span v-if="label || $slots.default" class="wi-checkbox__label"><slot>{{ label }}</slot></span>
  </label>
</template>
