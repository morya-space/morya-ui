import type { Ref } from 'vue'
import type { TableItem, TableTreeConfig } from '../types'
import type { EmitsEventName } from './internal'
import { computed, ref, watch } from 'vue'
import {
  applyAccordionExpand,
  collectExpandableKeys,
  filterTreeNodes,
  flattenVisibleTree,
  getTreeChildren,
  nodeHasChildren,
  resolveTreeConfig,
  transformFlatToTree,
  type TableTreeNodeMeta,
} from '../core/tree'
import { resolveRowKey, stripSyntheticFields } from '../core/utils'
import { toggleExpandedRowKeys } from '../core/tableQuery'

export function useTreeRows(
  treeConfig: Ref<TableTreeConfig | null | undefined>,
  rows: Ref<TableItem[]>,
  rowKey: Ref<string>,
  expandedRowKeys: Ref<Array<string | number> | undefined>,
  searchValue: Ref<string>,
  searchField: Ref<string | string[]>,
  emits: (event: EmitsEventName, ...args: unknown[]) => void,
) {
  const treeEnabled = computed(() => treeConfig.value != null)
  const resolved = computed(() => resolveTreeConfig(treeConfig.value))
  const internalExpandedKeys = ref<Array<string | number>>([])
  const loadingKeys = ref<Set<string | number>>(new Set())
  const initialExpandApplied = ref(false)

  const expandedKeys = computed(() => expandedRowKeys.value ?? internalExpandedKeys.value)

  const treeRoots = computed(() => {
    if (!treeEnabled.value) return [] as TableItem[]
    const cfg = resolved.value
    const source = cfg.transform
      ? transformFlatToTree(rows.value, cfg.rowField || rowKey.value, cfg.parentField, cfg.childrenField)
      : rows.value

    const query = searchValue.value?.trim()
    if (!query) return source

    const fields = Array.isArray(searchField.value)
      ? searchField.value
      : searchField.value
        ? [searchField.value]
        : []

    const match = (item: TableItem) => {
      const haystacks = fields.length
        ? fields.map((field) => String(item[field] ?? ''))
        : Object.values(item)
          .filter((value) => value == null || typeof value !== 'object')
          .map((value) => String(value))
      const needle = query.toLowerCase()
      return haystacks.some((text) => text.toLowerCase().includes(needle))
    }

    return filterTreeNodes(source, cfg.childrenField, match)
  })

  function commitExpandedKeys(next: Array<string | number>, row?: TableItem, expanded?: boolean) {
    internalExpandedKeys.value = next
    emits('update:expandedRowKeys', next)
    if (row != null && expanded != null) {
      emits('expand', { row: stripSyntheticFields(row), expanded })
    }
  }

  watch(
    [treeEnabled, () => resolved.value.expandAll, () => resolved.value.expandRowKeys, treeRoots],
    () => {
      if (!treeEnabled.value || initialExpandApplied.value) return
      if (expandedRowKeys.value != null) {
        initialExpandApplied.value = true
        return
      }
      const cfg = resolved.value
      if (cfg.expandAll) {
        const keys = collectExpandableKeys(
          treeRoots.value,
          rowKey.value,
          cfg.childrenField,
          cfg.lazy,
          cfg.hasChildField,
        )
        commitExpandedKeys(keys)
        initialExpandApplied.value = true
        return
      }
      if (cfg.expandRowKeys?.length) {
        commitExpandedKeys([...cfg.expandRowKeys])
        initialExpandApplied.value = true
      }
    },
    { immediate: true },
  )

  watch(treeConfig, () => {
    initialExpandApplied.value = false
  })

  const flattened = computed(() => {
    if (!treeEnabled.value) {
      return { rows: [] as TableItem[], meta: new Map<string | number, TableTreeNodeMeta>() }
    }
    const cfg = resolved.value
    return flattenVisibleTree(
      treeRoots.value,
      expandedKeys.value,
      rowKey.value,
      cfg.childrenField,
      cfg.lazy,
      cfg.hasChildField,
      loadingKeys.value,
    )
  })

  const flatRows = computed(() => flattened.value.rows)
  const treeMeta = computed(() => flattened.value.meta)

  function keyOf(item: TableItem, index = 0) {
    return resolveRowKey(item, index, rowKey.value)
  }

  function isTreeExpandByRow(row: TableItem) {
    return expandedKeys.value.includes(keyOf(row))
  }

  function getTreeExpandRecords() {
    const keys = new Set(expandedKeys.value)
    const records: TableItem[] = []
    const cfg = resolved.value
    const walk = (nodes: TableItem[]) => {
      for (const node of nodes) {
        if (keys.has(keyOf(node))) records.push(stripSyntheticFields(node))
        walk(getTreeChildren(node, cfg.childrenField))
      }
    }
    walk(treeRoots.value)
    return records
  }

  async function ensureLazyChildren(item: TableItem, key: string | number) {
    const cfg = resolved.value
    if (!cfg.lazy) return true
    const children = getTreeChildren(item, cfg.childrenField)
    if (children.length || !cfg.loadMethod) return true
    const nextLoading = new Set(loadingKeys.value)
    nextLoading.add(key)
    loadingKeys.value = nextLoading
    try {
      const loaded = await cfg.loadMethod(item)
      item[cfg.childrenField] = loaded
    } finally {
      const done = new Set(loadingKeys.value)
      done.delete(key)
      loadingKeys.value = done
    }
    if (!nodeHasChildren(item, cfg.childrenField, false, cfg.hasChildField)) {
      item[cfg.hasChildField] = false
      return false
    }
    return true
  }

  async function setTreeExpand(
    rows: TableItem | TableItem[],
    expanded: boolean,
  ) {
    if (!treeEnabled.value) return
    const list = Array.isArray(rows) ? rows : [rows]
    const cfg = resolved.value
    let next = [...expandedKeys.value]

    for (const item of list) {
      const key = keyOf(item)
      const meta = treeMeta.value.get(key)
      const hasChildren = meta?.hasChildren
        ?? nodeHasChildren(item, cfg.childrenField, cfg.lazy, cfg.hasChildField)
      if (!hasChildren) continue

      const currently = next.includes(key)
      if (currently === expanded) continue

      if (cfg.toggleMethod) {
        const allowed = cfg.toggleMethod({ row: stripSyntheticFields(item), expanded })
        if (allowed === false) continue
      }

      if (expanded) {
        const ok = await ensureLazyChildren(item, key)
        if (!ok) continue
        if (cfg.accordion) {
          const parentKey = treeMeta.value.get(key)?.parentKey ?? null
          next = applyAccordionExpand(next, key, parentKey, treeMeta.value)
        } else if (!next.includes(key)) {
          next.push(key)
        }
      } else {
        next = next.filter((entry) => entry !== key)
      }
      emits('expand', { row: stripSyntheticFields(item), expanded })
    }

    commitExpandedKeys(next)
  }

  async function setAllTreeExpand(expanded: boolean) {
    if (!treeEnabled.value) return
    const cfg = resolved.value
    if (!expanded) {
      commitExpandedKeys([])
      return
    }
    const keys = collectExpandableKeys(
      treeRoots.value,
      rowKey.value,
      cfg.childrenField,
      cfg.lazy,
      cfg.hasChildField,
    )
    commitExpandedKeys(keys)
  }

  function clearTreeExpand() {
    commitExpandedKeys([])
  }

  async function toggleTreeExpand(row: TableItem) {
    await setTreeExpand(row, !isTreeExpandByRow(row))
  }

  async function toggleTreeNode(item: TableItem, index: number, event?: Event) {
    event?.stopPropagation()
    if (!treeEnabled.value) return
    if (resolved.value.trigger === 'manual') return
    const key = keyOf(item, index)
    const meta = treeMeta.value.get(key)
    if (!meta?.hasChildren) return

    const currentlyExpanded = expandedKeys.value.includes(key)
    const nextExpanded = !currentlyExpanded

    if (resolved.value.toggleMethod) {
      const allowed = resolved.value.toggleMethod({
        row: stripSyntheticFields(item),
        expanded: nextExpanded,
      })
      if (allowed === false) return
    }

    if (nextExpanded) {
      const ok = await ensureLazyChildren(item, key)
      if (!ok) return
    }

    let next: Array<string | number>
    if (currentlyExpanded) {
      ;({ next } = toggleExpandedRowKeys(expandedKeys.value, key))
    } else if (resolved.value.accordion && meta) {
      next = applyAccordionExpand(expandedKeys.value, key, meta.parentKey, treeMeta.value)
    } else {
      ;({ next } = toggleExpandedRowKeys(expandedKeys.value, key))
    }

    commitExpandedKeys(next, item, nextExpanded)
  }

  return {
    treeEnabled,
    treeResolved: resolved,
    treeRoots,
    flatRows,
    treeMeta,
    expandedKeys,
    isTreeExpandByRow,
    getTreeExpandRecords,
    setTreeExpand,
    setAllTreeExpand,
    clearTreeExpand,
    toggleTreeExpand,
    toggleTreeNode,
  }
}

export type { TableTreeNodeMeta }
