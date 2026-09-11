<script setup lang="ts">
import type { InputColorProps } from './types'
import { computed, useAttrs } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { useFieldParts } from '../../shared/useComponentAttrs'
import { useMId } from '../../shared/useMId'
import { useFieldFeedback } from '../../shared/useFieldFeedback'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputColorProps>(), {
  modelValue: '#000000',
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
const attrs = useAttrs()
const { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt)
const locale = useMLocale()
const sizeClass = useConfiguredSize('InputColor', () => props.size)
const autoFieldId = useMId('m-inputcolor')
const fieldId = computed(() => props.id ?? autoFieldId)
const { isInvalid } = useFieldFeedback(props)

const hexValue = computed(() => {
  const raw = props.modelValue?.trim() || '#000000'
  return /^#[0-9a-f]{6}$/i.test(raw) ? raw : '#000000'
})

const rootClass = computed(() => [
  'm-inputcolor',
  `m-inputcolor--${sizeClass.value}`,
  {
    'm-inputcolor--disabled': props.disabled,
    'm-inputcolor--invalid': isInvalid.value,
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
  <div v-bind="rootAttrs" class="m-inputcolor-field">
    <label v-if="label" class="m-inputcolor-field__label" :for="fieldId">{{ label }}</label>
    <div :class="rootClass">
      <slot name="trigger">
        <div class="m-inputcolor__row">
          <input
            class="m-inputcolor__swatch"
            type="color"
            :value="hexValue"
            :disabled="disabled"
            :aria-label="locale.selectColor"
            @input="onColorInput"
          >
          <input
            v-bind="controlAttrs"
            :id="fieldId"
            class="m-inputcolor__text"
            type="text"
            :value="modelValue"
            :disabled="disabled"
            :placeholder="placeholder ?? '#000000'"
            :name="name"
            :autocomplete="autocomplete"
            :autofocus="autofocus || undefined"
            spellcheck="false"
            :aria-invalid="isInvalid || undefined"
            :aria-label="label ?? locale.colorHexValue"
            @input="onTextInput"
          >
          <div v-if="swatches?.length" class="m-inputcolor__swatches">
            <button
              v-for="color in swatches"
              :key="color"
              type="button"
              class="m-inputcolor__preset"
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
