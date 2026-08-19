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
}

export interface TreeTableEmits {
  (event: 'node-expand', node: TreeTableNode): void
  (event: 'node-collapse', node: TreeTableNode): void
}
