<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { resolveSizeClass } from '../../shared/types'
import WdIcon from '../Icon/Icon.vue'
import type { AutoCompleteProps } from './types'

const props = withDefaults(defineProps<AutoCompleteProps>(), {
  modelValue: '',
  suggestions: () => [],
  dropdown: false,
  disabled: false,
  placeholder: '',
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'complete', query: string): void
}>()

const config = useWdConfig()
const locale = useWdLocale()
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const highlight = ref(-1)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const filtered = computed(() => {
  const query = (props.modelValue ?? '').trim().toLowerCase()
  if (!query) return props.suggestions
  return props.suggestions.filter((item) => item.toLowerCase().includes(query))
})

const rootClass = computed(() => [
  'wd-autocomplete',
  `wd-autocomplete--${sizeClass.value}`,
  {
    'wd-autocomplete--disabled': props.disabled,
    'wd-autocomplete--open': open.value,
  },
])

function updatePanelPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  panelStyle.value = {
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    top: `${rect.bottom + 8}px`,
  }
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

function select(item: string) {
  if (props.disabled) return
  emit('update:modelValue', item)
  open.value = false
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
</script>

<template>
  <div ref="root" :class="rootClass">
    <div ref="trigger" class="wd-autocomplete__control">
      <input
        class="wd-autocomplete__input"
        type="text"
        role="combobox"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-expanded="open"
        aria-autocomplete="list"
        @input="onInput"
        @keydown="onKeydown"
        @focus="requestComplete(modelValue ?? '')"
      />
      <button
        v-if="dropdown"
        type="button"
        class="wd-autocomplete__dropdown"
        :aria-label="locale.showSuggestions"
        :disabled="disabled"
        @click="toggleDropdown"
      >
        <WdIcon name="chevron-down" size="sm" />
      </button>
    </div>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wd-scale-fade">
        <ul
          v-if="open && filtered.length"
          ref="panel"
          class="wd-autocomplete__panel"
          :class="{ 'wd-autocomplete__panel--teleported': teleported }"
          :style="teleported ? panelStyle : undefined"
          role="listbox"
        >
          <li
            v-for="(item, index) in filtered"
            :key="`${item}-${index}`"
            class="wd-autocomplete__item"
            role="option"
            :class="{ 'wd-autocomplete__item--active': index === highlight }"
            :aria-selected="index === highlight"
            @mousedown.prevent="select(item)"
          >
            {{ item }}
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>
