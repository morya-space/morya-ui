import type { Ref } from 'vue'
import type { TableServerOptions } from '../types'
import { computed, ref } from 'vue'

export function useRows(
  isServerSideMode: Ref<boolean>,
  rowsItems: Ref<number[]>,
  serverOptions: Ref<TableServerOptions | null>,
  rowsPerPage: Ref<number>,
) {
  const rowsItemsComputed = computed(() => {
    if (!isServerSideMode.value && !rowsItems.value.includes(rowsPerPage.value)) {
      return [rowsPerPage.value, ...rowsItems.value]
    }
    return rowsItems.value
  })

  const rowsPerPageRef = ref(
    serverOptions.value ? serverOptions.value.rowsPerPage : rowsPerPage.value,
  )

  const updateRowsPerPage = (option: number) => {
    rowsPerPageRef.value = option
  }

  return {
    rowsItemsComputed,
    rowsPerPageRef,
    updateRowsPerPage,
  }
}
