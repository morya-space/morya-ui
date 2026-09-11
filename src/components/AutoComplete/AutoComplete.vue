<script setup lang="ts">
import type { AutoCompleteOption, AutoCompleteProps, AutoCompleteSuggestion } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize, useMConfig } from '../../shared/config'
import { useFieldParts } from '../../shared/useComponentAttrs'
import { useMId } from '../../shared/useMId'
import { useFieldFeedback } from '../../shared/useFieldFeedback'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AutoCompleteProps>(), {
  modelValue: '',
  suggestions: () => [],
  dropdown: false,
  disabled: false,
  invalid: false,
  placeholder: '',
  loading: false,
  clearable: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'complete', query: string): void
  (event: 'clear'): void
}>()

const attrs = useAttrs()
const { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt)
const config = useMConfig()
const locale = useMLocale()
const sizeClass = useConfiguredSize('AutoComplete', () => props.size)
const autoFieldId = useMId('m-autocomplete')
const fieldId = computed(() => props.id ?? autoFieldId)
const { isInvalid, feedbackText, feedbackIsError } = useFieldFeedback(props)
const resolvedEmptyMessage = computed(() => props.emptyMessage ?? locale.value.emptyOptions)
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const highlight = ref(-1)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

function normalize(item: AutoCompleteSuggestion): AutoCompleteOption {
  if (typeof item === 'string') return { label: item, value: item }
  return item
}

const options = computed(() => props.suggestions.map(normalize))

const filtered = computed(() => {
  const query = (props.modelValue ?? '').trim().toLowerCase()
  if (!query) return options.value
  return options.value.filter(
    (item) =>
      item.label.toLowerCase().includes(query) || item.value.toLowerCase().includes(query),
  )
})

const showClear = computed(() => props.clearable && Boolean(props.modelValue) && !props.disabled)

const rootClass = computed(() => [
  'm-autocomplete',
  `m-autocomplete--${sizeClass.value}`,
  {
    'm-autocomplete--disabled': props.disabled,
    'm-autocomplete--open': open.value,
    'm-autocomplete--loading': props.loading,
    'm-autocomplete--invalid': isInvalid.value,
  },
])

function updatePanelPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  const width = `${rect.width}px`
  panelStyle.value = computeFloatingOverlayStyle(rect, 'bottom-start', { minWidth: width, width })
}

function requestComplete(query: string) {
  emit('complete', query)
  open.value = true
  highlight.value = filtered.value.length ? 0 : -1
  void nextTick(() => updatePanelPosition())
}

function onInput(event: Event) {
  if (props.disabled) return
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  requestComplete(value)
}

function select(item: AutoCompleteOption) {
  if (props.disabled) return
  emit('update:modelValue', item.value)
  open.value = false
}

function clear() {
  if (props.disabled) return
  emit('update:modelValue', '')
  emit('clear')
  requestComplete('')
}

function toggleDropdown() {
  if (props.disabled) return
  if (open.value) {
    open.value = false
    return
  }
  requestComplete(props.modelValue ?? '')
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value && (event.key === 'ArrowDown' || event.key === 'Enter')) {
    requestComplete(props.modelValue ?? '')
    return
  }
  if (!open.value) return
  if (event.key === 'Escape') {
    open.value = false
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const length = filtered.value.length
    if (!length) return
    const direction = event.key === 'ArrowDown' ? 1 : -1
    highlight.value = (highlight.value + direction + length) % length
  }
  if (event.key === 'Enter' && highlight.value >= 0) {
    event.preventDefault()
    const item = filtered.value[highlight.value]
    if (item != null) select(item)
  }
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || panel.value?.contains(target)) return
  open.value = false
}

function onViewportChange() {
  if (open.value) updatePanelPosition()
}

watch(open, async (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onDocumentClick)
    if (teleported.value) {
      window.addEventListener('resize', onViewportChange)
      window.addEventListener('scroll', onViewportChange, true)
    }
    await nextTick()
    updatePanelPosition()
  } else {
    document.removeEventListener('click', onDocumentClick)
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

watch(filtered, (items) => {
  if (!items.length) highlight.value = -1
  else if (highlight.value >= items.length) highlight.value = 0
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})

const panelOpen = computed(() => open.value)
</script>

<template>
  <div ref="root" v-bind="rootAttrs" class="m-select-field">
    <label v-if="label" class="m-select-field__label" :for="fieldId">{{ label }}</label>
    <div :class="rootClass">
      <div ref="trigger" class="m-autocomplete__control">
        <input
          v-bind="controlAttrs"
          :id="fieldId"
          class="m-autocomplete__input"
          type="text"
          role="combobox"
          :value="modelValue"
          :placeholder="placeholder"
          :name="name"
          :autocomplete="autocomplete"
          :autofocus="autofocus || undefined"
          :disabled="disabled"
          :aria-expanded="open"
          :aria-busy="loading || undefined"
          :aria-invalid="isInvalid || undefined"
          :aria-describedby="feedbackText ? `${fieldId}-help` : undefined"
          aria-autocomplete="list"
          @input="onInput"
          @keydown="onKeydown"
          @focus="requestComplete(modelValue ?? '')"
        >
      <span v-if="loading" class="m-autocomplete__spinner" aria-hidden="true" />
      <button
        v-else-if="showClear"
        type="button"
        class="m-autocomplete__clear"
        :aria-label="locale.clearInput"
        @click="clear"
      >
        <MIcon name="close" size="sm" />
      </button>
      <button
        v-if="dropdown"
        type="button"
        class="m-autocomplete__dropdown"
        :aria-label="locale.showSuggestions"
        :disabled="disabled"
        @click="toggleDropdown"
      >
        <MIcon name="chevron-down" size="sm" />
      </button>
    </div>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="m-scale-fade">
        <div
          v-if="panelOpen"
          ref="panel"
          class="m-autocomplete__panel"
          :class="{ 'm-autocomplete__panel--teleported': teleported }"
          :style="teleported ? panelStyle : undefined"
        >
          <MScrollbar
            tag="ul"
            role="listbox"
            class="m-autocomplete__panel-scroll"
            fit-content
            view-class="m-autocomplete__panel-list"
          >
            <li v-if="loading && !filtered.length" class="m-autocomplete__status">
              {{ locale.loading }}
            </li>
            <li v-else-if="!filtered.length" class="m-autocomplete__status">
              <slot name="empty">{{ resolvedEmptyMessage }}</slot>
            </li>
            <li
              v-for="(item, index) in filtered"
              :key="`${item.value}-${index}`"
              class="m-autocomplete__item"
              role="option"
              :class="{ 'm-autocomplete__item--active': index === highlight }"
              :aria-selected="index === highlight"
              @mousedown.prevent="select(item)"
            >
              <slot name="item" :option="item">{{ item.label }}</slot>
            </li>
          </MScrollbar>
        </div>
      </Transition>
    </Teleport>
    </div>
    <span
      v-if="feedbackText"
      :id="`${fieldId}-help`"
      class="m-select-field__help"
      :class="{ 'm-select-field__help--invalid': feedbackIsError }"
      :role="feedbackIsError ? 'alert' : undefined"
    >
      {{ feedbackText }}
    </span>
  </div>
</template>
