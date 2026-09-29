import type { ComputedRef, Ref } from 'vue'
import type { TableExpandConfig, TableItem } from '../types'
import type { EmitsEventName } from './internal'
import { computed, ref, watch } from 'vue'
import { toggleExpandedRowKeys } from '../core/tableQuery'
import { resolveRowKey, stripSyntheticFields } from '../core/utils'

export function useExpandableRow(
  expandedRowKeys: Ref<Array<string | number> | undefined>,
  rowKey: Ref<string>,
  prevPageEndIndex: ComputedRef<number>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
  expandConfig: Ref<TableExpandConfig | null | undefined>,
  expandableEnabled: ComputedRef<boolean>,
  allRows: ComputedRef<TableItem[]>,
) {
  const internalExpandedKeys = ref<Array<string | number>>([])
  const initialApplied = ref(false)
  const expandedKeys = computed(() => expandedRowKeys.value ?? internalExpandedKeys.value)

  const resolved = computed(() => ({
    expandAll: Boolean(expandConfig.value?.expandAll),
    expandRowKeys: expandConfig.value?.expandRowKeys,
    accordion: Boolean(expandConfig.value?.accordion),
    trigger: expandConfig.value?.trigger ?? 'default',
    toggleMethod: expandConfig.value?.toggleMethod,
  }))

  function commit(next: Array<string | number>, row?: TableItem, expanded?: boolean) {
    internalExpandedKeys.value = next
    emits('update:expandedRowKeys', next)
    if (row != null && expanded != null) {
      emits('expand', { row: stripSyntheticFields(row), expanded })
    }
  }

  watch(
    [expandableEnabled, () => resolved.value.expandAll, () => resolved.value.expandRowKeys, allRows],
    () => {
      if (!expandableEnabled.value || initialApplied.value) return
      if (expandedRowKeys.value != null) {
        initialApplied.value = true
        return
      }
      if (resolved.value.expandAll) {
        const keys = allRows.value.map((row, index) => resolveRowKey(row, index, rowKey.value))
        commit(keys)
        initialApplied.value = true
        return
      }
      if (resolved.value.expandRowKeys?.length) {
        commit([...resolved.value.expandRowKeys])
        initialApplied.value = true
      }
    },
    { immediate: true },
  )

  watch(expandConfig, () => {
    initialApplied.value = false
  })

  const keyOf = (item: TableItem, pageIndex: number) =>
    resolveRowKey(item, prevPageEndIndex.value + pageIndex, rowKey.value)

  const isRowExpanded = (item: TableItem, pageIndex: number) =>
    expandedKeys.value.includes(keyOf(item, pageIndex))

  function isRowExpandByRow(row: TableItem) {
    return expandedKeys.value.includes(resolveRowKey(row, 0, rowKey.value))
  }

  function getRowExpandRecords() {
    const keys = new Set(expandedKeys.value)
    return allRows.value.filter((row, index) =>
      keys.has(resolveRowKey(row, index, rowKey.value)),
    ).map(stripSyntheticFields)
  }

  function setRowExpand(rows: TableItem | TableItem[], expanded: boolean) {
    if (!expandableEnabled.value) return
    const list = Array.isArray(rows) ? rows : [rows]
    let next = [...expandedKeys.value]
    for (const item of list) {
      const key = resolveRowKey(item, 0, rowKey.value)
      const currently = next.includes(key)
      if (currently === expanded) continue
      if (resolved.value.toggleMethod) {
        const allowed = resolved.value.toggleMethod({
          row: stripSyntheticFields(item),
          expanded,
        })
        if (allowed === false) continue
      }
      if (expanded) {
        if (resolved.value.accordion) next = [key]
        else if (!currently) next.push(key)
      } else {
        next = next.filter((entry) => entry !== key)
      }
      emits('expand', { row: stripSyntheticFields(item), expanded })
    }
    commit(next)
  }

  function setAllRowExpand(expanded: boolean) {
    if (!expandableEnabled.value) return
    if (!expanded) {
      commit([])
      return
    }
    const keys = allRows.value.map((row, index) => resolveRowKey(row, index, rowKey.value))
    commit(keys)
  }

  function clearRowExpand() {
    commit([])
  }

  function toggleRowExpand(row: TableItem) {
    setRowExpand(row, !isRowExpandByRow(row))
  }

  const toggleExpandRow = (item: TableItem, pageIndex: number, event?: Event) => {
    event?.stopPropagation()
    if (!expandableEnabled.value) return
    if (resolved.value.trigger === 'manual') return
    const key = keyOf(item, pageIndex)
    const currently = expandedKeys.value.includes(key)
    const nextExpanded = !currently
    if (resolved.value.toggleMethod) {
      const allowed = resolved.value.toggleMethod({
        row: stripSyntheticFields(item),
        expanded: nextExpanded,
      })
      if (allowed === false) return
    }
    let next: Array<string | number>
    if (resolved.value.accordion && nextExpanded) {
      next = [key]
    } else {
      ;({ next } = toggleExpandedRowKeys(expandedKeys.value, key))
    }
    commit(next, item, nextExpanded)
  }

  return {
    expandResolved: resolved,
    expandedKeys,
    isRowExpanded,
    isRowExpandByRow,
    getRowExpandRecords,
    setRowExpand,
    setAllRowExpand,
    clearRowExpand,
    toggleRowExpand,
    toggleExpandRow,
  }
}
