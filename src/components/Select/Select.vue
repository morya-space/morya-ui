<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { resolveSizeClass } from '../../shared/types'
import type { SelectOption, SelectProps, SelectValue } from './types'

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: undefined,
  error: false,
  invalid: false,
  disabled: false,
  required: false,
  fluid: false,
  showClear: false,
  filter: false,
  teleport: true,
  placement: 'bottom-start',
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: SelectValue | undefined): void
  (event: 'change', value: SelectValue | undefined): void
  (event: 'clear'): void
  (event: 'show'): void
  (event: 'hide'): void
}>()

const config = useWdConfig()
const locale = useWdLocale()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const filterInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const filterQuery = ref('')
const highlightedIndex = ref(-1)
const menuStyle = ref<Record<string, string>>({})
const selectId = computed(() => props.id ?? `wd-select-${Math.random().toString(36).slice(2, 8)}`)
const resolvedEmptyMessage = computed(
  () => props.emptyMessage ?? locale.value.emptyOptions,
)
const filteredOptions = computed(() => {
  const query = filterQuery.value.trim().toLowerCase()
  if (!query) return props.options
  return props.options.filter((option) => option.label.toLowerCase().includes(query))
})
const enabledOptions = computed(() => filteredOptions.value.filter((option) => !option.disabled))
const selectedOption = computed(() => props.options.find((option) => option.value === props.modelValue))
const displayLabel = computed(
  () => selectedOption.value?.label ?? props.placeholder ?? locale.value.selectPlaceholder,
)
const isInvalid = computed(() => props.error || props.invalid || Boolean(props.errorMessage))
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))
const showClearButton = computed(() => props.showClear && selectedOption.value != null && !props.disabled)
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(() => Boolean(props.errorMessage) || (isInvalid.value && Boolean(props.helpText)))

function updateMenuPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  const zIndex = config.value.zIndex ?? 1000
  menuStyle.value = {
    left: props.placement === 'bottom-end' ? `${rect.right}px` : `${rect.left}px`,
    minWidth: `${rect.width}px`,
    top: `${rect.bottom + 8}px`,
    zIndex: String(zIndex),
    ...(props.placement === 'bottom-end' ? { transform: 'translateX(-100%)' } : {}),
  }
}

function setOpen(next: boolean) {
  if (props.disabled || open.value === next) return
  open.value = next
  if (next) {
    filterQuery.value = ''
    highlightedIndex.value = Math.max(
      0,
      enabledOptions.value.findIndex((option) => option.value === props.modelValue),
    )
    emit('show')
    void nextTick(() => {
      updateMenuPosition()
      if (props.filter) filterInput.value?.focus({ preventScroll: true })
      else menu.value?.focus({ preventScroll: true })
    })
  } else {
    filterQuery.value = ''
    emit('hide')
  }
}

function selectOption(option: SelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  setOpen(false)
  trigger.value?.focus({ preventScroll: true })
}

function clear(event?: Event) {
  event?.stopPropagation()
  event?.preventDefault()
  if (props.disabled || !selectedOption.value) return
  emit('update:modelValue', undefined)
  emit('change', undefined)
  emit('clear')
  trigger.value?.focus({ preventScroll: true })
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault()
    if (!open.value) setOpen(true)
  }
}

function onMenuKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    setOpen(false)
    trigger.value?.focus({ preventScroll: true })
    return
  }
  const length = enabledOptions.value.length
  if (!length) return
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    highlightedIndex.value =
      (highlightedIndex.value + (event.key === 'ArrowDown' ? 1 : -1) + length) % length
  }
  if (event.key === 'Home') {
    event.preventDefault()
    highlightedIndex.value = 0
  }
  if (event.key === 'End') {
    event.preventDefault()
    highlightedIndex.value = length - 1
  }
  if (event.key === 'Enter' || (event.key === ' ' && event.target !== filterInput.value)) {
    const option = enabledOptions.value[highlightedIndex.value]
    if (option) {
      event.preventDefault()
      selectOption(option)
    }
  }
}

function onDocumentClick(event: MouseEvent) {
  if (open.value && !root.value?.contains(event.target as Node) && !menu.value?.contains(event.target as Node)) {
    setOpen(false)
  }
}

function onViewportChange() {
  if (open.value) updateMenuPosition()
}

watch(filterQuery, () => {
  highlightedIndex.value = enabledOptions.value.length ? 0 : -1
})

watch(open, (next) => {
  if (next) {
    document.addEventListener('click', onDocumentClick)
    if (teleported.value) {
      window.addEventListener('resize', onViewportChange)
      window.addEventListener('scroll', onViewportChange, true)
    }
  } else {
    document.removeEventListener('click', onDocumentClick)
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div ref="root" class="wd-select-field" :class="{ 'wd-select-field--fluid': fluid }">
    <label v-if="label" class="wd-select-field__label" :for="selectId">{{ label }}</label>
    <div class="wd-select__control" :class="{ 'wd-select__control--clearable': showClearButton }">
      <button
        :id="selectId"
        ref="trigger"
        class="wd-select"
        :class="[
          `wd-select--${sizeClass}`,
          {
            'wd-select--error': isInvalid,
            'wd-select--open': open,
            'wd-select--placeholder': !selectedOption,
            'wd-select--fluid': fluid,
          },
        ]"
        type="button"
        role="combobox"
        :aria-expanded="open"
        aria-haspopup="listbox"
        :aria-controls="`${selectId}-listbox`"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="feedbackText ? `${selectId}-help` : undefined"
        :disabled="disabled"
        @click="setOpen(!open)"
        @keydown="onTriggerKeydown"
      >
        <span class="wd-select__value">{{ displayLabel }}</span>
        <span class="wd-select__indicator" aria-hidden="true" />
      </button>
      <button
        v-if="showClearButton"
        class="wd-select__clear"
        type="button"
        :aria-label="locale.clear"
        @click="clear"
      >
        ×
      </button>
    </div>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wd-scale-fade">
        <div
          v-if="open"
          :id="`${selectId}-listbox`"
          ref="menu"
          class="wd-select__menu"
          :class="[`wd-select__menu--${placement}`, { 'wd-select__menu--teleported': teleported }]"
          :style="teleported ? menuStyle : undefined"
          role="listbox"
          tabindex="-1"
          :aria-label="label ?? placeholder ?? locale.selectOption"
          @keydown="onMenuKeydown"
        >
          <input
            v-if="filter"
            ref="filterInput"
            v-model="filterQuery"
            class="wd-select__filter"
            type="search"
            :placeholder="locale.searchPlaceholder"
            :aria-label="locale.filterOptions"
            @click.stop
            @keydown.stop="onMenuKeydown"
          />
          <button
            v-for="option in filteredOptions"
            :key="String(option.value)"
            class="wd-select__option"
            :class="{
              'wd-select__option--selected': option.value === modelValue,
              'wd-select__option--highlighted': enabledOptions[highlightedIndex]?.value === option.value,
            }"
            type="button"
            role="option"
            :aria-selected="option.value === modelValue"
            :disabled="option.disabled"
            @mouseenter="!option.disabled && (highlightedIndex = enabledOptions.findIndex((item) => item.value === option.value))"
            @click="selectOption(option)"
          >
            <span>{{ option.label }}</span>
            <span v-if="option.value === modelValue" class="wd-select__check" aria-hidden="true">✓</span>
          </button>
          <div v-if="!filteredOptions.length" class="wd-select__empty" role="status">
            {{ resolvedEmptyMessage }}
          </div>
        </div>
      </Transition>
    </Teleport>
    <input
      v-if="required"
      class="wd-select__required-input"
      tabindex="-1"
      aria-hidden="true"
      :required="!selectedOption"
      :value="modelValue"
    />
    <span
      v-if="feedbackText"
      :id="`${selectId}-help`"
      class="wd-select-field__help"
      :class="{ 'wd-select-field__help--error': feedbackIsError }"
      :role="feedbackIsError ? 'alert' : undefined"
    >
      {{ feedbackText }}
    </span>
  </div>
</template>
