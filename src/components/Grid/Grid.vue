<script setup lang="ts">
import {
  Comment,
  cloneVNode,
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  toRef,
  useSlots,
  watch,
  type VNode,
} from 'vue'
import { parseResponsiveValue } from '../../shared/responsive'
import { flattenVNodes } from '../../shared/vnode'
import { WI_GRID_ITEM_FLAG, WI_GRID_KEY, type GridProps } from './types'

defineOptions({ name: 'WiGrid', inheritAttrs: false })

const props = withDefaults(defineProps<GridProps>(), {
  layoutShiftDisabled: false,
  responsive: 'self',
  cols: 24,
  xGap: 0,
  yGap: 0,
  itemResponsive: false,
  collapsed: false,
  collapsedRows: 1,
})

const slots = useSlots()
const rootEl = ref<HTMLElement | null>(null)
const queryWidth = ref<number | undefined>(undefined)
const overflow = ref(false)

const needsQuery = computed(() => {
  if (props.itemResponsive) return true
  const numOnly = /^\d+(\.\d+)?$/
  if (!numOnly.test(String(props.cols))) return true
  if (!numOnly.test(String(props.xGap))) return true
  if (!numOnly.test(String(props.yGap))) return true
  return false
})

function measure() {
  if (!needsQuery.value) {
    queryWidth.value = undefined
    return
  }
  if (props.responsive === 'self') {
    queryWidth.value = rootEl.value?.clientWidth
    return
  }
  queryWidth.value = typeof window !== 'undefined' ? window.innerWidth : undefined
}

let resizeObserver: ResizeObserver | null = null

function bindMeasure() {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', measure)
  }
  if (!needsQuery.value) return
  if (props.responsive === 'self' && rootEl.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => measure())
    resizeObserver.observe(rootEl.value)
  } else if (props.responsive === 'screen' && typeof window !== 'undefined') {
    window.addEventListener('resize', measure)
  }
}

onMounted(() => {
  measure()
  bindMeasure()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', measure)
  }
})

watch(
  () => [
    props.responsive,
    props.cols,
    props.xGap,
    props.yGap,
    props.itemResponsive,
    props.collapsed,
    props.collapsedRows,
  ],
  () => {
    measure()
    bindMeasure()
  },
)

const resolvedCols = computed(
  () => parseResponsiveValue(props.cols, queryWidth.value) ?? 24,
)

const resolvedXGapPx = computed(() => parseResponsiveValue(props.xGap, queryWidth.value) ?? 0)
const resolvedYGapPx = computed(() => parseResponsiveValue(props.yGap, queryWidth.value) ?? 0)
const xGapCss = computed(() => `${resolvedXGapPx.value}px`)

const gridStyle = computed(() => ({
  display: 'grid',
  width: '100%',
  gridTemplateColumns: `repeat(${resolvedCols.value}, minmax(0, 1fr))`,
  columnGap: `${resolvedXGapPx.value}px`,
  rowGap: `${resolvedYGapPx.value}px`,
}))

function isGridItem(node: VNode): boolean {
  const type = node.type as Record<string, unknown> | string
  if (typeof type === 'string' || type == null) return false
  return Boolean(
    type[WI_GRID_ITEM_FLAG] ||
      type.name === 'WiGridItem' ||
      type.name === 'WiGi' ||
      type.__name === 'GridItem',
  )
}

function computeLayouts(nodes: VNode[]): VNode[] {
  overflow.value = false
  if (props.layoutShiftDisabled) return nodes

  const cols = resolvedCols.value
  const items: Array<{ node: VNode; span: number; offset: number; suffix: boolean }> = []

  for (const node of nodes) {
    if (node.type === Comment) {
      items.push({ node, span: 0, offset: 0, suffix: false })
      continue
    }
    if (!isGridItem(node)) continue

    const span =
      parseResponsiveValue(
        (node.props?.span as string | number | undefined) ?? 1,
        queryWidth.value,
      ) ?? 1
    const offset =
      parseResponsiveValue(
        (node.props?.offset as string | number | undefined) ?? 0,
        queryWidth.value,
      ) ?? 0
    const suffix = node.props?.suffix !== undefined && node.props?.suffix !== false
    if (span === 0) continue
    items.push({ node, span, offset, suffix })
  }

  let suffixSpan = 0
  const last = items[items.length - 1]
  if (last?.suffix) {
    suffixSpan = Math.min(last.span + last.offset, cols)
  }

  let spanCounter = 0
  let done = false

  return items.map((item) => {
    if (item.node.type === Comment || item.span === 0) return item.node

    const childSpan = Math.min(item.span + item.offset, cols)
    let show = true
    let colStart: number | undefined

    if (item.suffix) {
      colStart = cols + 1 - Math.min(item.span, cols)
    }

    if (props.collapsed && !item.suffix) {
      if (done) {
        show = false
        overflow.value = true
      } else {
        const remainder = spanCounter % cols
        let nextCounter = spanCounter
        if (childSpan + remainder > cols) {
          nextCounter += cols - remainder
        }
        if (childSpan + nextCounter + suffixSpan > props.collapsedRows * cols) {
          done = true
          show = false
          overflow.value = true
        } else {
          spanCounter = nextCounter + childSpan
        }
      }
    } else if (!item.suffix) {
      const remainder = spanCounter % cols
      if (childSpan + remainder > cols) {
        spanCounter += cols - remainder
      }
      spanCounter += childSpan
    }

    return cloneVNode(item.node, {
      // Naive includes offset in privateSpan for grid-column span.
      privateSpan: childSpan,
      privateOffset: item.offset,
      privateColStart: colStart,
      privateShow: show,
    })
  })
}

const renderedChildren = computed(() => computeLayouts(flattenVNodes(slots.default?.())))

provide(WI_GRID_KEY, {
  overflow,
  itemStyle: toRef(props, 'itemStyle'),
  xGap: xGapCss,
  layoutShiftDisabled: toRef(props, 'layoutShiftDisabled'),
  assignLayout: (_uid, layout) => layout,
  register: () => undefined,
  unregister: () => undefined,
})
</script>

<template>
  <div ref="rootEl" class="wi-grid" :style="gridStyle" v-bind="$attrs">
    <template v-if="layoutShiftDisabled">
      <slot />
    </template>
    <template v-else>
      <component :is="child" v-for="(child, index) in renderedChildren" :key="index" />
    </template>
  </div>
</template>
