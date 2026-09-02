<script setup lang="ts">
import { useSlots } from 'vue'
import {
  WiButton,
  WiLayoutContent,
  WiSpace,
  WiTable,
} from '@well-insight/ui'
import { useLocale } from '@/composables/useLocale'

withDefaults(defineProps<{
  title: string
  columns: Array<{ key: string; label: string; width?: number }>
  rows: unknown[]
  loading?: boolean
  rowKey?: string
  paginator?: boolean
  rowsPerPage?: number
  selectionMode?: 'multiple' | 'single'
  /** Accessible name for the data table. */
  tableLabel?: string
  showCreate?: boolean
}>(), {
  loading: false,
  rowKey: 'id',
  paginator: true,
  rowsPerPage: 10,
  selectionMode: undefined,
  tableLabel: undefined,
  showCreate: true,
})

const emit = defineEmits<{
  create: []
}>()

const selection = defineModel<unknown[] | null>('selection')
const slots = useSlots()
const { t } = useLocale()
</script>

<template>
  <WiLayoutContent content-class="list-page">
    <section
      v-if="slots.filters"
      class="list-page__filters"
      :aria-label="t('筛选条件', 'Filters')"
    >
      <slot name="filters" />
    </section>

    <header class="list-page__toolbar">
      <h1 class="list-page__title">{{ title }}</h1>
      <WiSpace>
        <slot name="actions" />
        <WiButton
          v-if="showCreate"
          @click="emit('create')"
        >
          {{ t('新建', 'Create') }}
        </WiButton>
      </WiSpace>
    </header>

    <div class="list-page__table">
      <WiTable
        v-model:selection="selection as Record<string, unknown>[] | null"
        class="list-page__table-inner"
        :columns="columns"
        :rows="rows as unknown as Record<string, unknown>[]"
        :loading="loading"
        :row-key="rowKey"
        :paginator="paginator"
        :rows-per-page="rowsPerPage"
        :selection-mode="selectionMode"
        :aria-label="tableLabel || title"
        striped
        bordered
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot v-if="String(name).startsWith('cell-') || name === 'empty'" :name="name" v-bind="slotData" />
        </template>
        <template #empty>
          <slot name="empty">
            <p class="list-page__empty">{{ t('暂无数据', 'No data') }}</p>
          </slot>
        </template>
      </WiTable>
    </div>
  </WiLayoutContent>
</template>

<style scoped>
:deep(.list-page) {
  padding: var(--wi-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--wi-space-4);
}

.list-page__filters {
  padding: var(--wi-space-4);
  background: color-mix(in srgb, var(--wi-color-border) 25%, transparent);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
}

.list-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wi-space-4);
  flex-wrap: wrap;
}

.list-page__title {
  margin: 0;
  font-size: var(--wi-font-size-lg);
  font-weight: 600;
}

.list-page__table {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.list-page__table-inner {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.list-page__table-inner :deep(.wi-table__scrollbar) {
  flex: 1 1 auto;
  min-height: 0;
}

.list-page__empty {
  margin: 0;
  padding: var(--wi-space-8);
  text-align: center;
  color: var(--wi-color-text-muted);
}
</style>
