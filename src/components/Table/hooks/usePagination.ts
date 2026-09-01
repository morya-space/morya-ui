import type { Ref } from 'vue'
import type { TableServerOptions } from '../types'
import { computed, ref } from 'vue'

export function usePagination(
  currentPage: Ref<number>,
  isServerSideMode: Ref<boolean>,
  loading: Ref<boolean>,
  totalItemsLength: Ref<number>,
  rowsPerPage: Ref<number>,
  serverOptions: Ref<TableServerOptions | null>,
  updateServerOptionsPage: (page: number) => void,
) {
  const currentPaginationNumber = ref(
    serverOptions.value ? serverOptions.value.page : currentPage.value,
  )
  const maxPaginationNumber = computed(() => Math.ceil(totalItemsLength.value / rowsPerPage.value))
  const isLastPage = computed(
    () => maxPaginationNumber.value === 0 || currentPaginationNumber.value === maxPaginationNumber.value,
  )
  const isFirstPage = computed(() => currentPaginationNumber.value === 1)

  const nextPage = () => {
    if (totalItemsLength.value === 0 || isLastPage.value || loading.value) return
    if (isServerSideMode.value) updateServerOptionsPage(currentPaginationNumber.value + 1)
    else currentPaginationNumber.value += 1
  }

  const prevPage = () => {
    if (totalItemsLength.value === 0 || isFirstPage.value || loading.value) return
    if (isServerSideMode.value) updateServerOptionsPage(currentPaginationNumber.value - 1)
    else currentPaginationNumber.value -= 1
  }

  const updatePage = (page: number) => {
    if (loading.value) return
    if (isServerSideMode.value) updateServerOptionsPage(page)
    else currentPaginationNumber.value = page
  }

  const updateCurrentPaginationNumber = (page: number) => {
    currentPaginationNumber.value = page
  }

  return {
    currentPaginationNumber,
    maxPaginationNumber,
    isLastPage,
    isFirstPage,
    nextPage,
    prevPage,
    updatePage,
    updateCurrentPaginationNumber,
  }
}
