<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { formatLocale, useWiLocale } from '../../locale'
import type { InputOtpProps } from './types'

const props = withDefaults(defineProps<InputOtpProps>(), {
  modelValue: '',
  length: 4,
  disabled: false,
  integerOnly: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const locale = useWiLocale()
const inputs = ref<(HTMLInputElement | null)[]>([])

const chars = computed(() => {
  const value = props.modelValue ?? ''
  return Array.from({ length: props.length }, (_, index) => value[index] ?? '')
})

const rootClass = computed(() => [
  'wi-inputotp',
  { 'wi-inputotp--disabled': props.disabled },
])

function setInputRef(el: unknown, index: number) {
  inputs.value[index] = el instanceof HTMLInputElement ? el : null
}

function emitValue(nextChars: string[]) {
  emit('update:modelValue', nextChars.join('').slice(0, props.length))
}

function isAllowed(char: string): boolean {
  if (!char) return true
  if (props.integerOnly) return /^\d$/.test(char)
  return char.length === 1
}

function onInput(index: number, event: Event) {
  if (props.disabled) return
  const target = event.target as HTMLInputElement
  const raw = target.value
  const char = raw.slice(-1)
  if (raw && !isAllowed(char)) {
    target.value = chars.value[index] ?? ''
    return
  }
  const next = [...chars.value]
  next[index] = char
  emitValue(next)
  if (char && index < props.length - 1) {
    void nextTick(() => inputs.value[index + 1]?.focus())
  }
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (props.disabled) return
  if (event.key === 'Backspace' && !chars.value[index] && index > 0) {
    event.preventDefault()
    const next = [...chars.value]
    next[index - 1] = ''
    emitValue(next)
    void nextTick(() => inputs.value[index - 1]?.focus())
  }
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    inputs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < props.length - 1) {
    event.preventDefault()
    inputs.value[index + 1]?.focus()
  }
}

function onPaste(event: ClipboardEvent) {
  if (props.disabled) return
  event.preventDefault()
  const text = event.clipboardData?.getData('text') ?? ''
  const filtered = [...text].filter((char) => isAllowed(char)).slice(0, props.length)
  const next = Array.from({ length: props.length }, (_, index) => filtered[index] ?? '')
  emitValue(next)
  const focusIndex = Math.min(filtered.length, props.length - 1)
  void nextTick(() => inputs.value[focusIndex]?.focus())
}

watch(
  () => props.length,
  () => {
    inputs.value = Array.from({ length: props.length }, () => null)
  },
  { immediate: true },
)
</script>

<template>
  <div :class="rootClass" role="group" @paste="onPaste">
    <input
      v-for="(char, index) in chars"
      :key="index"
      :ref="(el) => setInputRef(el, index)"
      class="wi-inputotp__input"
      type="text"
      inputmode="text"
      maxlength="1"
      autocomplete="one-time-code"
      :value="char"
      :disabled="disabled"
      :aria-label="formatLocale(locale.otpDigit, { index: index + 1 })"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
    />
  </div>
</template>
