<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

const props = defineProps<{
  modelValue: number
  rowsItems: number[]
}>()

const emit = defineEmits<{ (event: 'update:modelValue', value: number): void }>()

const showList = ref(false)
const showInsideOfTable = ref(false)
const dataTable = inject('dataTable') as Ref<HTMLElement | undefined> | undefined
const triggerRef = ref<HTMLButtonElement>()

watch(showList, (val) => {
  if (val && dataTable?.value) {
    const windowHeight = window.innerHeight
    const rect = dataTable.value.getBoundingClientRect()
    showInsideOfTable.value = (windowHeight - (rect.height + rect.top)) <= 100
  }
})

const rowsComputed = computed({
  get: (): number => props.modelValue,
  set: (value: number) => emit('update:modelValue', value),
})

function changeSelectedRows(value: number) {
  rowsComputed.value = value
  showList.value = false
  triggerRef.value?.focus()
}

function toggleList() {
  showList.value = !showList.value
}

function isDescendant(child: EventTarget | null, className: string) {
  let node = (child as Node | null)?.parentNode as HTMLElement | null
  while (node != null) {
    if (node.classList?.contains(className)) return true
    node = node.parentNode as HTMLElement | null
  }
  return false
}

function closeRowsSelector(e: MouseEvent) {
  if (!isDescendant(e.target, 'wi-table__rows-selector')) showList.value = false
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    showList.value = false
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleList()
  }
}

onMounted(() => {
  document.addEventListener('click', closeRowsSelector)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeRowsSelector)
})
</script>

<template>
  <div class="wi-table__rows-selector">
    <button
      ref="triggerRef"
      type="button"
      class="wi-table__rows-select"
      :aria-expanded="showList"
      aria-haspopup="listbox"
      @click="toggleList"
      @keydown="onTriggerKeydown"
    >
      {{ rowsComputed }}
    </button>
    <ul
      class="wi-table__rows-options"
      role="listbox"
      :class="{ 'wi-table__rows-options--open': showList, 'wi-table__rows-options--inside': showInsideOfTable }"
    >
      <li
        v-for="item in rowsItems"
        :key="item"
        role="option"
        :aria-selected="item === rowsComputed"
        :class="{ 'wi-table__rows-option--selected': item === rowsComputed }"
        @click="changeSelectedRows(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>
