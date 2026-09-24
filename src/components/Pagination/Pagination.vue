<script setup lang="ts">

import type { SelectModelValue, SelectOption } from '../Select/types'
import type { PaginationProps } from './types'
import { computed, useAttrs } from 'vue'
import { formatLocale, useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from '../Icon/Icon.vue'
import MSelect from '../Select/Select.vue'
defineOptions({ inheritAttrs: false })

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
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const locale = useMLocale()
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
const pageOptions = computed<SelectOption[]>(() => {
  if (!props.showQuickJumper || props.simple) return []
  return Array.from({ length: pageCount.value }, (_, index) => {
    const value = index + 1
    return { label: String(value), value }
  })
})
const jumperPt = computed(() => ({
  control: { 'aria-label': locale.value.jumpToPage },
}))

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

function onPageJump(value: SelectModelValue) {
  if (typeof value !== 'number' && typeof value !== 'string') return
  const page = typeof value === 'number' ? value : Number(value)
  if (Number.isFinite(page)) setPage(page)
}

function pageLabel(page: number) {
  return formatLocale(locale.value.page, { page })
}

defineExpose({ first, pageCount })
</script>

<template>
  <nav
    v-bind="rootAttrs"
    class="m-pagination"
    :class="{ 'm-pagination--simple': simple }"
    :aria-label="locale.pagination"
  >
    <button type="button" class="m-pagination__button" :disabled="disabled || currentPage === 1" :aria-label="locale.prevPage" @click="setPage(currentPage - 1)">
      <MIcon name="chevron-left" size="sm" />
    </button>
    <template v-if="simple">
      <span class="m-pagination__simple" aria-current="page">{{ currentPage }} / {{ pageCount }}</span>
    </template>
    <template v-else>
      <button v-for="page in pages" :key="page" type="button" class="m-pagination__button" :class="{ 'm-pagination__button--active': page === currentPage }" :disabled="disabled" :aria-label="pageLabel(page)" :aria-current="page === currentPage ? 'page' : undefined" @click="setPage(page)">
        {{ page }}
      </button>
    </template>
    <button type="button" class="m-pagination__button" :disabled="disabled || currentPage === pageCount" :aria-label="locale.nextPage" @click="setPage(currentPage + 1)">
      <MIcon name="chevron-right" size="sm" />
    </button>
    <label v-if="showSizePicker && !simple" class="m-pagination__sizer">
      <span class="m-pagination__sizer-label">{{ locale.itemsPerPage }}</span>
      <select class="m-pagination__select" :disabled="disabled" :value="resolvedRows" @change="onSizeChange">
        <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }}</option>
      </select>
    </label>
    <div v-if="showQuickJumper && !simple" class="m-pagination__jumper">
      <span>{{ locale.jumpToPage }}</span>
      <MSelect
        class="m-pagination__jumper-select"
        size="small"
        :model-value="currentPage"
        :options="pageOptions"
        :disabled="disabled"
        :filter="pageCount > 10"
        :pt="jumperPt"
        @update:model-value="onPageJump"
      />
      <span v-if="locale.pageClassifier">{{ locale.pageClassifier }}</span>
    </div>
  </nav>
</template>
