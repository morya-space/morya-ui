import type { InjectionKey, Slot } from 'vue'
import type { TreeNode } from './types'

export interface TreeContext {
  isExpanded: (key: string) => boolean
  isSelected: (key: string) => boolean
  isChecked: (key: string) => boolean
  isIndeterminate: (key: string) => boolean
  isDisabled: (node: TreeNode) => boolean
  isLeaf: (node: TreeNode) => boolean
  isMatch: (node: TreeNode) => boolean
  showCheckbox: boolean
  draggable: boolean
  lazy: boolean
  loadingKeys: Record<string, boolean>
  toggleExpand: (node: TreeNode) => void
  select: (node: TreeNode) => void
  toggleCheck: (node: TreeNode) => void
  onDragStart: (node: TreeNode, event: DragEvent) => void
  onDragOver: (node: TreeNode, event: DragEvent) => void
  onDrop: (node: TreeNode, event: DragEvent) => void
}

export interface TreeNodeSlotProps { node: TreeNode; data: TreeNode }

export const WI_TREE_KEY: InjectionKey<TreeContext> = Symbol('wi-tree')
export const WI_TREE_NODE_SLOT: InjectionKey<Slot<TreeNodeSlotProps> | undefined> = Symbol('wi-tree-node-slot')
