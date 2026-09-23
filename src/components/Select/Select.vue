<script setup lang="ts">
import type { VirtualScrollerExpose } from '../VirtualScroller/types'
import type { SelectModelValue, SelectOption, SelectOptionEntry, SelectOptionGroup, SelectProps, SelectValue } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useSlots, watch } from 'vue'
import { formatLocale, useMLocale } from '../../locale'
import { useComponentDefaults, useConfiguredSize, useMConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useFieldParts } from '../../shared/useComponentAttrs'
import { useFloatingViewportSync } from '../../shared/useFloatingViewportSync'
import { useMId } from '../../shared/useMId'
import { useMotionTransition } from '../../theme/useMotionTransition'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import MVirtualScroller from '../VirtualScroller/VirtualScroller.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SelectProps>(), {
  transition: undefined,
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
  virtual: undefined,
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

const VIRTUAL_AUTO_THRESHOLD = 80

interface MenuOption extends SelectOption {
  created?: boolean
}

/* Flat render model shared by the plain list and the virtual scroller:
   group header rows + option rows. */
interface MenuGroupRow {
  type: 'group'
  label: string
  key: string
}

interface MenuOptionRow {
  type: 'option'
  option: MenuOption
  key: string
}

type MenuRow = MenuGroupRow | MenuOptionRow

function isOptionGroup(entry: SelectOptionEntry): entry is SelectOptionGroup {
  return Array.isArray((entry as SelectOptionGroup).items)
}

const slots = useSlots()
const attrs = useAttrs()
const { rootAttrs, controlAttrs } = useFieldParts(attrs, () => props.pt, { controlKey: 'control' })
const defaults = useComponentDefaults('Select')
const config = useMConfig()
const { transitionName, transitionCss } = useMotionTransition({
  role: 'popup',
  local: () => props.transition,
  componentName: 'Select',
  fallback: 'scale-fade',
})
const locale = useMLocale()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const filterInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const filterQuery = ref('')
const highlightedIndex = ref(-1)
const menuStyle = ref<Record<string, string>>({})
const createdOptions = ref<SelectOption[]>([])
const autoSelectId = useMId('m-select')
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

const flatOptions = computed<SelectOption[]>(() =>
  props.options.flatMap((entry): SelectOption[] => (isOptionGroup(entry) ? entry.items : [entry])),
)

const lookupOptions = computed(() => {
  const seen = new Set(flatOptions.value.map((option) => String(option.value)))
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
  return [...flatOptions.value, ...extras]
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

/* Grouped entries for the menu. Created tags and selected values missing from
   `options` are appended as ungrouped tail entries; filtering keeps a group
   only while some of its items match. */
const menuEntries = computed<SelectOptionEntry[]>(() => {
  if (resolvedRemote.value) return props.options
  const seen = new Set(flatOptions.value.map((option) => String(option.value)))
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
  const entries: SelectOptionEntry[] = [...props.options, ...extras]
  const needle = query.value.toLowerCase()
  if (!needle) return entries
  return entries.flatMap((entry): SelectOptionEntry[] => {
    if (isOptionGroup(entry)) {
      const items = entry.items.filter((option) => option.label.toLowerCase().includes(needle))
      return items.length ? [{ ...entry, items }] : []
    }
    return entry.label.toLowerCase().includes(needle) ? [entry] : []
  })
})

const menuRows = computed<MenuRow[]>(() => {
  const rows: MenuRow[] = []
  if (canCreate.value) {
    rows.push({
      type: 'option',
      option: { label: query.value, value: query.value, created: true },
      key: `__create:${query.value}`,
    })
  }
  menuEntries.value.forEach((entry, index) => {
    if (isOptionGroup(entry)) {
      rows.push({ type: 'group', label: entry.label, key: `__group:${index}:${entry.label}` })
      for (const option of entry.items) {
        rows.push({ type: 'option', option, key: String(option.value) })
      }
    } else {
      rows.push({ type: 'option', option: entry, key: String(entry.value) })
    }
  })
  return rows
})

const menuOptions = computed<MenuOption[]>(() =>
  menuRows.value.flatMap((row) => (row.type === 'option' ? [row.option] : [])),
)

const enabledOptions = computed(() => menuOptions.value.filter((option) => !option.disabled))
const createLabel = computed(() => formatLocale(locale.value.createOption, { value: query.value }))
const moreTagsLabel = computed(() => formatLocale(locale.value.moreTags, { count: hiddenTagCount.value }))

const useVirtualMenu = computed(() => {
  if (props.virtual === false) return false
  if (props.virtual === true) return true
  return menuRows.value.length >= VIRTUAL_AUTO_THRESHOLD
})
const optionItemSize = computed(() => {
  if (sizeClass.value === 'small') return 28
  if (sizeClass.value === 'large') return 40
  return 34
})
const menuViewportHeight = computed(() =>
  Math.min(240, Math.max(optionItemSize.value * 4, menuRows.value.length * optionItemSize.value)),
)
const virtualList = ref<VirtualScrollerExpose | null>(null)

function menuRowAt(item: unknown): MenuRow {
  return item as MenuRow
}

function menuGroupLabelAt(item: unknown): string {
  return (item as MenuGroupRow).label
}

function menuOptionAt(item: unknown): MenuOption {
  return (item as MenuOptionRow).option
}

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

function setOpen(next: boolean, highlight: 'none' | 'selected' | 'last' = 'none') {
  if (props.disabled || open.value === next) return
  open.value = next
  if (next) {
    filterQuery.value = ''
    if (highlight === 'none') {
      highlightedIndex.value = -1
    } else if (highlight === 'last') {
      highlightedIndex.value = Math.max(0, enabledOptions.value.length - 1)
    } else {
      const selectedIndex = enabledOptions.value.findIndex(
        (option) => !option.created && isSelected(option.value),
      )
      highlightedIndex.value = selectedIndex >= 0 ? selectedIndex : enabledOptions.value.length ? 0 : -1
    }
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
    if (!open.value) {
      setOpen(true, event.key === 'ArrowUp' ? 'last' : 'selected')
    }
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
    if (highlightedIndex.value < 0) {
      highlightedIndex.value = event.key === 'ArrowDown' ? 0 : length - 1
    } else {
      highlightedIndex.value =
        (highlightedIndex.value + (event.key === 'ArrowDown' ? 1 : -1) + length) % length
    }
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

useFloatingViewportSync(
  () => open.value && teleported.value,
  onViewportChange,
)

watch(highlightedIndex, (index) => {
  if (!useVirtualMenu.value || index < 0) return
  const option = enabledOptions.value[index]
  if (!option) return
  const rowIndex = menuRows.value.findIndex(
    (row) =>
      row.type === 'option' &&
      row.option.value === option.value &&
      Boolean(row.option.created) === Boolean(option.created),
  )
  if (rowIndex >= 0) virtualList.value?.scrollToIndex(rowIndex)
})

watch(filterQuery, (next) => {
  highlightedIndex.value = enabledOptions.value.length ? 0 : -1
  if (open.value && (resolvedFilter.value || resolvedRemote.value)) emit('search', next)
})

watch(open, (next) => {
  if (next && resolvedRemote.value) emit('search', filterQuery.value)
  if (next) document.addEventListener('click', onDocumentClick)
  else document.removeEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    class="m-select-field"
    :class="{ 'm-select-field--fluid': resolvedFluid }"
  >
    <label v-if="label" class="m-select-field__label" :for="selectId">{{ label }}</label>
    <div
      class="m-select__control"
      :class="{
        'm-select__control--clearable': showClearButton,
        'm-select__control--open': open,
      }"
    >
      <div
        v-bind="controlAttrs"
        :id="selectId"
        ref="trigger"
        class="m-select"
        :class="[
          `m-select--${sizeClass}`,
          {
            'm-select--invalid': isInvalid,
            'm-select--open': open,
            'm-select--placeholder': !hasValue,
            'm-select--fluid': resolvedFluid,
            'm-select--multiple': resolvedMultiple,
            'm-select--disabled': disabled,
            'm-select--loading': resolvedLoading,
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
        <div v-if="resolvedMultiple && hasValue" class="m-select__tags">
          <span v-for="option in visibleTags" :key="String(option.value)" class="m-select__tag">
            <span class="m-select__tag-label">{{ option.label }}</span>
            <button
              class="m-select__tag-remove"
              type="button"
              :aria-label="locale.removeTag"
              :disabled="disabled"
              @click="removeTag(option.value, $event)"
            >
              <MIcon name="close" size="sm" />
            </button>
          </span>
          <span
            v-if="hiddenTagCount"
            class="m-select__tag m-select__tag--more"
            :aria-label="moreTagsLabel"
          >
            +{{ hiddenTagCount }}
          </span>
        </div>
        <span v-else class="m-select__value">
          <slot v-if="slots.value && hasValue && selectedOption" name="value" :option="selectedOption" />
          <template v-else>{{ displayLabel }}</template>
        </span>
        <span v-if="resolvedLoading" class="m-select__spinner" aria-hidden="true" />
      </div>
      <div class="m-select__suffix">
        <button
          v-if="showClearButton"
          class="m-select__clear"
          type="button"
          :aria-label="locale.clear"
          @click="clear"
        >
          <MIcon name="close" class="m-control-affix-icon" />
        </button>
        <span
          class="m-select__indicator"
          :class="{ 'm-select__indicator--open': open }"
          aria-hidden="true"
        >
          <MIcon name="chevron-down" class="m-control-affix-icon" />
        </span>
      </div>
    </div>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition :name="transitionName" :css="transitionCss">
        <div
          v-if="open"
          :id="`${selectId}-listbox`"
          ref="menu"
          class="m-select__menu"
          :class="[`m-select__menu--${placement}`, { 'm-select__menu--teleported': teleported }]"
          :style="teleported ? menuStyle : undefined"
          role="listbox"
          tabindex="-1"
          :aria-multiselectable="resolvedMultiple || undefined"
          :aria-label="label ?? placeholder ?? locale.selectOption"
          @keydown="onMenuKeydown"
        >
          <div v-if="$slots.header" class="m-select__header">
            <slot name="header" />
          </div>
          <input
            v-if="resolvedFilter"
            ref="filterInput"
            v-model="filterQuery"
            class="m-select__filter"
            type="search"
            size="1"
            :placeholder="locale.searchPlaceholder"
            :aria-label="locale.filterOptions"
            @click.stop
            @keydown.stop="onMenuKeydown"
          >
          <MVirtualScroller
            v-if="useVirtualMenu && !resolvedLoading && menuOptions.length"
            :id="`${selectId}-listbox`"
            ref="virtualList"
            class="m-select__list m-select__list--virtual"
            role="listbox"
            :aria-label="label ?? placeholder ?? locale.selectOption"
            :items="menuRows"
            :item-size="optionItemSize"
            :height="menuViewportHeight"
            :buffer="4"
          >
            <template #item="{ item }">
              <div
                v-if="menuRowAt(item).type === 'group'"
                class="m-select__group-label"
                role="presentation"
              >
                {{ menuGroupLabelAt(item) }}
              </div>
              <button
                v-else
                class="m-select__option"
                :class="{
                  'm-select__option--selected': !menuOptionAt(item).created && isSelected(menuOptionAt(item).value),
                  'm-select__option--highlighted': enabledOptions[highlightedIndex]?.value === menuOptionAt(item).value && Boolean(enabledOptions[highlightedIndex]?.created) === Boolean(menuOptionAt(item).created),
                  'm-select__option--create': menuOptionAt(item).created,
                }"
                type="button"
                role="option"
                :aria-selected="menuOptionAt(item).created ? undefined : isSelected(menuOptionAt(item).value)"
                :disabled="menuOptionAt(item).disabled"
                @mouseenter="!menuOptionAt(item).disabled && (highlightedIndex = enabledOptions.findIndex((entry) => entry.value === menuOptionAt(item).value && Boolean(entry.created) === Boolean(menuOptionAt(item).created)))"
                @click="selectOption(menuOptionAt(item))"
              >
                <slot name="option" :option="menuOptionAt(item)">
                  <span>{{ menuOptionAt(item).created ? createLabel : menuOptionAt(item).label }}</span>
                </slot>
                <MIcon
                  v-if="!menuOptionAt(item).created && isSelected(menuOptionAt(item).value)"
                  class="m-select__check"
                  name="check"
                  size="sm"
                />
              </button>
            </template>
          </MVirtualScroller>
          <MScrollbar
            v-else
            :id="`${selectId}-listbox`"
            class="m-select__list"
            fit-content
            wrap-class="m-select__list-wrap"
            view-class="m-select__list-view"
          >
            <div v-if="resolvedLoading" class="m-select__empty" role="status">
              {{ locale.loading }}
            </div>
            <template v-for="row in menuRows" :key="row.key">
              <div
                v-if="row.type === 'group'"
                class="m-select__group-label"
                role="presentation"
              >
                {{ row.label }}
              </div>
              <button
                v-else
                class="m-select__option"
                :class="{
                  'm-select__option--selected': !row.option.created && isSelected(row.option.value),
                  'm-select__option--highlighted': enabledOptions[highlightedIndex]?.value === row.option.value && Boolean(enabledOptions[highlightedIndex]?.created) === Boolean(row.option.created),
                  'm-select__option--create': row.option.created,
                }"
                type="button"
                role="option"
                :aria-selected="row.option.created ? undefined : isSelected(row.option.value)"
                :disabled="row.option.disabled"
                @mouseenter="!row.option.disabled && (highlightedIndex = enabledOptions.findIndex((item) => item.value === row.option.value && Boolean(item.created) === Boolean(row.option.created)))"
                @click="selectOption(row.option)"
              >
                <slot name="option" :option="row.option">
                  <span>{{ row.option.created ? createLabel : row.option.label }}</span>
                </slot>
                <MIcon
                  v-if="!row.option.created && isSelected(row.option.value)"
                  class="m-select__check"
                  name="check"
                  size="sm"
                />
              </button>
            </template>
            <div v-if="!menuOptions.length && !resolvedLoading" class="m-select__empty" role="status">
              {{ resolvedEmptyMessage }}
            </div>
          </MScrollbar>
          <div
            v-if="useVirtualMenu && resolvedLoading"
            class="m-select__empty"
            role="status"
          >
            {{ locale.loading }}
          </div>
          <div
            v-else-if="useVirtualMenu && !menuOptions.length && !resolvedLoading"
            class="m-select__empty"
            role="status"
          >
            {{ resolvedEmptyMessage }}
          </div>
          <div v-if="$slots.footer" class="m-select__footer">
            <slot name="footer" />
          </div>
        </div>
      </Transition>
    </Teleport>
    <input
      v-if="required"
      class="m-select__required-input"
      tabindex="-1"
      aria-hidden="true"
      :name="name"
      :required="!hasValue"
      :value="resolvedMultiple ? selectedValues.join(',') : selectedValues[0]"
    >
    <span
      v-if="feedbackText"
      :id="`${selectId}-help`"
      class="m-select-field__help"
      :class="{ 'm-select-field__help--invalid': feedbackIsError }"
      :role="feedbackIsError ? 'alert' : undefined"
    >
      {{ feedbackText }}
    </span>
  </div>
</template>
