<script setup lang="ts">
import type { SelectModelValue, SelectOption, SelectProps, SelectValue } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import { formatLocale, useWdLocale } from '../../locale'
import { useComponentDefaults, useConfiguredSize, useWdConfig } from '../../shared/config'
import { useWdId } from '../../shared/useWdId'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import WdIcon from '../Icon/Icon.vue'

interface MenuOption extends SelectOption {
  created?: boolean
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: undefined,
  invalid: false,
  disabled: false,
  required: false,
  teleport: true,
  placement: 'bottom-start',
  multiple: undefined,
  tag: undefined,
  remote: undefined,
  loading: undefined,
  fluid: undefined,
  showClear: undefined,
  clearable: undefined,
  filter: undefined,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: SelectModelValue): void
  (event: 'change', value: SelectModelValue): void
  (event: 'clear'): void
  (event: 'show'): void
  (event: 'hide'): void
  (event: 'search', query: string): void
  (event: 'create', option: SelectOption): void
}>()

const slots = useSlots()
const defaults = useComponentDefaults('Select')
const config = useWdConfig()
const locale = useWdLocale()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const filterInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const filterQuery = ref('')
const highlightedIndex = ref(-1)
const menuStyle = ref<Record<string, string>>({})
const createdOptions = ref<SelectOption[]>([])
const autoSelectId = useWdId('wd-select')
const selectId = computed(() => props.id ?? autoSelectId)

const resolvedEmptyMessage = computed(() => props.emptyMessage ?? locale.value.emptyOptions)
const resolvedMultiple = computed(() => props.multiple ?? (defaults.value.multiple as boolean | undefined) ?? false)
const resolvedTag = computed(() => props.tag ?? (defaults.value.tag as boolean | undefined) ?? false)
const resolvedRemote = computed(() => props.remote ?? (defaults.value.remote as boolean | undefined) ?? false)
const resolvedLoading = computed(() => props.loading ?? false)
const resolvedFluid = computed(() => props.fluid ?? (defaults.value.fluid as boolean | undefined) ?? false)
const resolvedShowClear = computed(
  () =>
    props.showClear
    ?? props.clearable
    ?? (defaults.value.showClear as boolean | undefined)
    ?? (defaults.value.clearable as boolean | undefined)
    ?? false,
)
const resolvedFilter = computed(() => props.filter ?? (defaults.value.filter as boolean | undefined) ?? false)
const sizeClass = useConfiguredSize('Select', () => props.size)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))
const isInvalid = computed(() => props.invalid || Boolean(props.errorMessage))
const feedbackText = computed(() => props.errorMessage || props.helpText)
const feedbackIsError = computed(() => Boolean(props.errorMessage) || (isInvalid.value && Boolean(props.helpText)))

const selectedValues = computed<SelectValue[]>(() => {
  if (resolvedMultiple.value) {
    if (Array.isArray(props.modelValue)) return props.modelValue
    if (props.modelValue == null) return []
    return [props.modelValue]
  }
  if (props.modelValue == null || Array.isArray(props.modelValue)) return []
  return [props.modelValue]
})

const lookupOptions = computed(() => {
  const seen = new Set(props.options.map((option) => String(option.value)))
  const extras: SelectOption[] = []
  for (const option of createdOptions.value) {
    if (seen.has(String(option.value))) continue
    extras.push(option)
    seen.add(String(option.value))
  }
  for (const value of selectedValues.value) {
    if (seen.has(String(value))) continue
    extras.push({ label: String(value), value })
    seen.add(String(value))
  }
  return [...props.options, ...extras]
})

function findOption(value: SelectValue): SelectOption | undefined {
  return lookupOptions.value.find((option) => option.value === value)
}

const selectedOptions = computed(() =>
  selectedValues.value.map((value) => findOption(value) ?? { label: String(value), value }),
)

const visibleTags = computed(() => {
  const all = selectedOptions.value
  if (props.maxTagCount == null || all.length <= props.maxTagCount) return all
  return all.slice(0, props.maxTagCount)
})
const hiddenTagCount = computed(() => Math.max(0, selectedOptions.value.length - visibleTags.value.length))

const selectedOption = computed(() => (resolvedMultiple.value ? undefined : selectedOptions.value[0]))
const displayLabel = computed(
  () => selectedOption.value?.label ?? props.placeholder ?? locale.value.selectPlaceholder,
)
const hasValue = computed(() => selectedValues.value.length > 0)
const showClearButton = computed(() => resolvedShowClear.value && hasValue.value && !props.disabled)

const query = computed(() => filterQuery.value.trim())
const canCreate = computed(() => {
  if (!resolvedTag.value || !resolvedFilter.value) return false
  if (!query.value) return false
  return !lookupOptions.value.some(
    (option) => option.label.toLowerCase() === query.value.toLowerCase() || String(option.value) === query.value,
  )
})

const filteredOptions = computed(() => {
  if (resolvedRemote.value) return props.options
  const needle = query.value.toLowerCase()
  if (!needle) return lookupOptions.value
  return lookupOptions.value.filter((option) => option.label.toLowerCase().includes(needle))
})

const menuOptions = computed<MenuOption[]>(() => {
  if (!canCreate.value) return filteredOptions.value
  return [{ label: query.value, value: query.value, created: true }, ...filteredOptions.value]
})

const enabledOptions = computed(() => menuOptions.value.filter((option) => !option.disabled))
const createLabel = computed(() => formatLocale(locale.value.createOption, { value: query.value }))
const moreTagsLabel = computed(() => formatLocale(locale.value.moreTags, { count: hiddenTagCount.value }))

function isSelected(value: SelectValue) {
  return selectedValues.value.some((item) => item === value)
}

function emitValue(next: SelectModelValue) {
  emit('update:modelValue', next)
  emit('change', next)
}

function updateMenuPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  menuStyle.value = computeFloatingOverlayStyle(
    rect,
    props.placement === 'bottom-end' ? 'bottom-end' : 'bottom-start',
    {
      minWidth: `${rect.width}px`,
    },
  )
}

function setOpen(next: boolean) {
  if (props.disabled || open.value === next) return
  open.value = next
  if (next) {
    filterQuery.value = ''
    highlightedIndex.value = Math.max(
      0,
      enabledOptions.value.findIndex((option) => !option.created && isSelected(option.value)),
    )
    emit('show')
    void nextTick(() => {
      updateMenuPosition()
      if (resolvedFilter.value) filterInput.value?.focus({ preventScroll: true })
      else menu.value?.focus({ preventScroll: true })
    })
  } else {
    filterQuery.value = ''
    emit('hide')
  }
}

function selectOption(option: MenuOption) {
  if (option.disabled) return
  if (option.created) {
    createFromQuery()
    return
  }
  if (resolvedMultiple.value) {
    const next = isSelected(option.value)
      ? selectedValues.value.filter((value) => value !== option.value)
      : [...selectedValues.value, option.value]
    emitValue(next)
    return
  }
  emitValue(option.value)
  setOpen(false)
  trigger.value?.focus({ preventScroll: true })
}

function createFromQuery() {
  const label = query.value
  if (!label || !canCreate.value) return
  const option: SelectOption = { label, value: label }
  if (!createdOptions.value.some((item) => item.value === option.value)) {
    createdOptions.value = [...createdOptions.value, option]
  }
  emit('create', option)
  selectOption({ ...option })
  filterQuery.value = ''
}

function removeTag(value: SelectValue, event: Event) {
  event.stopPropagation()
  event.preventDefault()
  if (props.disabled || !resolvedMultiple.value) return
  emitValue(selectedValues.value.filter((item) => item !== value))
}

function clear(event?: Event) {
  event?.stopPropagation()
  event?.preventDefault()
  if (props.disabled || !hasValue.value) return
  emitValue(resolvedMultiple.value ? [] : undefined)
  emit('clear')
  trigger.value?.focus({ preventScroll: true })
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return
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

watch(filterQuery, (next) => {
  highlightedIndex.value = enabledOptions.value.length ? 0 : -1
  if (open.value && (resolvedFilter.value || resolvedRemote.value)) emit('search', next)
})

watch(open, (next) => {
  if (next && resolvedRemote.value) emit('search', filterQuery.value)
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
  <div ref="root" class="wd-select-field" :class="{ 'wd-select-field--fluid': resolvedFluid }">
    <label v-if="label" class="wd-select-field__label" :for="selectId">{{ label }}</label>
    <div
      class="wd-select__control"
      :class="{
        'wd-select__control--clearable': showClearButton,
        'wd-select__control--open': open,
      }"
    >
      <div
        :id="selectId"
        ref="trigger"
        class="wd-select"
        :class="[
          `wd-select--${sizeClass}`,
          {
            'wd-select--invalid': isInvalid,
            'wd-select--open': open,
            'wd-select--placeholder': !hasValue,
            'wd-select--fluid': resolvedFluid,
            'wd-select--multiple': resolvedMultiple,
            'wd-select--disabled': disabled,
            'wd-select--loading': resolvedLoading,
          },
        ]"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        :aria-expanded="open"
        aria-haspopup="listbox"
        :aria-controls="`${selectId}-listbox`"
        :aria-invalid="isInvalid || undefined"
        :aria-describedby="feedbackText ? `${selectId}-help` : undefined"
        :aria-disabled="disabled || undefined"
        :aria-busy="resolvedLoading || undefined"
        :aria-multiselectable="resolvedMultiple || undefined"
        @click="setOpen(!open)"
        @keydown="onTriggerKeydown"
      >
        <div v-if="resolvedMultiple && hasValue" class="wd-select__tags">
          <span v-for="option in visibleTags" :key="String(option.value)" class="wd-select__tag">
            <span class="wd-select__tag-label">{{ option.label }}</span>
            <button
              class="wd-select__tag-remove"
              type="button"
              :aria-label="locale.removeTag"
              :disabled="disabled"
              @click="removeTag(option.value, $event)"
            >
              <WdIcon name="close" size="sm" />
            </button>
          </span>
          <span
            v-if="hiddenTagCount"
            class="wd-select__tag wd-select__tag--more"
            :aria-label="moreTagsLabel"
          >
            +{{ hiddenTagCount }}
          </span>
        </div>
        <span v-else class="wd-select__value">
          <slot v-if="slots.value && hasValue && selectedOption" name="value" :option="selectedOption" />
          <template v-else>{{ displayLabel }}</template>
        </span>
        <span v-if="resolvedLoading" class="wd-select__spinner" aria-hidden="true" />
      </div>
      <div class="wd-select__suffix">
        <button
          v-if="showClearButton"
          class="wd-select__clear"
          type="button"
          :aria-label="locale.clear"
          @click="clear"
        >
          <WdIcon name="close" class="wd-control-affix-icon" />
        </button>
        <span
          class="wd-select__indicator"
          :class="{ 'wd-select__indicator--open': open }"
          aria-hidden="true"
        >
          <WdIcon name="chevron-down" class="wd-control-affix-icon" />
        </span>
      </div>
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
          :aria-multiselectable="resolvedMultiple || undefined"
          :aria-label="label ?? placeholder ?? locale.selectOption"
          @keydown="onMenuKeydown"
        >
          <input
            v-if="resolvedFilter"
            ref="filterInput"
            v-model="filterQuery"
            class="wd-select__filter"
            type="search"
            :placeholder="locale.searchPlaceholder"
            :aria-label="locale.filterOptions"
            @click.stop
            @keydown.stop="onMenuKeydown"
          >
          <div v-if="resolvedLoading" class="wd-select__empty" role="status">
            {{ locale.loading }}
          </div>
          <button
            v-for="option in menuOptions"
            :key="option.created ? `__create:${String(option.value)}` : String(option.value)"
            class="wd-select__option"
            :class="{
              'wd-select__option--selected': !option.created && isSelected(option.value),
              'wd-select__option--highlighted': enabledOptions[highlightedIndex]?.value === option.value && Boolean(enabledOptions[highlightedIndex]?.created) === Boolean(option.created),
              'wd-select__option--create': option.created,
            }"
            type="button"
            role="option"
            :aria-selected="option.created ? undefined : isSelected(option.value)"
            :disabled="option.disabled"
            @mouseenter="!option.disabled && (highlightedIndex = enabledOptions.findIndex((item) => item.value === option.value && Boolean(item.created) === Boolean(option.created)))"
            @click="selectOption(option)"
          >
            <slot name="option" :option="option">
              <span>{{ option.created ? createLabel : option.label }}</span>
            </slot>
            <WdIcon
              v-if="!option.created && isSelected(option.value)"
              class="wd-select__check"
              name="check"
              size="sm"
            />
          </button>
          <div v-if="!menuOptions.length && !resolvedLoading" class="wd-select__empty" role="status">
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
      :required="!hasValue"
      :value="resolvedMultiple ? selectedValues.join(',') : selectedValues[0]"
    >
    <span
      v-if="feedbackText"
      :id="`${selectId}-help`"
      class="wd-select-field__help"
      :class="{ 'wd-select-field__help--invalid': feedbackIsError }"
      :role="feedbackIsError ? 'alert' : undefined"
    >
      {{ feedbackText }}
    </span>
  </div>
</template>
