<script setup lang="ts">
import type { InputColorProps } from './types'
import { computed } from 'vue'
import { useWiLocale } from '../../locale'

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
  return /^#[0-9a-f]{6}$/i.test(raw) ? raw : '#000000'
})

function onColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onTextInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function pickSwatch(color: string) {
  if (props.disabled) return
  emit('update:modelValue', color)
}
</script>

<template>
  <div class="wi-inputcolor" :class="{ 'wi-inputcolor--disabled': disabled }">
    <div class="wi-inputcolor__row">
      <input
        :id="id"
        class="wi-inputcolor__swatch"
        type="color"
        :value="hexValue"
        :disabled="disabled"
        :aria-label="locale.selectColor"
        @input="onColorInput"
      >
      <input
        class="wi-inputcolor__text"
        type="text"
        :value="modelValue"
        :disabled="disabled"
        placeholder="#000000"
        spellcheck="false"
        @input="onTextInput"
      >
    </div>
    <div v-if="swatches?.length" class="wi-inputcolor__swatches">
      <button
        v-for="color in swatches"
        :key="color"
        type="button"
        class="wi-inputcolor__preset"
        :style="{ background: color }"
        :disabled="disabled"
        :aria-label="color"
        @click="pickSwatch(color)"
      />
    </div>
  </div>
</template>
