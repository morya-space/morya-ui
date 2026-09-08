<script setup lang="ts">
import type { InputColorProps } from './types'
import { computed } from 'vue'
import { useWkLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { useWkId } from '../../shared/useWkId'
import { useFieldFeedback } from '../../shared/useFieldFeedback'

const props = withDefaults(defineProps<InputColorProps>(), {
  modelValue: '#000000',
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
const locale = useWkLocale()
const sizeClass = useConfiguredSize('InputColor', () => props.size)
const autoFieldId = useWkId('wk-inputcolor')
const fieldId = computed(() => props.id ?? autoFieldId)
const { isInvalid } = useFieldFeedback(props)

const hexValue = computed(() => {
  const raw = props.modelValue?.trim() || '#000000'
  return /^#[0-9a-f]{6}$/i.test(raw) ? raw : '#000000'
})

const rootClass = computed(() => [
  'wk-inputcolor',
  `wk-inputcolor--${sizeClass.value}`,
  {
    'wk-inputcolor--disabled': props.disabled,
    'wk-inputcolor--invalid': isInvalid.value,
  },
])

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
  <div class="wk-inputcolor-field">
    <label v-if="label" class="wk-inputcolor-field__label" :for="fieldId">{{ label }}</label>
    <div :class="rootClass">
      <slot name="trigger">
        <div class="wk-inputcolor__row">
          <input
            class="wk-inputcolor__swatch"
            type="color"
            :value="hexValue"
            :disabled="disabled"
            :aria-label="locale.selectColor"
            @input="onColorInput"
          >
          <input
            :id="fieldId"
            class="wk-inputcolor__text"
            type="text"
            :value="modelValue"
            :disabled="disabled"
            placeholder="#000000"
            spellcheck="false"
            :aria-invalid="isInvalid || undefined"
            :aria-label="label ?? locale.colorHexValue"
            @input="onTextInput"
          >
          <div v-if="swatches?.length" class="wk-inputcolor__swatches">
            <button
              v-for="color in swatches"
              :key="color"
              type="button"
              class="wk-inputcolor__preset"
              :style="{ background: color }"
              :disabled="disabled"
              :aria-label="color"
              @click="pickSwatch(color)"
            />
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
