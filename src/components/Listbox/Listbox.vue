<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWdLocale } from '../../locale'
import type { ListboxOption, ListboxProps, ListboxValue } from './types'

const props = withDefaults(defineProps<ListboxProps>(), {
  multiple: false,
  disabled: false,
  filter: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: ListboxValue | ListboxValue[] | undefined): void
}>()

const filterQuery = ref('')
const locale = useWdLocale()

const filteredOptions = computed(() => {
  const query = filterQuery.value.trim().toLowerCase()
  if (!query) return props.options
  return props.options.filter((option) => option.label.toLowerCase().includes(query))
})

const rootClass = computed(() => [
  'wd-listbox',
  {
    'wd-listbox--disabled': props.disabled,
    'wd-listbox--multiple': props.multiple,
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
</script>

<template>
  <div :class="rootClass">
    <input
      v-if="filter"
      v-model="filterQuery"
      class="wd-listbox__filter"
      type="search"
      :placeholder="locale.filterOptions"
      :disabled="disabled"
      :aria-label="locale.filterOptions"
    />
    <ul class="wd-listbox__list" role="listbox" :aria-multiselectable="multiple || undefined" :style="listStyle">
      <li v-for="option in filteredOptions" :key="String(option.value)" role="presentation">
        <button
          type="button"
          class="wd-listbox__option"
          role="option"
          :class="{ 'wd-listbox__option--selected': isSelected(option.value) }"
          :aria-selected="isSelected(option.value)"
          :disabled="disabled || option.disabled"
          @click="select(option)"
        >
          {{ option.label }}
        </button>
      </li>
      <li v-if="!filteredOptions.length" class="wd-listbox__empty">{{ locale.emptyOptions }}</li>
    </ul>
  </div>
</template>
