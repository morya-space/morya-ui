<script setup lang="ts">
import type { MentionsProps } from './types'
import {
  computed,
  inject,
  nextTick,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { useMLocale } from '../../locale'
import { useComponentDefaults, useConfiguredSize, useConfiguredVariant } from '../../shared/config'
import MIcon from '../Icon/Icon.vue'
import MProgressSpinner from '../ProgressSpinner/ProgressSpinner.vue'
import { useFieldParts } from '../../shared/useComponentAttrs'
import { useMId } from '../../shared/useMId'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import { M_FORM_KEY } from '../Form/context'
import {
  filterMentionOptions,
  getActiveMention,
  normalizeMentionOption,
  resolvePrefixes,
} from './mentionUtils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<MentionsProps>(), {
  modelValue: '',
  options: () => [],
  prefix: '@',
  split: ' ',
  disabled: false,
  readonly: false,
  invalid: false,
  fluid: false,
  clearable: undefined,
  allowClear: undefined,
  loading: false,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'focus', value: FocusEvent): void
  (event: 'blur', value: FocusEvent): void
  (event: 'change', value: string): void
  (event: 'select', option: { value: string; label?: string }): void
}>()
const attrs = useAttrs()
const { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt)
const defaults = useComponentDefaults('Mentions')
const form = inject(M_FORM_KEY, null)
const locale = useMLocale()
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const autoId = useMId('m-mentions')
const fieldId = computed(() => props.id ?? autoId)
const open = ref(false)
const cursor = ref(0)

const isInvalid = computed(
  () => props.invalid || props.status === 'error' || Boolean(props.errorMessage),
)
const isWarning = computed(() => props.status === 'warning' && !isInvalid.value)
const sizeClass = useConfiguredSize('Mentions', () => props.size ?? form?.value.size)
const resolvedVariant = useConfiguredVariant('Mentions', () => props.variant)
const resolvedFluid = computed(() => props.fluid ?? (defaults.value.fluid as boolean | undefined) ?? false)
const resolvedRows = computed(() => props.rows ?? (defaults.value.rows as number | undefined) ?? 3)
const showClear = computed(
  () =>
    (props.clearable
      ?? props.allowClear
      ?? (defaults.value.clearable as boolean | undefined)
      ?? (defaults.value.allowClear as boolean | undefined)
      ?? false)
    && Boolean(props.modelValue)
    && !props.disabled
    && !props.readonly,
)
const panelOpen = computed(() => open.value && Boolean(activeMention.value))
const prefixList = computed(() => resolvePrefixes(props.prefix))
const splitChar = computed(() => props.split ?? ' ')
const normalizedOptions = computed(() => props.options.map(normalizeMentionOption))

const activeMention = computed(() =>
  getActiveMention(props.modelValue ?? '', cursor.value, prefixList.value, splitChar.value),
)

const suggestions = computed(() => {
  if (!activeMention.value) return []
  return filterMentionOptions(normalizedOptions.value, activeMention.value.query)
})

const resolvedEmptyMessage = computed(() => props.emptyMessage ?? locale.value.emptyOptions)
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(() => Boolean(props.errorMessage) || (isInvalid.value && Boolean(props.helpText)))
const describedBy = computed(() => (feedbackText.value ? `${fieldId.value}-help` : undefined))

const rootClass = computed(() => [
  'm-mentions',
  `m-mentions--${sizeClass.value}`,
  {
    'm-mentions--disabled': props.disabled,
    'm-mentions--open': open.value,
    'm-mentions--clearable': showClear.value,
    'm-mentions--loading': props.loading,
    'm-mentions--fluid': resolvedFluid.value,
    'm-mentions--invalid': isInvalid.value,
    'm-mentions--warning': isWarning.value,
  },
])

const textareaClass = computed(() => [
  'm-mentions__textarea',
  {
    'm-mentions__textarea--filled': resolvedVariant.value === 'filled',
  },
])

const listId = computed(() => `${fieldId.value}-suggestions`)

const keyboard = useMenuKeyboard({
  itemCount: () => suggestions.value.length,
  orientation: 'vertical',
  enabled: () => open.value && suggestions.value.length > 0,
  onActivate: (index) => {
    const option = suggestions.value[index]
    if (option) applyMention(option)
  },
  onEscape: () => {
    open.value = false
    keyboard.reset()
  },
})

watch(suggestions, (list) => {
  if (props.loading) {
    open.value = Boolean(activeMention.value)
    return
  }
  open.value = Boolean(activeMention.value && list.length > 0)
  if (!open.value) keyboard.reset()
  else if (list.length) keyboard.moveFirst()
})

watch(() => props.loading, (isLoading) => {
  if (isLoading && activeMention.value) open.value = true
})

function syncCursor() {
  cursor.value = textareaRef.value?.selectionStart ?? 0
}

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  cursor.value = target.selectionStart ?? target.value.length
  emit('update:modelValue', target.value)
  if (activeMention.value && suggestions.value.length) open.value = true
  else open.value = false
}

function applyMention(option: { value: string; label?: string }) {
  const mention = activeMention.value
  if (!mention) return
  const text = props.modelValue ?? ''
  const insert = `${mention.prefix}${option.value}${splitChar.value}`
  const next = text.slice(0, mention.start) + insert + text.slice(cursor.value)
  emit('update:modelValue', next)
  emit('select', option)
  open.value = false
  keyboard.reset()
  const nextCursor = mention.start + insert.length
  void nextTick(() => {
    const el = textareaRef.value
    if (!el) return
    el.focus()
    el.setSelectionRange(nextCursor, nextCursor)
    cursor.value = nextCursor
  })
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value || !suggestions.value.length) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === 'Escape') {
    keyboard.onKeydown(event)
    if (event.key === 'Enter') event.preventDefault()
  }
}

function onSuggestionClick(index: number) {
  const option = suggestions.value[index]
  if (option) applyMention(option)
}

function onFocus(event: FocusEvent) {
  syncCursor()
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  window.setTimeout(() => {
    open.value = false
    keyboard.reset()
  }, 120)
  emit('blur', event)
}

function onChange(event: Event) {
  emit('change', (event.target as HTMLTextAreaElement).value)
}

function clearValue() {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', '')
  open.value = false
  keyboard.reset()
  void nextTick(() => textareaRef.value?.focus())
}
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass">
    <div class="m-mentions__control" :class="{ 'm-mentions__control--clearable': showClear }">
      <textarea
        v-bind="controlAttrs"
        :id="fieldId"
        ref="textareaRef"
        :class="textareaClass"
        :value="modelValue"
        :rows="resolvedRows"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="describedBy"
        :aria-expanded="panelOpen"
        :aria-busy="loading || undefined"
        :aria-controls="panelOpen ? listId : undefined"
        :aria-autocomplete="open ? 'list' : undefined"
        role="combobox"
        autocomplete="off"
        @input="onInput"
        @keydown="onKeydown"
        @keyup="syncCursor"
        @click="syncCursor"
        @focus="onFocus"
        @blur="onBlur"
        @change="onChange"
      />
      <button
        v-if="showClear"
        type="button"
        class="m-mentions__clear"
        :aria-label="locale.clearInput"
        @mousedown.prevent
        @click="clearValue"
      >
        <MIcon name="close" size="sm" />
      </button>
      <div
        v-if="panelOpen && loading"
        :id="listId"
        class="m-mentions__dropdown m-mentions__dropdown--loading"
        role="listbox"
        aria-busy="true"
        aria-label="Suggestions"
      >
        <MProgressSpinner size="small" />
      </div>
      <ul
        v-else-if="panelOpen && suggestions.length"
        :id="listId"
        class="m-mentions__dropdown"
        role="listbox"
        aria-label="Suggestions"
      >
        <li
          v-for="(option, index) in suggestions"
          :key="option.value"
          role="option"
          class="m-mentions__option"
          :class="{ 'm-mentions__option--active': keyboard.activeIndex.value === index }"
          :aria-selected="keyboard.activeIndex.value === index"
          @mousedown.prevent="onSuggestionClick(index)"
        >
          <span class="m-mentions__option-value">{{ option.value }}</span>
          <span v-if="option.label !== option.value" class="m-mentions__option-label">{{ option.label }}</span>
        </li>
      </ul>
      <p v-else-if="panelOpen && activeMention && !loading && !suggestions.length" class="m-mentions__empty" role="status">
        {{ resolvedEmptyMessage }}
      </p>
    </div>
    <p
      v-if="feedbackText"
      :id="`${fieldId}-help`"
      class="m-mentions__feedback"
      :class="{ 'm-mentions__feedback--error': feedbackIsError }"
      role="alert"
    >
      {{ feedbackText }}
    </p>
  </div>
</template>
