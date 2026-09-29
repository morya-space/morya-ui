import type { TableItem } from '../types'
import { getTreeChildren } from './tree'
import { resolveRowKey, sameTableItem, stripSyntheticFields } from './utils'

export type TableCheckMethod = (row: TableItem) => boolean

export function walkTreeRows(
  nodes: TableItem[],
  childrenField: string,
  visit: (row: TableItem, depth: number, parent: TableItem | null) => void,
  depth = 0,
  parent: TableItem | null = null,
) {
  for (const node of nodes) {
    visit(node, depth, parent)
    const children = getTreeChildren(node, childrenField)
    if (children.length) walkTreeRows(children, childrenField, visit, depth + 1, node)
  }
}

/** Self + all descendants (depth-first). */
export function collectSubtree(
  row: TableItem,
  childrenField: string,
): TableItem[] {
  const list: TableItem[] = []
  walkTreeRows([row], childrenField, (node) => {
    list.push(node)
  })
  return list
}

export function isRowCheckable(row: TableItem, checkMethod?: TableCheckMethod | null) {
  return checkMethod ? checkMethod(row) : true
}

/**
 * Toggle selection for a tree row.
 * When `checkStrictly` is false, cascades to all descendants.
 * Parent half/full state is derived separately via `computeTreeIndeterminateKeys`.
 */
export function toggleTreeCheckboxSelection(options: {
  selected: TableItem[]
  row: TableItem
  rowKey: string
  childrenField: string
  checkStrictly: boolean
  checkMethod?: TableCheckMethod | null
}): { next: TableItem[]; selected: boolean; affected: TableItem[] } {
  const { selected, row, rowKey, childrenField, checkStrictly, checkMethod } = options
  const clean = stripSyntheticFields(row)
  const targets = (checkStrictly ? [clean] : collectSubtree(clean, childrenField))
    .filter((item) => isRowCheckable(item, checkMethod))
    .map(stripSyntheticFields)

  if (!targets.length) {
    return { next: selected, selected: false, affected: [] }
  }

  const currentlySelected = selected.some((entry) => sameTableItem(entry, clean, rowKey))
  const nextSelected = !currentlySelected

  let next = [...selected]
  if (nextSelected) {
    for (const target of targets) {
      if (!next.some((entry) => sameTableItem(entry, target, rowKey))) {
        next.push(target)
      }
    }
  } else {
    next = next.filter(
      (entry) => !targets.some((target) => sameTableItem(entry, target, rowKey)),
    )
  }

  return { next, selected: nextSelected, affected: targets }
}

/**
 * Bottom-up: mark parents as indeterminate when some (but not all) checkable
 * descendants are selected. Fully selected parents stay in `selected` only if
 * they were cascaded in; this map is for half-state UI.
 */
export function computeTreeIndeterminateKeys(
  roots: TableItem[],
  selected: TableItem[],
  rowKey: string,
  childrenField: string,
  checkMethod?: TableCheckMethod | null,
): Set<string | number> {
  const selectedKeys = new Set<string | number>()
  for (const item of selected) {
    const key = item[rowKey]
    if (typeof key === 'string' || typeof key === 'number') selectedKeys.add(key)
  }

  const indeterminate = new Set<string | number>()
  const parents: Array<{ row: TableItem; children: TableItem[] }> = []

  walkTreeRows(roots, childrenField, (row) => {
    const children = getTreeChildren(row, childrenField)
    if (children.length) parents.push({ row, children })
  })

  // deepest parents first
  parents.reverse()

  for (const { row, children } of parents) {
    const key = resolveRowKey(row, 0, rowKey)
    let selectedCount = 0
    let halfCount = 0
    let validCount = 0

    for (const child of children) {
      const childKey = resolveRowKey(child, 0, rowKey)
      const checkable = isRowCheckable(child, checkMethod)
      if (checkable) validCount += 1
      if (selectedKeys.has(childKey)) selectedCount += 1
      else if (indeterminate.has(childKey)) halfCount += 1
    }

    const fullySelected = validCount > 0 && selectedCount >= validCount
    const half = !fullySelected && (selectedCount > 0 || halfCount > 0)

    if (fullySelected) {
      if (typeof key === 'string' || typeof key === 'number') {
        selectedKeys.add(key)
      }
      indeterminate.delete(key)
    } else if (half) {
      indeterminate.add(key)
      selectedKeys.delete(key)
    } else {
      indeterminate.delete(key)
    }
  }

  return indeterminate
}

/**
 * After cascade select, ensure parents that are fully selected appear in the
 * selection list; remove parents that are only half-selected.
 */
export function syncTreeParentSelection(
  roots: TableItem[],
  selected: TableItem[],
  rowKey: string,
  childrenField: string,
  checkMethod?: TableCheckMethod | null,
): TableItem[] {
  const indeterminate = computeTreeIndeterminateKeys(
    roots,
    selected,
    rowKey,
    childrenField,
    checkMethod,
  )
  const selectedKeys = new Set<string | number>()
  for (const item of selected) {
    const key = item[rowKey]
    if (typeof key === 'string' || typeof key === 'number') selectedKeys.add(key)
  }

  const parents: TableItem[] = []
  walkTreeRows(roots, childrenField, (row) => {
    if (getTreeChildren(row, childrenField).length) parents.push(row)
  })
  parents.reverse()

  let next = selected.filter((item) => {
    const key = item[rowKey]
    if (typeof key !== 'string' && typeof key !== 'number') return true
    return !indeterminate.has(key)
  })

  for (const parent of parents) {
    const key = resolveRowKey(parent, 0, rowKey)
    if (indeterminate.has(key)) continue
    const children = getTreeChildren(parent, childrenField)
    const checkable = children.filter((child) => isRowCheckable(child, checkMethod))
    if (!checkable.length) continue
    const allSelected = checkable.every((child) => {
      const childKey = resolveRowKey(child, 0, rowKey)
      return selectedKeys.has(childKey)
        || next.some((entry) => sameTableItem(entry, child, rowKey))
    })
    if (allSelected) {
      const clean = stripSyntheticFields(parent)
      if (!next.some((entry) => sameTableItem(entry, clean, rowKey))) {
        next.push(clean)
        selectedKeys.add(key)
      }
    } else {
      next = next.filter((entry) => !sameTableItem(entry, parent, rowKey))
      selectedKeys.delete(key)
    }
  }

  return next
}
