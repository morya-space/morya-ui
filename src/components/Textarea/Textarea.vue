<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import { useWdConfig } from '../../shared/config'
import { resolveSizeClass } from '../../shared/types'
import type { TextareaProps } from './types'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  rows: 4,
  resize: 'vertical',
  autoResize: false,
  fluid: false,
  disabled: false,
  readonly: false,
  error: false,
  invalid: false,
})
const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()
const config = useWdConfig()
const textareaElement = ref<HTMLTextAreaElement | null>(null)
const textareaId = computed(() => props.id ?? `wd-textarea-${Math.random().toString(36).slice(2, 8)}`)
const isInvalid = computed(() => props.invalid || props.error || Boolean(props.errorMessage))
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))
const resolvedVariant = computed(() => props.variant ?? config.value.inputVariant ?? 'outlined')
const resizeStyle = computed(() => (props.autoResize ? 'none' : props.resize))
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(() => Boolean(props.errorMessage) || (isInvalid.value && Boolean(props.helpText)))

const textareaClass = computed(() => [
  'wd-textarea',
  `wd-textarea--${sizeClass.value}`,
  {
    'wd-textarea--filled': resolvedVariant.value === 'filled',
    'wd-textarea--fluid': props.fluid,
    'wd-textarea--invalid': isInvalid.value,
    'wd-textarea--error': isInvalid.value,
    'wd-textarea--auto-resize': props.autoResize,
  },
])

function resizeToFit() {
  const el = textareaElement.value
  if (!el || !props.autoResize) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  if (props.autoResize) {
    resizeToFit()
  }
}

watch(
  () => props.modelValue,
  async () => {
    if (!props.autoResize) return
    await nextTick()
    resizeToFit()
  },
)
</script>

<template>
  <div class="wd-textarea-field" :class="{ 'wd-textarea-field--fluid': fluid }">
    <label v-if="label" class="wd-textarea-field__label" :for="textareaId">{{ label }}</label>
    <textarea
      ref="textareaElement"
      v-bind="attrs"
      :id="textareaId"
      :class="textareaClass"
      :value="modelValue"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="feedbackText ? `${textareaId}-help` : undefined"
      :style="{ resize: resizeStyle }"
      @input="updateValue"
    />
    <span
      v-if="feedbackText"
      :id="`${textareaId}-help`"
      class="wd-textarea-field__help"
      :class="{ 'wd-textarea-field__help--error': feedbackIsError }"
      :role="feedbackIsError ? 'alert' : undefined"
    >
      {{ feedbackText }}
    </span>
  </div>
</template>
