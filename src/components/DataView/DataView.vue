<script setup lang="ts">
import type { DataViewEmits, DataViewProps } from './types'
import { computed, ref, useSlots, watch } from 'vue'
import { useRdLocale } from '../../locale'
import RdPagination from '../Pagination/Pagination.vue'
import RdProgressSpinner from '../ProgressSpinner/ProgressSpinner.vue'

const props = withDefaults(defineProps<DataViewProps>(), {
  value: () => [],
  layout: 'list',
  paginator: false,
  rows: 10,
  loading: false,
  disabled: false,
  showSizePicker: false,
  pageSizes: () => [10, 20, 50, 100],
})

const emit = defineEmits<DataViewEmits>()

const locale = useRdLocale()
const slots = useSlots()
const innerPage = ref(1)

const page = computed({
  get: () => props.page ?? innerPage.value,
  set: (value: number) => {
    innerPage.value = value
    emit('update:page', value)
  },
})

const pagedValue = computed(() => {
  if (!props.paginator) return props.value
  const start = (page.value - 1) * props.rows
  return props.value.slice(start, start + props.rows)
})

const isEmpty = computed(() => !props.value.length)

const resolvedEmptyMessage = computed(
  () => props.emptyMessage ?? locale.value.emptyMessage,
)

const rootClass = computed(() => [
  'rd-dataview',
  `rd-dataview--${props.layout}`,
])

watch(
  () => [props.rows, props.paginator] as const,
  () => {
    page.value = 1
  },
)

watch(
  () => props.value.length,
  (length) => {
    if (!props.paginator || length === 0) return
    const maxPage = Math.max(1, Math.ceil(length / props.rows))
    if (page.value > maxPage) page.value = maxPage
  },
)
</script>

<template>
  <div :class="rootClass">
    <div v-if="slots.header" class="rd-dataview__header">
      <slot name="header" />
    </div>
    <div class="rd-dataview__content">
      <slot v-if="layout === 'list'" name="list" :items="pagedValue">
        <ul v-if="pagedValue.length" class="rd-dataview__list">
          <li v-for="(item, index) in pagedValue" :key="index" class="rd-dataview__list-item">
            {{ item }}
          </li>
        </ul>
      </slot>
      <slot v-else name="grid" :items="pagedValue">
        <div v-if="pagedValue.length" class="rd-dataview__grid">
          <div v-for="(item, index) in pagedValue" :key="index" class="rd-dataview__grid-item">
            {{ item }}
          </div>
        </div>
      </slot>

      <div v-if="loading" class="rd-dataview__loading">
        <div class="rd-dataview__loading-mask" />
        <div class="rd-dataview__loading-body">
          <slot v-if="slots.loading" name="loading" />
          <RdProgressSpinner v-else size="sm" />
        </div>
      </div>

      <div v-if="isEmpty && !loading" class="rd-dataview__message" role="status">
        <slot name="empty">
          <p class="rd-dataview__empty-text">{{ resolvedEmptyMessage }}</p>
        </slot>
      </div>
    </div>
    <RdPagination
      v-if="paginator"
      v-model="page"
      class="rd-dataview__paginator"
      :total-records="value.length"
      :rows="rows"
      :disabled="disabled"
      :show-size-picker="showSizePicker"
      :page-sizes="pageSizes"
    />
  </div>
</template>
