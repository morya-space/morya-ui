<script setup lang="ts">
import type { ListboxOption, ListboxProps, ListboxValue } from './types'
import { computed, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'

const props = withDefaults(defineProps<ListboxProps>(), {
  multiple: false,
  disabled: false,
  filter: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: ListboxValue | ListboxValue[] | undefined): void
}>()

const filterQuery = ref('')
const locale = useWiLocale()

const filteredOptions = computed(() => {
  const query = filterQuery.value.trim().toLowerCase()
  if (!query) return props.options
  return props.options.filter((option) => option.label.toLowerCase().includes(query))
})

const rootClass = computed(() => [
  'wi-listbox',
  {
    'wi-listbox--disabled': props.disabled,
    'wi-listbox--multiple': props.multiple,
  },
])

function isSelected(value: ListboxValue): boolean {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : []
    return values.includes(value)
  }
  return props.modelValue === value
}

function select(option: ListboxOption) {
  if (props.disabled || option.disabled) return
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = values.indexOf(option.value)
    if (index >= 0) values.splice(index, 1)
    else values.push(option.value)
    emit('update:modelValue', values)
    return
  }
  emit('update:modelValue', option.value)
}

const list = ref<HTMLElement | null>(null)

const keyboard = useMenuKeyboard({
  itemCount: () => filteredOptions.value.length,
  isItemDisabled: (index) => Boolean(filteredOptions.value[index]?.disabled),
  enabled: () => !props.disabled,
  onActivate: (index) => {
    const option = filteredOptions.value[index]
    if (option) select(option)
  },
})

function optionTabindex(index: number): 0 | -1 {
  if (keyboard.activeIndex.value >= 0) return keyboard.tabindexFor(index)
  const selectedIndex = filteredOptions.value.findIndex(
    (option) => !option.disabled && isSelected(option.value),
  )
  const fallback =
    selectedIndex >= 0 ? selectedIndex : filteredOptions.value.findIndex((option) => !option.disabled)
  return index === fallback ? 0 : -1
}

function focusActiveOption() {
  const index = keyboard.activeIndex.value
  if (index < 0) return
  list.value
    ?.querySelectorAll<HTMLElement>('.wi-listbox__option')
    [index]?.focus({ preventScroll: true })
}

function onListKeydown(event: KeyboardEvent) {
  keyboard.onKeydown(event)
}

function onFilterKeydown(event: KeyboardEvent) {
  if (['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'].includes(event.key)) {
    keyboard.onKeydown(event)
    focusActiveOption()
  }
}

watch(keyboard.activeIndex, () => {
  // Follow the highlight only when focus is already inside the list, so
  // typing in the filter input never steals focus.
  if (list.value?.contains(document.activeElement)) focusActiveOption()
})
</script>

<template>
  <div :class="rootClass">
    <input
      v-if="filter"
      v-model="filterQuery"
      class="wi-listbox__filter"
      type="search"
      :placeholder="locale.filterOptions"
      :disabled="disabled"
      :aria-label="locale.filterOptions"
      @keydown="onFilterKeydown"
    >
    <ul
      ref="list"
      class="wi-listbox__list"
      role="listbox"
      :aria-label="locale.selectOption"
      :aria-multiselectable="multiple || undefined"
      :style="listStyle"
      @keydown="onListKeydown"
    >
      <li v-for="(option, index) in filteredOptions" :key="String(option.value)" role="presentation">
        <button
          type="button"
          class="wi-listbox__option"
          role="option"
          :class="{ 'wi-listbox__option--selected': isSelected(option.value) }"
          :aria-selected="isSelected(option.value)"
          :disabled="disabled || option.disabled"
          :tabindex="optionTabindex(index)"
          @click="select(option)"
          @focus="keyboard.setActive(index)"
        >
          {{ option.label }}
        </button>
      </li>
      <li v-if="!filteredOptions.length" class="wi-listbox__empty">
        {{ locale.emptyOptions }}
      </li>
    </ul>
  </div>
</template>
