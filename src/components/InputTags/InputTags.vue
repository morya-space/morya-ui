<script setup lang="ts">
import type { InputTagsProps } from './types'
import { computed, ref } from 'vue'
import { useWiLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<InputTagsProps>(), {
  modelValue: () => [],
  disabled: false,
  invalid: false,
  addOnBlur: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string[]): void
}>()

const locale = useWiLocale()
const draft = ref('')
const sizeClass = useConfiguredSize('InputTags', () => props.size)
const fieldId = computed(() => props.id ?? `wi-inputtags-${Math.random().toString(36).slice(2, 8)}`)
const addPlaceholder = computed(() => props.placeholder ?? locale.value.addTag)
const separators = computed(() => {
  if (!props.separator) return []
  return Array.isArray(props.separator) ? props.separator : [props.separator]
})
const atMax = computed(() => props.max != null && props.modelValue.length >= props.max)

const rootClass = computed(() => [
  'wi-inputtags',
  `wi-inputtags--${sizeClass.value}`,
  {
    'wi-inputtags--disabled': props.disabled,
    'wi-inputtags--invalid': props.invalid,
  },
])

function addTag(raw = draft.value) {
  if (props.disabled || atMax.value) return
  const tag = raw.trim()
  if (!tag) return
  if (props.modelValue.includes(tag)) {
    draft.value = ''
    return
  }
  emit('update:modelValue', [...props.modelValue, tag])
  draft.value = ''
}

function addMany(raw: string) {
  const parts = separators.value.length
    ? raw.split(new RegExp(`[${separators.value.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}]`))
    : [raw]
  const next = [...props.modelValue]
  for (const part of parts) {
    const tag = part.trim()
    if (!tag || next.includes(tag)) continue
    if (props.max != null && next.length >= props.max) break
    next.push(tag)
  }
  if (next.length !== props.modelValue.length) emit('update:modelValue', next)
  draft.value = ''
}

function removeTag(index: number) {
  if (props.disabled) return
  const next = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', next)
}

function onKeydown(event: KeyboardEvent) {
  if (separators.value.includes(event.key)) {
    event.preventDefault()
    addTag()
    return
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag()
    return
  }
  if (event.key === 'Backspace' && !draft.value && props.modelValue.length) {
    removeTag(props.modelValue.length - 1)
  }
}

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  const hit = separators.value.find((sep) => value.includes(sep))
  if (hit) {
    addMany(value)
    return
  }
  draft.value = value
}

function onBlur() {
  if (props.addOnBlur) addTag()
}
</script>

<template>
  <div class="wi-inputtags-field">
    <label v-if="label" class="wi-inputtags-field__label" :for="fieldId">{{ label }}</label>
    <div :class="rootClass">
      <span
        v-for="(tag, index) in modelValue"
        :key="`${tag}-${index}`"
        class="wi-inputtags__chip"
      >
        {{ tag }}
        <button
          type="button"
          class="wi-inputtags__remove"
          :disabled="disabled"
          :aria-label="locale.removeTag"
          @click="removeTag(index)"
        >
          <WiIcon name="close" size="sm" />
        </button>
      </span>
      <input
        :id="fieldId"
        :value="draft"
        class="wi-inputtags__input"
        type="text"
        :placeholder="modelValue.length ? '' : addPlaceholder"
        :disabled="disabled || atMax"
        :aria-invalid="invalid || undefined"
        :aria-label="label ?? addPlaceholder"
        @input="onInput"
        @keydown="onKeydown"
        @blur="onBlur"
      >
    </div>
  </div>
</template>
