<script setup lang="ts">
import type { InputColorProps } from './types'
import { computed } from 'vue'
import { useWdLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { useWdId } from '../../shared/useWdId'
import { useFieldFeedback } from '../../shared/useFieldFeedback'

const props = withDefaults(defineProps<InputColorProps>(), {
  modelValue: '#000000',
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
const locale = useWdLocale()
const sizeClass = useConfiguredSize('InputColor', () => props.size)
const autoFieldId = useWdId('wd-inputcolor')
const fieldId = computed(() => props.id ?? autoFieldId)
const { isInvalid } = useFieldFeedback(props)

const hexValue = computed(() => {
  const raw = props.modelValue?.trim() || '#000000'
  return /^#[0-9a-f]{6}$/i.test(raw) ? raw : '#000000'
})

const rootClass = computed(() => [
  'wd-inputcolor',
  `wd-inputcolor--${sizeClass.value}`,
  {
    'wd-inputcolor--disabled': props.disabled,
    'wd-inputcolor--invalid': isInvalid.value,
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
  <div class="wd-inputcolor-field">
    <label v-if="label" class="wd-inputcolor-field__label" :for="fieldId">{{ label }}</label>
    <div :class="rootClass">
      <slot name="trigger">
        <div class="wd-inputcolor__row">
          <input
            class="wd-inputcolor__swatch"
            type="color"
            :value="hexValue"
            :disabled="disabled"
            :aria-label="locale.selectColor"
            @input="onColorInput"
          >
          <input
            :id="fieldId"
            class="wd-inputcolor__text"
            type="text"
            :value="modelValue"
            :disabled="disabled"
            placeholder="#000000"
            spellcheck="false"
            :aria-invalid="isInvalid || undefined"
            :aria-label="label ?? locale.colorHexValue"
            @input="onTextInput"
          >
          <div v-if="swatches?.length" class="wd-inputcolor__swatches">
            <button
              v-for="color in swatches"
              :key="color"
              type="button"
              class="wd-inputcolor__preset"
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
