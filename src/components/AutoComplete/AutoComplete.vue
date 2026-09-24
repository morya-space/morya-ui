<script setup lang="ts">
import type { AutoCompleteOption, AutoCompleteProps, AutoCompleteSuggestion } from './types'
import type { VirtualScrollerExpose } from '../VirtualScroller/types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize, useMConfig } from '../../shared/config'
import { filterItemsByLabelOrValue } from '../../shared/filterByQuery'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useFieldParts } from '../../shared/useComponentAttrs'
import { useFieldFeedback } from '../../shared/useFieldFeedback'
import { useFloatingViewportSync } from '../../shared/useFloatingViewportSync'
import { useMId } from '../../shared/useMId'
import { useMotionTransition } from '../../theme/useMotionTransition'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import MVirtualScroller from '../VirtualScroller/VirtualScroller.vue'

defineOptions({ inheritAttrs: false })

const VIRTUAL_AUTO_THRESHOLD = 80

const props = withDefaults(defineProps<AutoCompleteProps>(), {
  transition: undefined,
  modelValue: '',
  suggestions: () => [],
  dropdown: false,
  disabled: false,
  invalid: false,
  placeholder: '',
  loading: false,
  clearable: false,
  teleport: true,
  virtual: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'complete', query: string): void
  (event: 'clear'): void
}>()

const attrs = useAttrs()
const { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt)
const config = useMConfig()
const { transitionName, transitionCss } = useMotionTransition({
  role: 'popup',
  local: () => props.transition,
  componentName: 'AutoComplete',
  fallback: 'scale-fade',
})
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

const filtered = computed(() => filterItemsByLabelOrValue(options.value, props.modelValue ?? ''))

const useVirtualMenu = computed(() => {
  if (props.virtual === false) return false
  if (props.virtual === true) return true
  return filtered.value.length >= VIRTUAL_AUTO_THRESHOLD
})
const optionItemSize = computed(() => {
  if (sizeClass.value === 'small') return 28
  if (sizeClass.value === 'large') return 40
  return 34
})
const menuViewportHeight = computed(() =>
  Math.min(240, Math.max(optionItemSize.value * 4, filtered.value.length * optionItemSize.value)),
)
const virtualList = ref<VirtualScrollerExpose | null>(null)

function suggestionAt(item: unknown): AutoCompleteOption {
  return item as AutoCompleteOption
}

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

function requestComplete(query: string, highlightFirst = false) {
  emit('complete', query)
  open.value = true
  highlight.value = highlightFirst && filtered.value.length ? 0 : -1
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
    requestComplete(props.modelValue ?? '', true)
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
    if (highlight.value < 0) {
      highlight.value = event.key === 'ArrowDown' ? 0 : length - 1
    } else {
      const direction = event.key === 'ArrowDown' ? 1 : -1
      highlight.value = (highlight.value + direction + length) % length
    }
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

useFloatingViewportSync(
  () => open.value && teleported.value,
  onViewportChange,
)

watch(highlight, (index) => {
  if (!useVirtualMenu.value || index < 0) return
  virtualList.value?.scrollToIndex(index)
})

watch(open, async (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onDocumentClick)
    await nextTick()
    updatePanelPosition()
  } else {
    document.removeEventListener('click', onDocumentClick)
  }
})

watch(filtered, (items) => {
  if (!items.length) highlight.value = -1
  else if (highlight.value >= items.length) highlight.value = 0
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
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
        <Transition :name="transitionName" :css="transitionCss">
          <div
            v-if="panelOpen"
            ref="panel"
            class="m-autocomplete__panel"
            :class="{ 'm-autocomplete__panel--teleported': teleported }"
            :style="teleported ? panelStyle : undefined"
          >
            <MVirtualScroller
              v-if="useVirtualMenu && filtered.length && !loading"
              ref="virtualList"
              class="m-autocomplete__panel-scroll m-autocomplete__panel-scroll--virtual"
              role="listbox"
              :items="filtered"
              :item-size="optionItemSize"
              :height="menuViewportHeight"
              :buffer="4"
            >
              <template #item="{ item, index }">
                <div
                  class="m-autocomplete__item"
                  role="option"
                  :class="{ 'm-autocomplete__item--active': index === highlight }"
                  :aria-selected="index === highlight"
                  @mouseenter="highlight = index"
                  @mousedown.prevent="select(suggestionAt(item))"
                >
                  <slot name="item" :option="suggestionAt(item)">
                    {{ suggestionAt(item).label }}
                  </slot>
                </div>
              </template>
            </MVirtualScroller>
            <MScrollbar
              v-else
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
                <slot name="empty">
                  {{ resolvedEmptyMessage }}
                </slot>
              </li>
              <li
                v-for="(item, index) in filtered"
                :key="`${item.value}-${index}`"
                class="m-autocomplete__item"
                role="option"
                :class="{ 'm-autocomplete__item--active': index === highlight }"
                :aria-selected="index === highlight"
                @mouseenter="highlight = index"
                @mousedown.prevent="select(item)"
              >
                <slot name="item" :option="item">
                  {{ item.label }}
                </slot>
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
