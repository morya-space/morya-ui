<script setup lang="ts">
import type { PaginationProps } from './types'
import { computed, ref } from 'vue'
import { formatLocale, useWdLocale } from '../../locale'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<PaginationProps>(), {
  modelValue: 1,
  rows: 10,
  pageLinkSize: 5,
  disabled: false,
  showSizePicker: false,
  pageSizes: () => [10, 20, 50, 100],
  showQuickJumper: false,
  simple: false,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
  (event: 'page', value: number): void
  (event: 'update:rows', value: number): void
  (event: 'update:pageSize', value: number): void
}>()
const locale = useWdLocale()
const jumpDraft = ref('')
const resolvedRows = computed(() => Math.max(1, props.pageSize ?? props.rows))
const pageCount = computed(() => Math.max(1, Math.ceil(props.totalRecords / resolvedRows.value)))
const currentPage = computed(() => Math.min(Math.max(1, props.modelValue), pageCount.value))
/** Zero-based index of the first record on the current page . */
const first = computed(() => (currentPage.value - 1) * resolvedRows.value)
const pages = computed(() => {
  const count = Math.min(props.pageLinkSize, pageCount.value)
  const start = Math.min(Math.max(1, currentPage.value - Math.floor(count / 2)), pageCount.value - count + 1)
  return Array.from({ length: count }, (_, index) => start + index)
})
const sizeOptions = computed(() => {
  const sizes = [...props.pageSizes]
  if (!sizes.includes(resolvedRows.value)) sizes.unshift(resolvedRows.value)
  return sizes
})

function setPage(page: number) {
  const nextPage = Math.min(Math.max(1, page), pageCount.value)
  if (props.disabled || nextPage === currentPage.value) return
  emit('update:modelValue', nextPage)
  emit('page', nextPage)
}

function setRows(next: number) {
  if (props.disabled || next === resolvedRows.value) return
  emit('update:rows', next)
  emit('update:pageSize', next)
  const nextCount = Math.max(1, Math.ceil(props.totalRecords / next))
  const nextPage = Math.min(currentPage.value, nextCount)
  if (nextPage !== currentPage.value) {
    emit('update:modelValue', nextPage)
    emit('page', nextPage)
  }
}

function onSizeChange(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value)
  if (Number.isFinite(value)) setRows(value)
}

function commitJump() {
  const value = Number.parseInt(jumpDraft.value, 10)
  jumpDraft.value = ''
  if (Number.isFinite(value)) setPage(value)
}

function pageLabel(page: number) {
  return formatLocale(locale.value.page, { page })
}

defineExpose({ first, pageCount })
</script>

<template>
  <nav
    class="wd-pagination"
    :class="{ 'wd-pagination--simple': simple }"
    :aria-label="locale.pagination"
  >
    <button type="button" class="wd-pagination__button" :disabled="disabled || currentPage === 1" :aria-label="locale.prevPage" @click="setPage(currentPage - 1)">
      <WdIcon name="chevron-left" size="sm" />
    </button>
    <template v-if="simple">
      <span class="wd-pagination__simple" aria-current="page">{{ currentPage }} / {{ pageCount }}</span>
    </template>
    <template v-else>
      <button v-for="page in pages" :key="page" type="button" class="wd-pagination__button" :class="{ 'wd-pagination__button--active': page === currentPage }" :disabled="disabled" :aria-label="pageLabel(page)" :aria-current="page === currentPage ? 'page' : undefined" @click="setPage(page)">
        {{ page }}
      </button>
    </template>
    <button type="button" class="wd-pagination__button" :disabled="disabled || currentPage === pageCount" :aria-label="locale.nextPage" @click="setPage(currentPage + 1)">
      <WdIcon name="chevron-right" size="sm" />
    </button>
    <label v-if="showSizePicker && !simple" class="wd-pagination__sizer">
      <span class="wd-pagination__sizer-label">{{ locale.itemsPerPage }}</span>
      <select class="wd-pagination__select" :disabled="disabled" :value="resolvedRows" @change="onSizeChange">
        <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }}</option>
      </select>
    </label>
    <label v-if="showQuickJumper && !simple" class="wd-pagination__jumper">
      <span>{{ locale.jumpToPage }}</span>
      <input
        class="wd-pagination__input"
        type="number"
        min="1"
        :max="pageCount"
        :disabled="disabled"
        :value="jumpDraft"
        @input="jumpDraft = ($event.target as HTMLInputElement).value"
        @keydown.enter.prevent="commitJump"
        @blur="commitJump"
      >
      <span v-if="locale.pageClassifier">{{ locale.pageClassifier }}</span>
    </label>
  </nav>
</template>
