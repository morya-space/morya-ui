<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWiLocale } from '../../locale'
import type { InputTagsProps } from './types'

const props = withDefaults(defineProps<InputTagsProps>(), {
  modelValue: () => [],
  disabled: false,
  addOnBlur: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string[]): void
}>()

const locale = useWiLocale()
const draft = ref('')
const addPlaceholder = computed(() => props.placeholder ?? locale.value.addTag)

function addTag(raw = draft.value) {
  if (props.disabled) return
  const tag = raw.trim()
  if (!tag) return
  if (props.modelValue.includes(tag)) {
    draft.value = ''
    return
  }
  emit('update:modelValue', [...props.modelValue, tag])
  draft.value = ''
}

function removeTag(index: number) {
  if (props.disabled) return
  const next = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', next)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag()
    return
  }
  if (event.key === 'Backspace' && !draft.value && props.modelValue.length) {
    removeTag(props.modelValue.length - 1)
  }
}

function onBlur() {
  if (props.addOnBlur) addTag()
}
</script>

<template>
  <div class="wi-inputtags" :class="{ 'wi-inputtags--disabled': disabled }">
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
        ×
      </button>
    </span>
    <input
      v-model="draft"
      class="wi-inputtags__input"
      type="text"
      :placeholder="modelValue.length ? '' : addPlaceholder"
      :disabled="disabled"
      @keydown="onKeydown"
      @blur="onBlur"
    />
  </div>
</template>
