<script setup lang="ts">
import { computed } from 'vue'
import { useWiLocale } from '../../locale'
import type { InputColorProps } from './types'

const props = withDefaults(defineProps<InputColorProps>(), {
  modelValue: '#000000',
  disabled: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
const locale = useWiLocale()

const hexValue = computed(() => {
  const raw = props.modelValue?.trim() || '#000000'
  return /^#[0-9a-fA-F]{6}$/.test(raw) ? raw : '#000000'
})

function onColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onTextInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="wi-inputcolor" :class="{ 'wi-inputcolor--disabled': disabled }">
    <input
      class="wi-inputcolor__swatch"
      type="color"
      :id="id"
      :value="hexValue"
      :disabled="disabled"
      :aria-label="locale.selectColor"
      @input="onColorInput"
    />
    <input
      class="wi-inputcolor__text"
      type="text"
      :value="modelValue"
      :disabled="disabled"
      placeholder="#000000"
      spellcheck="false"
      @input="onTextInput"
    />
  </div>
</template>
