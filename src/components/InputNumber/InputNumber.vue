<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { resolveSizeClass } from '../../shared/types'
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

const config = useWdConfig()
const locale = useWdLocale()
const inputId = computed(() => props.id ?? `wd-inputnumber-${Math.random().toString(36).slice(2, 8)}`)
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))

const rootClass = computed(() => [
  'wd-inputnumber',
  `wd-inputnumber--${sizeClass.value}`,
  {
    'wd-inputnumber--fluid': props.fluid,
    'wd-inputnumber--invalid': props.invalid,
    'wd-inputnumber--disabled': props.disabled,
    'wd-inputnumber--buttons': props.showButtons,
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
  <div class="wd-inputnumber-field" :class="{ 'wd-inputnumber-field--fluid': fluid }">
    <label v-if="label" class="wd-inputnumber-field__label" :for="inputId">{{ label }}</label>
    <div :class="rootClass">
      <button
        v-if="showButtons"
        class="wd-inputnumber__button wd-inputnumber__button--decrement"
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
        class="wd-inputnumber__input"
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
        class="wd-inputnumber__button wd-inputnumber__button--increment"
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
