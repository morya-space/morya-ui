import type { TreeExpandedKeys, TreeNode } from './types'
import { normalizeFilterQuery, textMatchesQuery } from '../../shared/filterByQuery'
import { walkTree } from './checkStrategy'

/** Default label matcher used by Tree filter. */
export function matchTreeNodeByLabel(value: string, data: { label: string }): boolean {
  return textMatchesQuery(data.label, normalizeFilterQuery(value))
}

/** True when the node or any descendant matches the filter. */
export function treeNodeMatchesFilter(
  node: TreeNode,
  query: string,
  matcher: (value: string, data: TreeNode) => boolean = matchTreeNodeByLabel,
): boolean {
  const trimmed = query.trim()
  if (!trimmed) return true
  if (matcher(trimmed, node)) return true
  return (node.children ?? []).some((child) => treeNodeMatchesFilter(child, query, matcher))
}

/** Keep roots that match themselves or contain a matching descendant. */
export function filterTreeRoots(
  nodes: TreeNode[],
  query: string,
  matcher?: (value: string, data: TreeNode) => boolean,
): TreeNode[] {
  if (!query.trim()) return nodes
  return nodes.filter((node) => treeNodeMatchesFilter(node, query, matcher))
}

/**
 * Prune a tree to matching nodes (TreeSelect-style).
 * Matching parents keep unmatched children; matching leaves bubble up.
 */
export function filterTreePrune<T extends { label: string; children?: T[] }>(
  nodes: T[],
  query: string,
): T[] {
  const normalized = normalizeFilterQuery(query)
  if (!normalized) return nodes
  const match = (node: T): T | null => {
    const self = textMatchesQuery(node.label, normalized)
    const children = (node.children ?? [])
      .map(match)
      .filter((item): item is T => item != null)
    if (self || children.length) {
      return { ...node, children: children.length ? children : node.children }
    }
    return null
  }
  return nodes.map(match).filter((item): item is T => item != null)
}

/** Collect keys of all nodes that have children (defaultExpandAll). */
export function collectExpandableTreeKeys(nodes: TreeNode[]): TreeExpandedKeys {
  const next: TreeExpandedKeys = {}
  walkTree(nodes, (node) => {
    if (node.children?.length) next[node.key] = true
  })
  return next
}

/**
 * Toggle one expanded key.
 * - `mode: 'delete'` (Tree): closing removes the key
 * - `mode: 'boolean'` (TreeSelect): closing stores `false`
 */
export function toggleTreeExpandedKey(
  expanded: TreeExpandedKeys,
  key: string,
  options: {
    accordion?: boolean
    /** Override detected open state (e.g. filter-forced expand). */
    open?: boolean
    mode?: 'delete' | 'boolean'
  } = {},
): TreeExpandedKeys {
  const mode = options.mode ?? 'delete'
  const currentlyOpen = options.open ?? Boolean(expanded[key])
  if (mode === 'boolean') {
    return { ...expanded, [key]: !currentlyOpen }
  }
  if (currentlyOpen) {
    const next = { ...expanded }
    delete next[key]
    return next
  }
  const next: TreeExpandedKeys = options.accordion ? {} : { ...expanded }
  next[key] = true
  return next
}
