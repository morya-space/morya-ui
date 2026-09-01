import type { ComputedRef, Ref } from 'vue'
import type { HeaderForRender } from './internal'
import { computed } from 'vue'

type FixedColumnInfo = {
  value: string
  fixed: boolean
  distance: number
  width: number
}

export function useFixedColumn(headersForRender: Ref<HeaderForRender[]>) {
  const fixedHeaders = computed(() => headersForRender.value.filter((header) => header.fixed))

  const lastFixedColumn = computed(() =>
    fixedHeaders.value.length ? fixedHeaders.value[fixedHeaders.value.length - 1]!.value : '',
  )

  const fixedColumnsInfos = computed((): FixedColumnInfo[] => {
    if (!fixedHeaders.value.length) return []
    const widths = fixedHeaders.value.map((header) => header.width ?? 100)
    return fixedHeaders.value.map((header, index) => ({
      value: header.value,
      fixed: header.fixed ?? true,
      width: header.width ?? 100,
      distance: index === 0
        ? 0
        : widths.slice(0, index).reduce((sum, width) => sum + width, 0),
    }))
  })

  return {
    fixedHeaders,
    lastFixedColumn,
    fixedColumnsInfos,
  }
}
