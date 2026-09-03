import { ref } from 'vue'

export function useCrudDialog<T extends { id: string }>() {
  const dialogOpen = ref(false)
  const mode = ref<'create' | 'edit'>('create')
  const editingRow = ref<T | null>(null)
  const deleteOpen = ref(false)
  const deletingRow = ref<T | null>(null)

  function openCreate() {
    mode.value = 'create'
    editingRow.value = null
    dialogOpen.value = true
  }

  function openEdit(row: T) {
    mode.value = 'edit'
    editingRow.value = row
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
  }

  function askDelete(row: T) {
    deletingRow.value = row
    deleteOpen.value = true
  }

  function closeDelete() {
    deleteOpen.value = false
    deletingRow.value = null
  }

  return {
    dialogOpen,
    mode,
    editingRow,
    deleteOpen,
    deletingRow,
    openCreate,
    openEdit,
    closeDialog,
    askDelete,
    closeDelete,
  }
}
