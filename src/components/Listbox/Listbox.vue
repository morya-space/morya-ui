<script setup lang="ts">
import type { ListboxOption, ListboxProps, ListboxValue } from './types'
import type { VirtualScrollerExpose } from '../VirtualScroller/types'
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useConfiguredSize } from '../../shared/config'
import { filterItemsByLabel } from '../../shared/filterByQuery'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useFieldFeedback } from '../../shared/useFieldFeedback'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
import MVirtualScroller from '../VirtualScroller/VirtualScroller.vue'

defineOptions({ inheritAttrs: false })

const VIRTUAL_AUTO_THRESHOLD = 80

const props = withDefaults(defineProps<ListboxProps>(), {
  multiple: false,
  disabled: false,
  invalid: false,
  filter: false,
  virtual: undefined,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: ListboxValue | ListboxValue[] | undefined): void
}>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const filterQuery = ref('')
const locale = useMLocale()
const sizeClass = useConfiguredSize('Listbox', () => props.size)
const { isInvalid } = useFieldFeedback(props)
const resolvedEmptyMessage = computed(() => props.emptyMessage ?? locale.value.emptyOptions)
const resolvedListStyle = computed(() => props.listStyle)

const filteredOptions = computed(() => filterItemsByLabel(props.options, filterQuery.value))

const useVirtualList = computed(() => {
  if (props.virtual === false) return false
  if (props.virtual === true) return true
  return filteredOptions.value.length >= VIRTUAL_AUTO_THRESHOLD
})

const optionItemSize = computed(() => {
  if (sizeClass.value === 'small') return 28
  if (sizeClass.value === 'large') return 40
  return 34
})

const listViewportHeight = computed(() =>
  Math.min(280, Math.max(optionItemSize.value * 5, filteredOptions.value.length * optionItemSize.value)),
)

const rootClass = computed(() => [
  'm-listbox',
  `m-listbox--${sizeClass.value}`,
  {
    'm-listbox--disabled': props.disabled,
    'm-listbox--multiple': props.multiple,
    'm-listbox--invalid': isInvalid.value,
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

function optionAt(item: unknown): ListboxOption {
  return item as ListboxOption
}

const list = ref<InstanceType<typeof MScrollbar> | null>(null)
const virtualHost = ref<HTMLElement | null>(null)
const virtualList = ref<VirtualScrollerExpose | null>(null)

function listRoot(): ParentNode | null {
  if (useVirtualList.value) return virtualHost.value
  return list.value?.$el ?? null
}

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

async function focusActiveOption() {
  const index = keyboard.activeIndex.value
  if (index < 0) return
  if (useVirtualList.value) {
    virtualList.value?.scrollToIndex(index)
    await nextTick()
  }
  const root = useVirtualList.value
    ? virtualHost.value?.querySelector<HTMLElement>(`[data-index="${index}"] .m-listbox__option`)
    : listRoot()?.querySelectorAll<HTMLElement>('.m-listbox__option')[index]
  root?.focus({ preventScroll: true })
}

function onListKeydown(event: KeyboardEvent) {
  keyboard.onKeydown(event)
}

function onFilterKeydown(event: KeyboardEvent) {
  if (['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'].includes(event.key)) {
    keyboard.onKeydown(event)
    void focusActiveOption()
  }
}

watch(keyboard.activeIndex, () => {
  if (listRoot()?.contains(document.activeElement)) void focusActiveOption()
})
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClass">
    <input
      v-if="filter"
      v-model="filterQuery"
      class="m-listbox__filter"
      type="search"
      :placeholder="locale.filterOptions"
      :disabled="disabled"
      :aria-label="locale.filterOptions"
      @keydown="onFilterKeydown"
    >
    <div
      v-if="useVirtualList && filteredOptions.length"
      ref="virtualHost"
      class="m-listbox__virtual-host"
      @keydown="onListKeydown"
    >
      <MVirtualScroller
        ref="virtualList"
        class="m-listbox__list m-listbox__list--virtual"
        role="listbox"
        :aria-label="locale.selectOption"
        :items="filteredOptions"
        :item-size="optionItemSize"
        :height="listViewportHeight"
        :buffer="4"
      >
        <template #item="{ item, index }">
          <button
            type="button"
            class="m-listbox__option"
            role="option"
            :class="{ 'm-listbox__option--selected': isSelected(optionAt(item).value) }"
            :aria-selected="isSelected(optionAt(item).value)"
            :disabled="disabled || optionAt(item).disabled"
            :tabindex="optionTabindex(index)"
            @click="select(optionAt(item))"
            @focus="keyboard.setActive(index)"
          >
            <slot name="option" :option="optionAt(item)">
              {{ optionAt(item).label }}
            </slot>
          </button>
        </template>
      </MVirtualScroller>
    </div>
    <MScrollbar
      v-else
      ref="list"
      tag="ul"
      role="listbox"
      class="m-listbox__list"
      fit-content
      view-class="m-listbox__list-view"
      :view-style="resolvedListStyle"
      :aria-label="locale.selectOption"
      :aria-multiselectable="multiple || undefined"
      @keydown="onListKeydown"
    >
      <li v-for="(option, index) in filteredOptions" :key="String(option.value)" role="presentation">
        <button
          type="button"
          class="m-listbox__option"
          role="option"
          :class="{ 'm-listbox__option--selected': isSelected(option.value) }"
          :aria-selected="isSelected(option.value)"
          :disabled="disabled || option.disabled"
          :tabindex="optionTabindex(index)"
          @click="select(option)"
          @focus="keyboard.setActive(index)"
        >
          <slot name="option" :option="option">
            {{ option.label }}
          </slot>
        </button>
      </li>
      <li v-if="!filteredOptions.length" class="m-listbox__empty">
        {{ resolvedEmptyMessage }}
      </li>
    </MScrollbar>
    <div v-if="useVirtualList && !filteredOptions.length" class="m-listbox__empty">
      {{ resolvedEmptyMessage }}
    </div>
  </div>
</template>
