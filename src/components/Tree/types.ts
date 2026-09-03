export interface TreeNode {
  key: string
  label: string
  children?: TreeNode[]
  icon?: string
  disabled?: boolean
  isLeaf?: boolean
}

export type TreeSelectionKeys = Record<string, boolean>
export type TreeCheckedKeys = Record<string, boolean>
export type TreeExpandedKeys = Record<string, boolean>
export type TreeSelectionMode = 'single' | 'multiple'
/** Naive `check-strategy`. Ignored when `checkStrictly`. */
export type TreeCheckStrategy = 'all' | 'parent' | 'child'

export interface TreeProps {
  value: TreeNode[]
  selectionKeys?: TreeSelectionKeys
  modelValue?: string | null
  selectionMode?: TreeSelectionMode
  showCheckbox?: boolean
  checkedKeys?: TreeCheckedKeys
  checkStrictly?: boolean
  /** Which keys to bind when cascading. Default `all`. */
  checkStrategy?: TreeCheckStrategy
  expandedKeys?: TreeExpandedKeys
  defaultExpandAll?: boolean
  accordion?: boolean
  filter?: string
  filterNode?: (value: string, data: TreeNode) => boolean
  lazy?: boolean
  load?: (node: TreeNode) => Promise<TreeNode[]> | TreeNode[]
  draggable?: boolean
  /** Empty state message when filter yields no results; defaults to locale `emptyMessage`. */
  emptyMessage?: string
}

export interface TreeEmits {
  (event: 'update:selectionKeys', value: TreeSelectionKeys): void
  (event: 'update:modelValue', value: string | null): void
  (event: 'update:checkedKeys', value: TreeCheckedKeys): void
  (event: 'update:expandedKeys', value: TreeExpandedKeys): void
  (event: 'node-expand', node: TreeNode): void
  (event: 'node-collapse', node: TreeNode): void
  (event: 'check', payload: { node: TreeNode; checkedKeys: TreeCheckedKeys }): void
  (event: 'node-drop', payload: { dragKey: string; dropKey: string; position: 'before' | 'after' | 'inside' }): void
}
