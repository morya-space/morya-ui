import type { Ref } from 'vue'
import type {
  TableEditChangePayload,
  TableEditConfig,
  TableHeader,
  TableItem,
} from '../types'
import { ref } from 'vue'
import { isSyntheticColumn } from '../columns/keys'
import { getItemValue, stripSyntheticFields } from '../core/utils'

export interface UseCellEditOptions {
  editConfig: Ref<TableEditConfig | null>
  headers: Ref<TableHeader[]>
  getBodyRowKey: (item: TableItem, index: number) => string | number
  bodyRowIndex: (index: number) => number
  onEditChange: (payload: TableEditChangePayload) => void
}

export function useCellEdit(options: UseCellEditOptions) {
  const { editConfig, headers, getBodyRowKey, bodyRowIndex, onEditChange } = options

  const editingCell = ref<{ rowKey: string | number; column: string } | null>(null)
  const editingValue = ref('')

  function isColumnEditable(column: string) {
    if (!editConfig.value) return false
    if (isSyntheticColumn(column)) return false
    const header = headers.value.find((item) => item.value === column)
    return Boolean(header?.editable)
  }

  function isEditing(item: TableItem, index: number, column: string) {
    if (!editingCell.value) return false
    return editingCell.value.rowKey === getBodyRowKey(item, index) && editingCell.value.column === column
  }

  function beginEdit(item: TableItem, index: number, column: string) {
    if (!isColumnEditable(column)) return
    editingCell.value = { rowKey: getBodyRowKey(item, index), column }
    editingValue.value = String(getItemValue(column, item) ?? '')
  }

  function commitEdit(item: TableItem, index: number, column: string) {
    if (!editingCell.value) return
    const oldValue = getItemValue(column, item)
    const value = editingValue.value
    const payload: TableEditChangePayload = {
      row: stripSyntheticFields(item),
      column,
      value,
      oldValue,
      rowIndex: bodyRowIndex(index),
    }
    editingCell.value = null
    if (value === oldValue || String(oldValue ?? '') === value) return
    onEditChange(payload)
  }

  function cancelEdit() {
    editingCell.value = null
  }

  function onCellActivate(item: TableItem, index: number, column: string, event: MouseEvent) {
    if (!editConfig.value || !isColumnEditable(column)) return
    const trigger = editConfig.value.trigger ?? 'click'
    if (trigger === 'click' && event.type === 'click') beginEdit(item, index, column)
    if (trigger === 'dblclick' && event.type === 'dblclick') beginEdit(item, index, column)
  }

  function setEditingValue(value: unknown) {
    editingValue.value = String(value ?? '')
  }

  return {
    editingCell,
    editingValue,
    isEditing,
    beginEdit,
    commitEdit,
    cancelEdit,
    onCellActivate,
    setEditingValue,
    isColumnEditable,
  }
}
