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

export interface TreeProps {
  value: TreeNode[]
  selectionKeys?: TreeSelectionKeys
  modelValue?: string | null
  selectionMode?: TreeSelectionMode
  showCheckbox?: boolean
  checkedKeys?: TreeCheckedKeys
  checkStrictly?: boolean
  expandedKeys?: TreeExpandedKeys
  defaultExpandAll?: boolean
  accordion?: boolean
  filter?: string
  filterNode?: (value: string, data: TreeNode) => boolean
  lazy?: boolean
  load?: (node: TreeNode) => Promise<TreeNode[]> | TreeNode[]
  draggable?: boolean
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
