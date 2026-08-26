import type { TreeCheckedKeys, TreeCheckStrategy, TreeNode } from './types'

export function walkTree(nodes: TreeNode[], visit: (node: TreeNode, parent?: TreeNode) => void, parent?: TreeNode) {
  for (const node of nodes) {
    visit(node, parent)
    if (node.children?.length) walkTree(node.children, visit, node)
  }
}

export function setCheckedCascade(node: TreeNode, value: boolean, map: TreeCheckedKeys) {
  if (value) map[node.key] = true
  else delete map[node.key]
  for (const child of node.children ?? []) setCheckedCascade(child, value, map)
}

function isIndeterminateKey(key: string, map: TreeCheckedKeys, childrenMap: Map<string, TreeNode[]>) {
  const children = childrenMap.get(key) ?? []
  if (!children.length) return false
  let checkedCount = 0
  for (const child of children) {
    if (map[child.key]) checkedCount += 1
    if (isIndeterminateKey(child.key, map, childrenMap)) return true
  }
  return checkedCount > 0 && checkedCount < children.length
}

export function buildChildMap(nodes: TreeNode[]) {
  const map = new Map<string, TreeNode[]>()
  walkTree(nodes, (node) => {
    map.set(node.key, node.children ?? [])
  })
  return map
}

export function syncAncestors(nodes: TreeNode[], map: TreeCheckedKeys) {
  const childrenMap = buildChildMap(nodes)
  const visit = (list: TreeNode[]) => {
    for (const node of list) {
      if (!node.children?.length) continue
      visit(node.children)
      const children = node.children
      const all = children.every((child) => map[child.key])
      if (all) map[node.key] = true
      else delete map[node.key]
    }
  }
  visit(nodes)
}

export function expandCheckedKeys(
  nodes: TreeNode[],
  incoming: TreeCheckedKeys,
  strategy: TreeCheckStrategy,
  strict: boolean,
): TreeCheckedKeys {
  const next: TreeCheckedKeys = { ...incoming }
  if (strict) return next
  if (strategy === 'parent') {
    walkTree(nodes, (node) => {
      if (incoming[node.key]) setCheckedCascade(node, true, next)
    })
  }
  syncAncestors(nodes, next)
  return next
}

export function projectCheckedKeys(
  nodes: TreeNode[],
  full: TreeCheckedKeys,
  strategy: TreeCheckStrategy,
  strict: boolean,
): TreeCheckedKeys {
  if (strict || strategy === 'all') return { ...full }
  const out: TreeCheckedKeys = {}
  if (strategy === 'child') {
    walkTree(nodes, (node) => {
      if (full[node.key] && !node.children?.length) out[node.key] = true
    })
    return out
  }
  const visit = (list: TreeNode[], parentChecked: boolean) => {
    for (const node of list) {
      const checked = Boolean(full[node.key])
      if (checked && !parentChecked) out[node.key] = true
      if (node.children?.length) visit(node.children, checked)
    }
  }
  visit(nodes, false)
  return out
}

export function findNode<T extends { key: string; children?: T[]; label: string }>(
  nodes: T[],
  key: string | null | undefined,
): T | null {
  if (!key) return null
  for (const node of nodes) {
    if (node.key === key) return node
    const nested = findNode(node.children ?? [], key)
    if (nested) return nested
  }
  return null
}

export function nodePathLabels<T extends { key: string; children?: T[]; label: string }>(
  nodes: T[],
  key: string,
): string[] {
  const path: string[] = []
  const search = (list: T[], trail: string[]): boolean => {
    for (const node of list) {
      const next = [...trail, node.label]
      if (node.key === key) {
        path.push(...next)
        return true
      }
      if (node.children?.length && search(node.children, next)) return true
    }
    return false
  }
  search(nodes, [])
  return path
}
