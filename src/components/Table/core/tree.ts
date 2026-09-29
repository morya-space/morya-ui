import type { TableItem, TableTreeConfig } from '../types'
import { resolveRowKey } from './utils'

export interface TableTreeNodeMeta {
  depth: number
  hasChildren: boolean
  loading: boolean
  parentKey: string | number | null
}

export function resolveTreeConfig(config: TableTreeConfig | null | undefined): Required<
  Pick<
    TableTreeConfig,
    'childrenField' | 'indent' | 'expandAll' | 'accordion' | 'trigger' | 'lazy' | 'hasChildField' | 'transform' | 'rowField' | 'parentField' | 'showLine'
  >
> & Pick<TableTreeConfig, 'treeNode' | 'loadMethod' | 'expandRowKeys' | 'toggleMethod'> {
  return {
    childrenField: config?.childrenField ?? 'children',
    indent: config?.indent ?? 16,
    expandAll: Boolean(config?.expandAll),
    accordion: Boolean(config?.accordion),
    trigger: config?.trigger ?? 'default',
    lazy: Boolean(config?.lazy),
    hasChildField: config?.hasChildField ?? 'hasChild',
    transform: Boolean(config?.transform),
    rowField: config?.rowField ?? 'id',
    parentField: config?.parentField ?? 'parentId',
    showLine: Boolean(config?.showLine),
    treeNode: config?.treeNode,
    loadMethod: config?.loadMethod,
    expandRowKeys: config?.expandRowKeys,
    toggleMethod: config?.toggleMethod,
  }
}

/** Convert flat parentId rows into a nested tree (`transform`). */
export function transformFlatToTree(
  rows: TableItem[],
  rowField: string,
  parentField: string,
  childrenField: string,
): TableItem[] {
  const map = new Map<string | number, TableItem>()
  const roots: TableItem[] = []

  for (const row of rows) {
    const key = row[rowField]
    if (typeof key !== 'string' && typeof key !== 'number') continue
    map.set(key, { ...row, [childrenField]: [] as TableItem[] })
  }

  for (const row of rows) {
    const key = row[rowField]
    if (typeof key !== 'string' && typeof key !== 'number') continue
    const node = map.get(key)!
    const parentId = row[parentField]
    if (parentId === null || parentId === undefined || parentId === '') {
      roots.push(node)
      continue
    }
    const parent = map.get(parentId as string | number)
    if (!parent) {
      roots.push(node)
      continue
    }
    const children = parent[childrenField] as TableItem[]
    children.push(node)
  }

  const pruneEmpty = (nodes: TableItem[]) => {
    for (const node of nodes) {
      const children = node[childrenField] as TableItem[] | undefined
      if (children?.length) pruneEmpty(children)
      else delete node[childrenField]
    }
  }
  pruneEmpty(roots)
  return roots
}

export function getTreeChildren(
  item: TableItem,
  childrenField: string,
): TableItem[] {
  const children = item[childrenField]
  return Array.isArray(children) ? (children as TableItem[]) : []
}

export function nodeHasChildren(
  item: TableItem,
  childrenField: string,
  lazy: boolean,
  hasChildField: string,
): boolean {
  const children = getTreeChildren(item, childrenField)
  if (children.length > 0) return true
  if (lazy) return Boolean(item[hasChildField])
  return false
}

/** Collect every expandable key under roots (for expandAll). */
export function collectExpandableKeys(
  roots: TableItem[],
  rowKey: string,
  childrenField: string,
  lazy: boolean,
  hasChildField: string,
): Array<string | number> {
  const keys: Array<string | number> = []
  const walk = (nodes: TableItem[], indexBase: number) => {
    nodes.forEach((node, index) => {
      const key = resolveRowKey(node, indexBase + index, rowKey)
      if (nodeHasChildren(node, childrenField, lazy, hasChildField)) {
        keys.push(key)
        walk(getTreeChildren(node, childrenField), 0)
      }
    })
  }
  walk(roots, 0)
  return keys
}

/**
 * Flatten visible tree rows according to expanded keys.
 * Attaches meta in a parallel Map keyed by rowKey.
 */
export function flattenVisibleTree(
  roots: TableItem[],
  expandedKeys: ReadonlyArray<string | number>,
  rowKey: string,
  childrenField: string,
  lazy: boolean,
  hasChildField: string,
  loadingKeys: ReadonlySet<string | number>,
): { rows: TableItem[]; meta: Map<string | number, TableTreeNodeMeta> } {
  const rows: TableItem[] = []
  const meta = new Map<string | number, TableTreeNodeMeta>()
  const expanded = new Set(expandedKeys)

  const walk = (
    nodes: TableItem[],
    depth: number,
    parentKey: string | number | null,
  ) => {
    nodes.forEach((node, index) => {
      const key = resolveRowKey(node, index, rowKey)
      const hasChildren = nodeHasChildren(node, childrenField, lazy, hasChildField)
      meta.set(key, {
        depth,
        hasChildren,
        loading: loadingKeys.has(key),
        parentKey,
      })
      rows.push(node)
      if (hasChildren && expanded.has(key)) {
        const children = getTreeChildren(node, childrenField)
        if (children.length) walk(children, depth + 1, key)
      }
    })
  }

  walk(roots, 0, null)
  return { rows, meta }
}

/**
 * Keep nodes that match, or have a matching descendant.
 * Matching parents keep their original children; non-matching parents keep only filtered children.
 */
export function filterTreeNodes(
  nodes: TableItem[],
  childrenField: string,
  match: (item: TableItem) => boolean,
): TableItem[] {
  const result: TableItem[] = []
  for (const node of nodes) {
    const children = getTreeChildren(node, childrenField)
    const selfMatch = match(node)
    if (selfMatch) {
      result.push(node)
      continue
    }
    if (!children.length) continue
    const filteredChildren = filterTreeNodes(children, childrenField, match)
    if (filteredChildren.length) {
      result.push({ ...node, [childrenField]: filteredChildren })
    }
  }
  return result
}

export function sortTreeNodes(
  nodes: TableItem[],
  childrenField: string,
  compare: (a: TableItem, b: TableItem) => number,
): TableItem[] {
  const sorted = [...nodes].sort(compare)
  return sorted.map((node) => {
    const children = getTreeChildren(node, childrenField)
    if (!children.length) return node
    return {
      ...node,
      [childrenField]: sortTreeNodes(children, childrenField, compare),
    }
  })
}

/** Accordion: expand `nextKey`, collapse other expanded keys that share the same parent. */
export function applyAccordionExpand(
  expandedKeys: ReadonlyArray<string | number>,
  nextKey: string | number,
  parentKey: string | number | null,
  meta: Map<string | number, TableTreeNodeMeta>,
): Array<string | number> {
  const siblingKeys = new Set<string | number>()
  for (const [key, info] of meta) {
    if (info.parentKey === parentKey && key !== nextKey) siblingKeys.add(key)
  }
  const kept = expandedKeys.filter((key) => !siblingKeys.has(key) && key !== nextKey)
  return [...kept, nextKey]
}
