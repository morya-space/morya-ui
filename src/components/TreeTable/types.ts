export interface TreeTableColumn {
  field: string
  header: string
}

export interface TreeTableNode {
  key: string
  data: Record<string, unknown>
  children?: TreeTableNode[]
}

export interface TreeTableProps {
  value: TreeTableNode[]
  columns: TreeTableColumn[]
  /** Controlled expanded keys map (`v-model:expandedKeys`). Uncontrolled when omitted. */
  expandedKeys?: Record<string, boolean>
  /** Empty state message; defaults to locale `emptyMessage`. */
  emptyMessage?: string
}

export interface TreeTableEmits {
  (event: 'node-expand', node: TreeTableNode): void
  (event: 'node-collapse', node: TreeTableNode): void
  (event: 'update:expandedKeys', value: Record<string, boolean>): void
}
