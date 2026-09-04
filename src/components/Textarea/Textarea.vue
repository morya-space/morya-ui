<script setup lang="ts">
import type { WiTextareaAutosize } from '../../shared/componentDefaults'
import type { TextareaProps } from './types'
import { computed, nextTick, onMounted, ref, useAttrs, watch } from 'vue'
import { useWiLocale } from '../../locale'
import {
  useComponentDefaults,
  useConfiguredSize,
  useConfiguredVariant,
} from '../../shared/config'
import { useWiId } from '../../shared/useWiId'
import WiIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  resize: 'vertical',
  disabled: false,
  readonly: false,
  invalid: false,
  clearable: undefined,
  showCount: undefined,
  fluid: undefined,
  autosize: undefined,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
  (event: 'change', value: string): void
}>()
const attrs = useAttrs()
const defaults = useComponentDefaults('Textarea')
const locale = useWiLocale()
const textareaElement = ref<HTMLTextAreaElement | null>(null)
const autoTextareaId = useWiId('wi-textarea')
const textareaId = computed(() => props.id ?? autoTextareaId)
const isInvalid = computed(() => props.invalid || Boolean(props.errorMessage))
const sizeClass = useConfiguredSize('Textarea', () => props.size)
const resolvedVariant = useConfiguredVariant('Textarea', () => props.variant)
const resolvedFluid = computed(() => props.fluid ?? (defaults.value.fluid as boolean | undefined) ?? false)
const resolvedClearable = computed(() => props.clearable ?? (defaults.value.clearable as boolean | undefined) ?? false)
const resolvedShowCount = computed(() => props.showCount ?? (defaults.value.showCount as boolean | undefined) ?? false)

const resolvedAutosize = computed<WiTextareaAutosize | false>(() => {
  if (props.autosize !== undefined && props.autosize !== false) return props.autosize
  const fromDefaults = defaults.value.autosize as WiTextareaAutosize | undefined
  if (fromDefaults !== undefined && fromDefaults !== false) return fromDefaults
  return false
})

const resolvedRows = computed(() => {
  const spec = resolvedAutosize.value
  if (typeof spec === 'object' && spec.minRows != null) return spec.minRows
  return props.rows ?? (defaults.value.rows as number | undefined) ?? 4
})

const isAutosize = computed(() => Boolean(resolvedAutosize.value))
const resizeStyle = computed(() => (isAutosize.value ? 'none' : props.resize))
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(() => Boolean(props.errorMessage) || (isInvalid.value && Boolean(props.helpText)))
const charCount = computed(() => (props.modelValue ?? '').length)
const countText = computed(() =>
  props.maxlength != null ? `${charCount.value} / ${props.maxlength}` : String(charCount.value),
)
const showClear = computed(() => resolvedClearable.value && Boolean(props.modelValue))
const describedBy = computed(() => {
  const ids: string[] = []
  if (feedbackText.value) ids.push(`${textareaId.value}-help`)
  if (resolvedShowCount.value) ids.push(`${textareaId.value}-count`)
  return ids.length ? ids.join(' ') : undefined
})

const textareaClass = computed(() => [
  'wi-textarea',
  `wi-textarea--${sizeClass.value}`,
  {
    'wi-textarea--filled': resolvedVariant.value === 'filled',
    'wi-textarea--fluid': resolvedFluid.value,
    'wi-textarea--invalid': isInvalid.value,
    'wi-textarea--auto-resize': isAutosize.value,
  },
])

function resizeToFit() {
  const el = textareaElement.value
  const spec = resolvedAutosize.value
  if (!el || !spec) return
  el.style.height = 'auto'
  const contentHeight = el.scrollHeight
  if (typeof spec === 'object') {
    const cs = window.getComputedStyle(el)
    const lineHeight = Number.parseFloat(cs.lineHeight) || 20
    const padding = Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom)
    const minHeight = spec.minRows != null ? padding + lineHeight * spec.minRows : undefined
    const maxHeight = spec.maxRows != null ? padding + lineHeight * spec.maxRows : undefined
    let height = contentHeight
    if (minHeight != null) {
      height = Math.max(height, minHeight)
      el.style.minHeight = `${minHeight}px`
    }
    if (maxHeight != null) {
      height = Math.min(height, maxHeight)
      el.style.maxHeight = `${maxHeight}px`
      el.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden'
    }
    el.style.height = `${height}px`
    return
  }
  el.style.height = `${contentHeight}px`
}

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  if (isAutosize.value) resizeToFit()
}

function clear() {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', '')
  emit('clear')
  textareaElement.value?.focus()
  if (isAutosize.value) {
    void nextTick(resizeToFit)
  }
}

function focus() {
  textareaElement.value?.focus()
}

function blur() {
  textareaElement.value?.blur()
}

function select() {
  textareaElement.value?.select()
}

defineExpose({ focus, blur, select })

watch(
  () => [props.modelValue, resolvedAutosize.value] as const,
  async () => {
    if (!isAutosize.value) return
    await nextTick()
    resizeToFit()
  },
)

onMounted(() => {
  if (isAutosize.value) resizeToFit()
})
</script>

<template>
  <div class="wi-textarea-field" :class="{ 'wi-textarea-field--fluid': resolvedFluid }">
    <label v-if="label" class="wi-textarea-field__label" :for="textareaId">{{ label }}</label>
    <div
      class="wi-textarea-field__control"
      :class="{ 'wi-textarea-field__control--clearable': showClear }"
    >
      <textarea
        v-bind="attrs"
        :id="textareaId"
        ref="textareaElement"
        :class="textareaClass"
        :value="modelValue"
        :rows="resolvedRows"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        :style="{ resize: resizeStyle }"
        @input="updateValue"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @change="emit('change', ($event.target as HTMLTextAreaElement).value)"
      />
      <button
        v-if="showClear"
        class="wi-textarea__clear"
        type="button"
        :aria-label="locale.clearInput"
        :disabled="disabled || readonly"
        @click="clear"
      >
        <WiIcon name="close" size="sm" />
      </button>
    </div>
    <div v-if="feedbackText || resolvedShowCount" class="wi-textarea-field__meta">
      <span
        v-if="feedbackText"
        :id="`${textareaId}-help`"
        class="wi-textarea-field__help"
        :class="{ 'wi-textarea-field__help--invalid': feedbackIsError }"
        :role="feedbackIsError ? 'alert' : undefined"
      >
        {{ feedbackText }}
      </span>
      <span
        v-if="resolvedShowCount"
        :id="`${textareaId}-count`"
        class="wi-textarea-field__count"
        aria-live="polite"
      >
        {{ countText }}
      </span>
    </div>
  </div>
</template>
