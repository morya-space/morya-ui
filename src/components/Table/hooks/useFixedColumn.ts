import type { Ref } from 'vue'
import type { HeaderForRender } from './internal'
import { computed } from 'vue'

interface FixedColumnInfo {
  value: string
  fixed: boolean | 'left' | 'right'
  distance: number
  width: number
}

const isRightFixed = (header: HeaderForRender) => header.fixed === 'right'
const isFixed = (header: HeaderForRender) => Boolean(header.fixed)

export function useFixedColumn(headersForRender: Ref<HeaderForRender[]>) {
  const fixedHeaders = computed(() => headersForRender.value.filter(isFixed))
  const leftFixedHeaders = computed(() => headersForRender.value.filter((header) => isFixed(header) && !isRightFixed(header)))
  const rightFixedHeaders = computed(() => headersForRender.value.filter(isRightFixed))

  const lastFixedColumn = computed(() =>
    leftFixedHeaders.value.length ? leftFixedHeaders.value[leftFixedHeaders.value.length - 1]!.value : '',
  )

  const firstRightFixedColumn = computed(() =>
    rightFixedHeaders.value.length ? rightFixedHeaders.value[0]!.value : '',
  )

  const fixedColumnsInfos = computed((): FixedColumnInfo[] => {
    if (!fixedHeaders.value.length) return []
    const leftInfos = leftFixedHeaders.value.map((header, index) => ({
      value: header.value,
      fixed: header.fixed ?? 'left',
      width: header.width ?? 100,
      distance: index === 0
        ? 0
        : leftFixedHeaders.value
            .slice(0, index)
            .reduce((sum, item) => sum + (item.width ?? 100), 0),
    }))
    const rightInfos = rightFixedHeaders.value.map((header, index) => ({
      value: header.value,
      fixed: 'right' as const,
      width: header.width ?? 100,
      distance: rightFixedHeaders.value
        .slice(index + 1)
        .reduce((sum, item) => sum + (item.width ?? 100), 0),
    }))
    return [...leftInfos, ...rightInfos]
  })

  return {
    fixedHeaders,
    lastFixedColumn,
    firstRightFixedColumn,
    fixedColumnsInfos,
  }
}
