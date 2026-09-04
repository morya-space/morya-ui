<script setup lang="ts">
import type { InputOtpProps } from './types'
import { computed, nextTick, ref, watch } from 'vue'
import { formatLocale, useWdLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'

const props = withDefaults(defineProps<InputOtpProps>(), {
  modelValue: '',
  length: 4,
  disabled: false,
  invalid: false,
  integerOnly: false,
  mask: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const locale = useWdLocale()
const inputs = ref<(HTMLInputElement | null)[]>([])
const sizeClass = useConfiguredSize('InputOtp', () => props.size)

const chars = computed(() => {
  const value = props.modelValue ?? ''
  return Array.from({ length: props.length }, (_, index) => value[index] ?? '')
})

const rootClass = computed(() => [
  'wd-inputotp',
  `wd-inputotp--${sizeClass.value}`,
  {
    'wd-inputotp--disabled': props.disabled,
    'wd-inputotp--mask': props.mask,
    'wd-inputotp--invalid': props.invalid,
  },
])

const rootStyle = computed(() => {
  if (props.gap == null) return undefined
  const gap = typeof props.gap === 'number' ? `${props.gap}px` : props.gap
  return { '--wd-inputotp-gap': gap }
})

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
    inputs.value = new Array<HTMLInputElement | null>(props.length).fill(null)
  },
  { immediate: true },
)
</script>

<template>
  <div :class="rootClass" :style="rootStyle" role="group" :aria-label="label ?? locale.otpGroup" @paste="onPaste">
    <input
      v-for="(char, index) in chars"
      :key="index"
      :ref="(el) => setInputRef(el, index)"
      class="wd-inputotp__input"
      :type="mask ? 'password' : 'text'"
      inputmode="text"
      maxlength="1"
      autocomplete="one-time-code"
      :value="char"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :aria-label="formatLocale(locale.otpDigit, { index: index + 1 })"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
    >
  </div>
</template>
