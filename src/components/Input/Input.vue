<script setup lang="ts">
import type { InputProps } from './types'
import { computed, ref, useAttrs, useSlots } from 'vue'
import { useWdLocale } from '../../locale'
import { useComponentDefaults, useConfiguredSize, useConfiguredVariant } from '../../shared/config'
import { useWdId } from '../../shared/useWdId'
import WdIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  invalid: false,
  clearable: undefined,
  showCount: undefined,
  fluid: undefined,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
  (event: 'change', value: string): void
}>()
const attrs = useAttrs()
const slots = useSlots()
const defaults = useComponentDefaults('Input')
const locale = useWdLocale()
const inputElement = ref<HTMLInputElement | null>(null)
const autoInputId = useWdId('wd-input')
const inputId = computed(() => props.id ?? autoInputId)
const isInvalid = computed(() => props.invalid || Boolean(props.errorMessage))
const sizeClass = useConfiguredSize('Input', () => props.size)
const resolvedVariant = useConfiguredVariant('Input', () => props.variant)
const resolvedClearable = computed(() => props.clearable ?? (defaults.value.clearable as boolean | undefined) ?? false)
const resolvedShowCount = computed(() => props.showCount ?? (defaults.value.showCount as boolean | undefined) ?? false)
const resolvedFluid = computed(() => props.fluid ?? (defaults.value.fluid as boolean | undefined) ?? false)
const charCount = computed(() => props.modelValue.length)
const countText = computed(() =>
  props.maxlength != null ? `${charCount.value} / ${props.maxlength}` : String(charCount.value),
)
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(() => Boolean(props.errorMessage) || (isInvalid.value && Boolean(props.helpText)))
const hasPrefix = computed(() => Boolean(slots.prefix))
const hasSuffix = computed(() => Boolean(slots.suffix))
const describedBy = computed(() => {
  const ids: string[] = []
  if (feedbackText.value) ids.push(`${inputId.value}-help`)
  if (resolvedShowCount.value) ids.push(`${inputId.value}-count`)
  return ids.length ? ids.join(' ') : undefined
})

const inputClass = computed(() => [
  'wd-input',
  `wd-input--${sizeClass.value}`,
  {
    'wd-input--filled': resolvedVariant.value === 'filled',
    'wd-input--fluid': resolvedFluid.value,
    'wd-input--invalid': isInvalid.value,
    'wd-input--has-prefix': hasPrefix.value,
    'wd-input--has-suffix': hasSuffix.value,
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

function blur() {
  inputElement.value?.blur()
}

function select() {
  inputElement.value?.select()
}

defineExpose({ focus, blur, select })
</script>

<template>
  <div class="wd-input-field" :class="{ 'wd-input-field--fluid': resolvedFluid }">
    <label v-if="label" class="wd-input-field__label" :for="inputId">{{ label }}</label>
    <div
      class="wd-input-field__control"
      :class="{
        'wd-input-field__control--clearable': resolvedClearable && modelValue,
        'wd-input-field__control--counted': resolvedShowCount,
        'wd-input-field__control--prefixed': hasPrefix,
        'wd-input-field__control--suffixed': Boolean($slots.suffix),
      }"
    >
      <span v-if="$slots.prefix" class="wd-input__prefix">
        <slot name="prefix" />
      </span>
      <input
        v-bind="attrs"
        :id="inputId"
        ref="inputElement"
        :class="inputClass"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        @input="updateValue"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @change="emit('change', ($event.target as HTMLInputElement).value)"
      >
      <span v-if="$slots.suffix" class="wd-input__suffix">
        <slot name="suffix" />
      </span>
      <button
        v-if="resolvedClearable && modelValue"
        class="wd-input__clear"
        type="button"
        :aria-label="locale.clearInput"
        :disabled="disabled || readonly"
        @click="clear"
      >
        <WdIcon name="close" size="sm" />
      </button>
    </div>
    <div v-if="feedbackText || resolvedShowCount" class="wd-input-field__meta">
      <span
        v-if="feedbackText"
        :id="`${inputId}-help`"
        class="wd-input-field__help"
        :class="{ 'wd-input-field__help--invalid': feedbackIsError }"
        :role="feedbackIsError ? 'alert' : undefined"
      >
        {{ feedbackText }}
      </span>
      <span
        v-if="resolvedShowCount"
        :id="`${inputId}-count`"
        class="wd-input-field__count"
        aria-live="polite"
      >
        {{ countText }}
      </span>
    </div>
  </div>
</template>
