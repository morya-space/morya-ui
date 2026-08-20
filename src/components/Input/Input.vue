<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { resolveSizeClass } from '../../shared/types'
import type { InputProps } from './types'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const slots = useSlots()
const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  fluid: false,
  disabled: false,
  readonly: false,
  clearable: false,
  showCount: false,
  error: false,
  invalid: false,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
}>()
const config = useWiConfig()
const locale = useWiLocale()
const inputElement = ref<HTMLInputElement | null>(null)
const inputId = computed(() => props.id ?? `wi-input-${Math.random().toString(36).slice(2, 8)}`)
const isInvalid = computed(() => props.invalid || props.error || Boolean(props.errorMessage))
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))
const resolvedVariant = computed(() => props.variant ?? config.value.inputVariant ?? 'outlined')
const charCount = computed(() => props.modelValue.length)
const countText = computed(() =>
  props.maxlength != null ? `${charCount.value} / ${props.maxlength}` : String(charCount.value),
)
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(() => Boolean(props.errorMessage) || (isInvalid.value && Boolean(props.helpText)))
const hasPrefix = computed(() => Boolean(slots.prefix))
const hasSuffix = computed(() => Boolean(slots.suffix) || (props.clearable && Boolean(props.modelValue)))
const describedBy = computed(() => {
  const ids: string[] = []
  if (feedbackText.value) ids.push(`${inputId.value}-help`)
  if (props.showCount) ids.push(`${inputId.value}-count`)
  return ids.length ? ids.join(' ') : undefined
})

const inputClass = computed(() => [
  'wi-input',
  `wi-input--${sizeClass.value}`,
  {
    'wi-input--filled': resolvedVariant.value === 'filled',
    'wi-input--fluid': props.fluid,
    'wi-input--invalid': isInvalid.value,
    'wi-input--error': isInvalid.value,
    'wi-input--has-prefix': hasPrefix.value,
    'wi-input--has-suffix': hasSuffix.value,
  },
])

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function clear() {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', '')
  emit('clear')
  inputElement.value?.focus()
}

function focus() {
  inputElement.value?.focus()
}
defineExpose({ focus })
</script>

<template>
  <div class="wi-input-field" :class="{ 'wi-input-field--fluid': fluid }">
    <label v-if="label" class="wi-input-field__label" :for="inputId">{{ label }}</label>
    <div
      class="wi-input-field__control"
      :class="{
        'wi-input-field__control--clearable': clearable && modelValue,
        'wi-input-field__control--counted': showCount,
        'wi-input-field__control--prefixed': hasPrefix,
        'wi-input-field__control--suffixed': $slots.suffix || (clearable && modelValue),
      }"
    >
      <span v-if="$slots.prefix" class="wi-input__prefix">
        <slot name="prefix" />
      </span>
      <input
        ref="inputElement"
        v-bind="attrs"
        :id="inputId"
        :class="inputClass"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        @input="updateValue"
      />
      <span v-if="$slots.suffix" class="wi-input__suffix">
        <slot name="suffix" />
      </span>
      <button
        v-if="clearable && modelValue"
        class="wi-input__clear"
        type="button"
        :aria-label="locale.clearInput"
        :disabled="disabled || readonly"
        @click="clear"
      >
        ×
      </button>
    </div>
    <div v-if="feedbackText || showCount" class="wi-input-field__meta">
      <span
        v-if="feedbackText"
        :id="`${inputId}-help`"
        class="wi-input-field__help"
        :class="{ 'wi-input-field__help--error': feedbackIsError }"
        :role="feedbackIsError ? 'alert' : undefined"
      >
        {{ feedbackText }}
      </span>
      <span
        v-if="showCount"
        :id="`${inputId}-count`"
        class="wi-input-field__count"
        aria-live="polite"
      >
        {{ countText }}
      </span>
    </div>
  </div>
</template>
