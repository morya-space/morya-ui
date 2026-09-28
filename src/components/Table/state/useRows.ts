import type { Ref } from 'vue'
import type { TableServerOptions } from '../types'
import { computed, ref, watch } from 'vue'

export function useRows(
  isServerSideMode: Ref<boolean>,
  pageSizes: Ref<number[]>,
  serverOptions: Ref<TableServerOptions | null>,
  rowsPerPage: Ref<number>,
) {
  const pageSizesComputed = computed(() => {
    if (!isServerSideMode.value && !pageSizes.value.includes(rowsPerPage.value)) {
      return [rowsPerPage.value, ...pageSizes.value]
    }
    return pageSizes.value
  })

  const rowsPerPageRef = ref(
    serverOptions.value ? serverOptions.value.rowsPerPage : rowsPerPage.value,
  )

  watch(rowsPerPage, (value) => {
    if (!isServerSideMode.value && value !== rowsPerPageRef.value) {
      rowsPerPageRef.value = value
    }
  })

  watch(
    () => serverOptions.value?.rowsPerPage,
    (value) => {
      if (isServerSideMode.value && value != null && value !== rowsPerPageRef.value) {
        rowsPerPageRef.value = value
      }
    },
  )

  const updateRowsPerPage = (option: number) => {
    rowsPerPageRef.value = option
  }

  return {
    pageSizesComputed,
    rowsPerPageRef,
    updateRowsPerPage,
  }
}
