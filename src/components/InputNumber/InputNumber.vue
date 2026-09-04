<script setup lang="ts">
import type { InputNumberProps } from './types'
import { computed, ref, useAttrs, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { useWdId } from '../../shared/useWdId'
import { useFieldFeedback } from '../../shared/useFieldFeedback'
import WdIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: null,
  step: 1,
  disabled: false,
  readonly: false,
  invalid: false,
  fluid: false,
  showButtons: false,
  buttonPlacement: 'both',
  clearable: false,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: number | null): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
  (event: 'change', value: number | null): void
}>()
const attrs = useAttrs()
const locale = useWdLocale()
const inputElement = ref<HTMLInputElement | null>(null)
const autoInputId = useWdId('wd-inputnumber')
const inputId = computed(() => props.id ?? autoInputId)
const sizeClass = useConfiguredSize('InputNumber', () => props.size)
const { isInvalid, feedbackText, feedbackIsError } = useFieldFeedback(props)
const showClear = computed(() => props.clearable && props.modelValue != null && !props.disabled)

const rootClass = computed(() => [
  'wd-inputnumber',
  `wd-inputnumber--${sizeClass.value}`,
  {
    'wd-inputnumber--fluid': props.fluid,
    'wd-inputnumber--invalid': isInvalid.value,
    'wd-inputnumber--disabled': props.disabled,
    'wd-inputnumber--buttons': props.showButtons,
    'wd-inputnumber--buttons-right': props.showButtons && props.buttonPlacement === 'right',
  },
])

function applyPrecision(value: number): number {
  if (props.precision == null) return value
  const factor = 10 ** props.precision
  return Math.round(value * factor) / factor
}

function clamp(value: number): number {
  let next = applyPrecision(value)
  if (props.min != null && next < props.min) next = props.min
  if (props.max != null && next > props.max) next = props.max
  return next
}

function parseInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '' || trimmed === '-' || trimmed === '+' || trimmed === '.') return null
  const parsed = Number(trimmed)
  if (Number.isNaN(parsed)) return null
  return clamp(parsed)
}

/** Local string draft while typing; null when the display follows modelValue. */
const draft = ref<string | null>(null)
const displayValue = computed(() =>
  draft.value ?? (props.modelValue == null ? '' : String(props.modelValue)),
)

watch(
  () => props.modelValue,
  (value) => {
    if (draft.value == null) return
    const echoed = value == null ? draft.value.trim() === '' : Number(draft.value) === value
    if (!echoed) draft.value = null
  },
)

function updateFromInput(event: Event) {
  if (props.disabled) return
  const raw = (event.target as HTMLInputElement).value
  draft.value = raw
  const trimmed = raw.trim()
  if (trimmed === '') {
    emit('update:modelValue', null)
    return
  }
  const parsed = Number(trimmed)
  // Trailing '.', 'e', '+', '-' are intermediate states ("1.", "1e-", "-") — keep drafting.
  if (Number.isNaN(parsed) || /[.e+-]$/i.test(trimmed)) return
  emit('update:modelValue', applyPrecision(parsed))
}

/** Parse + clamp + emit the draft; keep the formatted text so uncontrolled usage is stable. */
function commitDraft() {
  if (props.disabled || draft.value == null) return
  const committed = parseInput(draft.value)
  emit('update:modelValue', committed)
  draft.value = committed == null ? '' : String(committed)
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') commitDraft()
}

function stepBy(direction: 1 | -1) {
  if (props.disabled) return
  const base = props.modelValue ?? props.min ?? 0
  draft.value = null
  emit('update:modelValue', clamp(base + direction * props.step))
}

function clear() {
  if (props.disabled) return
  draft.value = null
  emit('update:modelValue', null)
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

function onBlur(event: FocusEvent) {
  commitDraft()
  emit('blur', event)
  emit('change', props.modelValue)
}

defineExpose({ focus, blur, select })
</script>

<template>
  <div class="wd-inputnumber-field" :class="{ 'wd-inputnumber-field--fluid': fluid }">
    <label v-if="label" class="wd-inputnumber-field__label" :for="inputId">{{ label }}</label>
    <div :class="rootClass">
      <button
        v-if="showButtons && buttonPlacement === 'both'"
        class="wd-inputnumber__button wd-inputnumber__button--decrement"
        type="button"
        :aria-label="locale.decrease"
        :disabled="disabled || (min != null && modelValue != null && modelValue <= min)"
        @click="stepBy(-1)"
      >
        <WdIcon name="minus" size="sm" />
      </button>
      <div class="wd-inputnumber__input-wrap">
        <span v-if="$slots.prefix" class="wd-inputnumber__prefix">
          <slot name="prefix" />
        </span>
        <input
          v-bind="attrs"
          :id="inputId"
          ref="inputElement"
          class="wd-inputnumber__input"
          type="text"
          inputmode="decimal"
          :value="displayValue"
          :disabled="disabled"
          :readonly="readonly"
          :aria-invalid="isInvalid || undefined"
          :aria-describedby="feedbackText ? `${inputId}-help` : undefined"
          @input="updateFromInput"
          @focus="emit('focus', $event)"
          @blur="onBlur"
          @keydown="onInputKeydown"
        >
        <span v-if="$slots.suffix" class="wd-inputnumber__suffix">
          <slot name="suffix" />
        </span>
        <button
          v-if="showClear"
          type="button"
          class="wd-inputnumber__clear"
          :aria-label="locale.clearInput"
          @click="clear"
        >
          <WdIcon name="close" size="sm" />
        </button>
      </div>
      <div v-if="showButtons && buttonPlacement === 'right'" class="wd-inputnumber__stack">
        <button
          class="wd-inputnumber__button wd-inputnumber__button--increment"
          type="button"
          :aria-label="locale.increase"
          :disabled="disabled || (max != null && modelValue != null && modelValue >= max)"
          @click="stepBy(1)"
        >
          <WdIcon name="plus" size="sm" />
        </button>
        <button
          class="wd-inputnumber__button wd-inputnumber__button--decrement"
          type="button"
          :aria-label="locale.decrease"
          :disabled="disabled || (min != null && modelValue != null && modelValue <= min)"
          @click="stepBy(-1)"
        >
          <WdIcon name="minus" size="sm" />
        </button>
      </div>
      <button
        v-else-if="showButtons"
        class="wd-inputnumber__button wd-inputnumber__button--increment"
        type="button"
        :aria-label="locale.increase"
        :disabled="disabled || (max != null && modelValue != null && modelValue >= max)"
        @click="stepBy(1)"
      >
        <WdIcon name="plus" size="sm" />
      </button>
    </div>
    <span
      v-if="feedbackText"
      :id="`${inputId}-help`"
      class="wd-inputnumber-field__help"
      :class="{ 'wd-inputnumber-field__help--invalid': feedbackIsError }"
      :role="feedbackIsError ? 'alert' : undefined"
    >
      {{ feedbackText }}
    </span>
  </div>
</template>
