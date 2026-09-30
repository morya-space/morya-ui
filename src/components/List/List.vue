<script setup lang="ts" generic="T = unknown">
import type { ListGridType, ListPaginationConfig, ListProps } from './types'
import { computed, provide, ref, toRef, useAttrs, useSlots, watch } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { useRootParts } from '../../shared/useComponentAttrs'
import MEmpty from '../Empty/Empty.vue'
import MLoading from '../Loading/Loading.vue'
import MPagination from '../Pagination/Pagination.vue'
import { LIST_KEY } from './types'

defineOptions({ inheritAttrs: false, name: 'MList' })

const props = withDefaults(defineProps<ListProps<T>>(), {
  bordered: false,
  split: true,
  loading: false,
  itemLayout: 'horizontal',
  pagination: false,
})

const attrs = useAttrs()
const slots = useSlots()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const sizeClass = useConfiguredSize('List', () => props.size)

const sourceItems = computed(() => {
  const raw = props.items ?? props.dataSource ?? props.data
  return Array.isArray(raw) ? raw : []
})

const dataMode = computed(() => sourceItems.value.length > 0)

const paginationConfig = computed((): ListPaginationConfig | null => {
  const pagination = props.pagination
  if (pagination === false || pagination == null) return null
  return pagination
})
const paginationEnabled = computed(() => paginationConfig.value != null)

const currentPage = ref(paginationConfig.value?.page ?? 1)
const pageSize = ref(paginationConfig.value?.pageSize ?? 10)

watch(
  () => paginationConfig.value?.page,
  (page) => {
    if (page != null) currentPage.value = page
  },
)

watch(
  () => paginationConfig.value?.pageSize,
  (size) => {
    if (size != null) pageSize.value = size
  },
)

const paginationTotal = computed(() => {
  if (!paginationEnabled.value) return 0
  return paginationConfig.value?.total ?? sourceItems.value.length
})

const pageCount = computed(() =>
  Math.max(1, Math.ceil(paginationTotal.value / Math.max(1, pageSize.value))),
)

watch(pageCount, (max) => {
  if (currentPage.value > max) currentPage.value = max
})

const pageItems = computed(() => {
  if (!dataMode.value) return [] as T[]
  if (!paginationEnabled.value) return sourceItems.value
  const total = paginationTotal.value
  const local = sourceItems.value
  if (total > local.length) return local
  const start = (currentPage.value - 1) * pageSize.value
  return local.slice(start, start + pageSize.value)
})

function resolveRowKey(item: T, index: number): string {
  const rk = props.rowKey
  if (typeof rk === 'function') return rk(item, index)
  if (typeof rk === 'string' && item != null && typeof item === 'object') {
    const value = (item as Record<string, unknown>)[rk]
    if (value != null) return String(value)
  }
  if (item != null && typeof item === 'object' && 'key' in item) {
    const key = (item as { key: unknown }).key
    if (key != null) return String(key)
  }
  return `list-item-${index}`
}

const showHeader = computed(() => Boolean(slots.header || props.header))
const showFooter = computed(() => Boolean(slots.footer || props.footer))
const showLoadMore = computed(() => Boolean(slots.loadMore))
const showEmpty = computed(
  () => dataMode.value && !props.loading && pageItems.value.length === 0,
)
const showManualEmpty = computed(
  () => !dataMode.value && !props.loading && !slots.default,
)

const paginationPosition = computed(
  () => paginationConfig.value?.position ?? 'bottom',
)
const paginationAlign = computed(
  () => paginationConfig.value?.align ?? 'end',
)

const showPaginationTop = computed(
  () =>
    paginationEnabled.value
    && dataMode.value
    && (paginationPosition.value === 'top' || paginationPosition.value === 'both'),
)
const showPaginationBottom = computed(
  () =>
    paginationEnabled.value
    && dataMode.value
    && (paginationPosition.value === 'bottom' || paginationPosition.value === 'both'),
)

provide(LIST_KEY, {
  bordered: toRef(props, 'bordered'),
  split: toRef(props, 'split'),
  itemLayout: toRef(props, 'itemLayout'),
  sizeClass,
  grid: toRef(props, 'grid'),
})

const rootClass = computed(() => [
  'm-list',
  `m-list--${sizeClass.value}`,
  `m-list--${props.itemLayout}`,
  {
    'm-list--bordered': props.bordered,
    'm-list--split': props.split,
    'm-list--grid': Boolean(props.grid),
    'm-list--loading': props.loading,
  },
])

function resolveGutter(grid?: ListGridType): string {
  const g = grid?.gutter
  if (g == null) return 'var(--m-list-grid-gutter)'
  if (typeof g === 'number') return `${g}px`
  return g
}

const gridStyle = computed(() => {
  const grid = props.grid
  if (!grid) return undefined
  const style: Record<string, string> = {
    '--m-list-grid-gutter': resolveGutter(grid),
    '--m-list-grid-column': String(grid.column ?? 1),
  }
  if (grid.xs != null) style['--m-list-grid-column-xs'] = String(grid.xs)
  if (grid.sm != null) style['--m-list-grid-column-sm'] = String(grid.sm)
  if (grid.md != null) style['--m-list-grid-column-md'] = String(grid.md)
  if (grid.lg != null) style['--m-list-grid-column-lg'] = String(grid.lg)
  if (grid.xl != null) style['--m-list-grid-column-xl'] = String(grid.xl)
  return style
})

const gridDataAttrs = computed(() => ({
  'data-grid-xs': props.grid?.xs != null ? '' : undefined,
  'data-grid-sm': props.grid?.sm != null ? '' : undefined,
  'data-grid-md': props.grid?.md != null ? '' : undefined,
  'data-grid-lg': props.grid?.lg != null ? '' : undefined,
  'data-grid-xl': props.grid?.xl != null ? '' : undefined,
}))

const itemsTag = computed(() => (props.grid ? 'div' : 'ul'))
const itemsClass = computed(() => [
  'm-list__items',
  { 'm-list__items--grid': Boolean(props.grid) },
])

const paginationClass = computed(() => [
  'm-list__pagination',
  `m-list__pagination--${paginationAlign.value}`,
])
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <div
      v-if="showHeader"
      class="m-list__header"
    >
      <slot name="header">
        {{ header }}
      </slot>
    </div>

    <div
      v-if="showPaginationTop"
      :class="paginationClass"
    >
      <MPagination
        v-model="currentPage"
        :total-records="paginationTotal"
        :rows="pageSize"
        size="small"
      />
    </div>

    <MLoading
      :loading="loading"
      size="sm"
    >
      <component
        :is="itemsTag"
        :class="itemsClass"
        :style="gridStyle"
        v-bind="gridDataAttrs"
      >
        <template v-if="dataMode">
          <template
            v-for="(item, index) in pageItems"
            :key="resolveRowKey(item, index)"
          >
            <slot
              name="item"
              :item="item"
              :index="index"
            >
              <slot
                :item="item"
                :index="index"
              />
            </slot>
          </template>
        </template>
        <slot v-else />
      </component>

      <div
        v-if="showEmpty || showManualEmpty"
        class="m-list__empty"
      >
        <MEmpty />
      </div>
    </MLoading>

    <div
      v-if="showLoadMore"
      class="m-list__load-more"
    >
      <slot name="loadMore" />
    </div>

    <div
      v-if="showPaginationBottom"
      :class="paginationClass"
    >
      <MPagination
        v-model="currentPage"
        :total-records="paginationTotal"
        :rows="pageSize"
        size="small"
      />
    </div>

    <div
      v-if="showFooter"
      class="m-list__footer"
    >
      <slot name="footer">
        {{ footer }}
      </slot>
    </div>
  </div>
</template>

