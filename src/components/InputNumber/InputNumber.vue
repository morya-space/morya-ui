<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useWiLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import type { InputNumberProps } from './types'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: null,
  step: 1,
  disabled: false,
  invalid: false,
  fluid: false,
  showButtons: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: number | null): void }>()

const locale = useWiLocale()
const inputId = computed(() => props.id ?? `wi-inputnumber-${Math.random().toString(36).slice(2, 8)}`)
const sizeClass = useConfiguredSize('InputNumber', () => props.size)

const rootClass = computed(() => [
  'wi-inputnumber',
  `wi-inputnumber--${sizeClass.value}`,
  {
    'wi-inputnumber--fluid': props.fluid,
    'wi-inputnumber--invalid': props.invalid,
    'wi-inputnumber--disabled': props.disabled,
    'wi-inputnumber--buttons': props.showButtons,
  },
])

function clamp(value: number): number {
  let next = value
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

function updateFromInput(event: Event) {
  if (props.disabled) return
  emit('update:modelValue', parseInput((event.target as HTMLInputElement).value))
}

function stepBy(direction: 1 | -1) {
  if (props.disabled) return
  const base = props.modelValue ?? props.min ?? 0
  emit('update:modelValue', clamp(base + direction * props.step))
}
</script>

<template>
  <div class="wi-inputnumber-field" :class="{ 'wi-inputnumber-field--fluid': fluid }">
    <label v-if="label" class="wi-inputnumber-field__label" :for="inputId">{{ label }}</label>
    <div :class="rootClass">
      <button
        v-if="showButtons"
        class="wi-inputnumber__button wi-inputnumber__button--decrement"
        type="button"
        :aria-label="locale.decrease"
        :disabled="disabled || (min != null && modelValue != null && modelValue <= min)"
        @click="stepBy(-1)"
      >
        −
      </button>
      <input
        v-bind="attrs"
        :id="inputId"
        class="wi-inputnumber__input"
        type="number"
        :value="modelValue ?? ''"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :aria-invalid="invalid || undefined"
        @input="updateFromInput"
      />
      <button
        v-if="showButtons"
        class="wi-inputnumber__button wi-inputnumber__button--increment"
        type="button"
        :aria-label="locale.increase"
        :disabled="disabled || (max != null && modelValue != null && modelValue >= max)"
        @click="stepBy(1)"
      >
        +
      </button>
    </div>
  </div>
</template>
