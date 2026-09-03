<script setup lang="ts">
import type { InputNumberProps } from './types'
import { computed, ref, useAttrs, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import WiIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: null,
  step: 1,
  disabled: false,
  invalid: false,
  fluid: false,
  showButtons: false,
  buttonPlacement: 'both',
  clearable: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: number | null): void }>()
const attrs = useAttrs()
const locale = useWiLocale()
const inputId = computed(() => props.id ?? `wi-inputnumber-${Math.random().toString(36).slice(2, 8)}`)
const sizeClass = useConfiguredSize('InputNumber', () => props.size)
const showClear = computed(() => props.clearable && props.modelValue != null && !props.disabled)

const rootClass = computed(() => [
  'wi-inputnumber',
  `wi-inputnumber--${sizeClass.value}`,
  {
    'wi-inputnumber--fluid': props.fluid,
    'wi-inputnumber--invalid': props.invalid,
    'wi-inputnumber--disabled': props.disabled,
    'wi-inputnumber--buttons': props.showButtons,
    'wi-inputnumber--buttons-right': props.showButtons && props.buttonPlacement === 'right',
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
</script>

<template>
  <div class="wi-inputnumber-field" :class="{ 'wi-inputnumber-field--fluid': fluid }">
    <label v-if="label" class="wi-inputnumber-field__label" :for="inputId">{{ label }}</label>
    <div :class="rootClass">
      <button
        v-if="showButtons && buttonPlacement === 'both'"
        class="wi-inputnumber__button wi-inputnumber__button--decrement"
        type="button"
        :aria-label="locale.decrease"
        :disabled="disabled || (min != null && modelValue != null && modelValue <= min)"
        @click="stepBy(-1)"
      >
        <WiIcon name="minus" size="sm" />
      </button>
      <input
        v-bind="attrs"
        :id="inputId"
        class="wi-inputnumber__input"
        type="text"
        inputmode="decimal"
        :value="displayValue"
        :disabled="disabled"
        :aria-invalid="invalid || undefined"
        @input="updateFromInput"
        @blur="commitDraft"
        @keydown="onInputKeydown"
      >
      <button
        v-if="showClear"
        type="button"
        class="wi-inputnumber__clear"
        :aria-label="locale.clearInput"
        @click="clear"
      >
        <WiIcon name="close" size="sm" />
      </button>
      <div v-if="showButtons && buttonPlacement === 'right'" class="wi-inputnumber__stack">
        <button
          class="wi-inputnumber__button wi-inputnumber__button--increment"
          type="button"
          :aria-label="locale.increase"
          :disabled="disabled || (max != null && modelValue != null && modelValue >= max)"
          @click="stepBy(1)"
        >
          <WiIcon name="plus" size="sm" />
        </button>
        <button
          class="wi-inputnumber__button wi-inputnumber__button--decrement"
          type="button"
          :aria-label="locale.decrease"
          :disabled="disabled || (min != null && modelValue != null && modelValue <= min)"
          @click="stepBy(-1)"
        >
          <WiIcon name="minus" size="sm" />
        </button>
      </div>
      <button
        v-else-if="showButtons"
        class="wi-inputnumber__button wi-inputnumber__button--increment"
        type="button"
        :aria-label="locale.increase"
        :disabled="disabled || (max != null && modelValue != null && modelValue >= max)"
        @click="stepBy(1)"
      >
        <WiIcon name="plus" size="sm" />
      </button>
    </div>
  </div>
</template>
