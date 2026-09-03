import type { InjectionKey, Ref, Slot } from 'vue'
import type { TreeNode } from './types'

export interface TreeContext {
  isExpanded: (key: string) => boolean
  isSelected: (key: string) => boolean
  isChecked: (key: string) => boolean
  isIndeterminate: (key: string) => boolean
  isDisabled: (node: TreeNode) => boolean
  isLeaf: (node: TreeNode) => boolean
  /** True when the node has (or may lazily produce) children. */
  hasChildren: (node: TreeNode) => boolean
  isMatch: (node: TreeNode) => boolean
  showCheckbox: boolean
  draggable: boolean
  lazy: boolean
  loadingKeys: Record<string, boolean>
  /** Children resolved by lazy `load`, keyed by node key (props stay unmutated). */
  loadedChildren: Record<string, TreeNode[]>
  loadedKeys: Record<string, boolean>
  loadFailedKeys: Record<string, boolean>
  /** Key of the keyboard-highlighted node, `null` when none. */
  activeKey: Ref<string | null>
  /** Roving tabindex for a treeitem: `0` for the active node, `-1` otherwise. */
  tabindexForKey: (key: string) => 0 | -1
  /** Sync the keyboard highlight with a node focused by pointer or script. */
  setActiveKey: (key: string) => void
  toggleExpand: (node: TreeNode) => void
  select: (node: TreeNode) => void
  toggleCheck: (node: TreeNode) => void
  onDragStart: (node: TreeNode, event: DragEvent) => void
  onDragOver: (node: TreeNode, event: DragEvent) => void
  onDrop: (node: TreeNode, event: DragEvent) => void
  onDragEnd: () => void
}

export interface TreeNodeSlotProps { node: TreeNode; data: TreeNode }

export const WI_TREE_KEY: InjectionKey<TreeContext> = Symbol('wi-tree')
export const WI_TREE_NODE_SLOT: InjectionKey<Slot<TreeNodeSlotProps> | undefined> = Symbol('wi-tree-node-slot')
