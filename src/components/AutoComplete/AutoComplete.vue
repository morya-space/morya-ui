<script setup lang="ts">
import type { AutoCompleteOption, AutoCompleteProps, AutoCompleteSuggestion } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useConfiguredSize, useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<AutoCompleteProps>(), {
  modelValue: '',
  suggestions: () => [],
  dropdown: false,
  disabled: false,
  placeholder: '',
  loading: false,
  clearable: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'complete', query: string): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const sizeClass = useConfiguredSize('AutoComplete', () => props.size)
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
  'wi-autocomplete',
  `wi-autocomplete--${sizeClass.value}`,
  {
    'wi-autocomplete--disabled': props.disabled,
    'wi-autocomplete--open': open.value,
    'wi-autocomplete--loading': props.loading,
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

const panelOpen = computed(() => open.value && (filtered.value.length > 0 || props.loading))
</script>

<template>
  <div ref="root" :class="rootClass">
    <div ref="trigger" class="wi-autocomplete__control">
      <input
        class="wi-autocomplete__input"
        type="text"
        role="combobox"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-expanded="open"
        :aria-busy="loading || undefined"
        aria-autocomplete="list"
        @input="onInput"
        @keydown="onKeydown"
        @focus="requestComplete(modelValue ?? '')"
      >
      <span v-if="loading" class="wi-autocomplete__spinner" aria-hidden="true" />
      <button
        v-else-if="showClear"
        type="button"
        class="wi-autocomplete__clear"
        :aria-label="locale.clearInput"
        @click="clear"
      >
        <WiIcon name="close" size="sm" />
      </button>
      <button
        v-if="dropdown"
        type="button"
        class="wi-autocomplete__dropdown"
        :aria-label="locale.showSuggestions"
        :disabled="disabled"
        @click="toggleDropdown"
      >
        <WiIcon name="chevron-down" size="sm" />
      </button>
    </div>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-scale-fade">
        <ul
          v-if="panelOpen"
          ref="panel"
          class="wi-autocomplete__panel"
          :class="{ 'wi-autocomplete__panel--teleported': teleported }"
          :style="teleported ? panelStyle : undefined"
          role="listbox"
        >
          <li v-if="loading && !filtered.length" class="wi-autocomplete__status">
            {{ locale.loading }}
          </li>
          <li
            v-for="(item, index) in filtered"
            :key="`${item.value}-${index}`"
            class="wi-autocomplete__item"
            role="option"
            :class="{ 'wi-autocomplete__item--active': index === highlight }"
            :aria-selected="index === highlight"
            @mousedown.prevent="select(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>
