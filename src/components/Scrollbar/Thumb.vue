<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { scrollbarContextKey } from './constants'
import { BAR_MAP, renderThumbStyle, type BarMapKey } from './util'

const props = defineProps<{
  vertical?: boolean
  size: string
  move: number
  ratio: number
  always?: boolean
}>()

const scrollbarContext = inject(scrollbarContextKey)
if (!scrollbarContext) {
  throw new Error('[WiScrollbar] Thumb must be used inside WiScrollbar')
}
const scrollbar = scrollbarContext

const trackRef = ref<HTMLDivElement>()
const thumbRef = ref<HTMLDivElement>()
const visible = ref(false)
const thumbState = ref<Partial<Record<'X' | 'Y', number>>>({})

let cursorDown = false
let cursorLeave = true
let baseScrollHeight = 0
let baseScrollWidth = 0
let originalOnSelectStart: ((this: GlobalEventHandlers, ev: Event) => any) | null = null
let stopMove: (() => void) | undefined
let stopLeave: (() => void) | undefined

const barKey = computed<BarMapKey>(() => (props.vertical ? 'vertical' : 'horizontal'))
const bar = computed(() => BAR_MAP[barKey.value])

const thumbStyle = computed(() =>
  renderThumbStyle({
    size: props.size,
    move: props.move,
    bar: bar.value,
  }),
)

const show = computed(() => props.always || visible.value)

const offsetRatio = computed(() => {
  const track = trackRef.value
  const thumb = thumbRef.value
  const wrap = scrollbar.wrapElement
  if (!track || !thumb || !wrap) return 1
  return (
    track[bar.value.offset] ** 2 /
    wrap[bar.value.scrollSize] /
    props.ratio /
    thumb[bar.value.offset]
  )
})

function restoreOnSelectStart() {
  if (typeof document === 'undefined') return
  if (document.onselectstart !== originalOnSelectStart) {
    document.onselectstart = originalOnSelectStart
  }
}

function mouseMoveDocumentHandler(event: MouseEvent) {
  const track = trackRef.value
  const thumb = thumbRef.value
  const wrap = scrollbar.wrapElement
  if (!cursorDown || !track || !thumb || !wrap) return

  const prevPage = thumbState.value[bar.value.axis]
  if (!prevPage) return

  const offset = (track.getBoundingClientRect()[bar.value.direction] - event[bar.value.client]) * -1
  const thumbClickPosition = thumb[bar.value.offset] - prevPage
  const thumbPositionPercentage =
    ((offset - thumbClickPosition) * 100 * offsetRatio.value) / track[bar.value.offset]

  if (bar.value.scroll === 'scrollLeft') {
    wrap.scrollLeft = (thumbPositionPercentage * baseScrollWidth) / 100
  } else {
    wrap.scrollTop = (thumbPositionPercentage * baseScrollHeight) / 100
  }
}

function mouseUpDocumentHandler() {
  cursorDown = false
  thumbState.value[bar.value.axis] = 0
  document.removeEventListener('mousemove', mouseMoveDocumentHandler)
  document.removeEventListener('mouseup', mouseUpDocumentHandler)
  restoreOnSelectStart()
  if (cursorLeave) visible.value = false
}

function startDrag(event: MouseEvent) {
  const wrap = scrollbar.wrapElement
  if (!wrap) return
  event.stopImmediatePropagation()
  cursorDown = true
  baseScrollHeight = wrap.scrollHeight
  baseScrollWidth = wrap.scrollWidth
  document.addEventListener('mousemove', mouseMoveDocumentHandler)
  document.addEventListener('mouseup', mouseUpDocumentHandler)
  originalOnSelectStart = document.onselectstart
  document.onselectstart = () => false
}

function onThumbMouseDown(event: MouseEvent) {
  event.stopPropagation()
  if (event.ctrlKey || [1, 2].includes(event.button)) return
  window.getSelection()?.removeAllRanges()
  startDrag(event)

  const el = event.currentTarget as HTMLDivElement | null
  if (!el) return
  thumbState.value[bar.value.axis] =
    el[bar.value.offset] - (event[bar.value.client] - el.getBoundingClientRect()[bar.value.direction])
}

function onTrackMouseDown(event: MouseEvent) {
  const track = trackRef.value
  const thumb = thumbRef.value
  const wrap = scrollbar.wrapElement
  if (!track || !thumb || !wrap) return

  const offset = Math.abs(
    (event.target as HTMLElement).getBoundingClientRect()[bar.value.direction] - event[bar.value.client],
  )
  const thumbHalf = thumb[bar.value.offset] / 2
  const thumbPositionPercentage =
    ((offset - thumbHalf) * 100 * offsetRatio.value) / track[bar.value.offset]

  wrap[bar.value.scroll] = (thumbPositionPercentage * wrap[bar.value.scrollSize]) / 100
}

function onTrackKeyDown(event: KeyboardEvent) {
  const wrap = scrollbar.wrapElement
  if (!wrap || !props.size) return

  const step = 40
  const map: Record<string, () => void> = props.vertical
    ? {
        ArrowDown: () => {
          wrap.scrollTop += step
        },
        ArrowUp: () => {
          wrap.scrollTop -= step
        },
        PageDown: () => {
          wrap.scrollTop += wrap.clientHeight
        },
        PageUp: () => {
          wrap.scrollTop -= wrap.clientHeight
        },
        Home: () => {
          wrap.scrollTop = 0
        },
        End: () => {
          wrap.scrollTop = wrap.scrollHeight
        },
      }
    : {
        ArrowRight: () => {
          wrap.scrollLeft += step
        },
        ArrowLeft: () => {
          wrap.scrollLeft -= step
        },
        Home: () => {
          wrap.scrollLeft = 0
        },
        End: () => {
          wrap.scrollLeft = wrap.scrollWidth
        },
      }

  const handler = map[event.key]
  if (!handler) return
  event.preventDefault()
  handler()
}

function onScrollbarMouseMove() {
  cursorLeave = false
  visible.value = Boolean(props.size)
}

function onScrollbarMouseLeave() {
  cursorLeave = true
  visible.value = cursorDown
}

function bindHover() {
  stopMove?.()
  stopLeave?.()
  const root = scrollbar.scrollbarElement
  if (!root) return
  root.addEventListener('mousemove', onScrollbarMouseMove)
  root.addEventListener('mouseleave', onScrollbarMouseLeave)
  stopMove = () => root.removeEventListener('mousemove', onScrollbarMouseMove)
  stopLeave = () => root.removeEventListener('mouseleave', onScrollbarMouseLeave)
}

onMounted(() => {
  bindHover()
})

watch(
  () => scrollbar.scrollbarElement,
  () => {
    bindHover()
  },
)

onBeforeUnmount(() => {
  restoreOnSelectStart()
  document.removeEventListener('mousemove', mouseMoveDocumentHandler)
  document.removeEventListener('mouseup', mouseUpDocumentHandler)
  stopMove?.()
  stopLeave?.()
})
</script>

<template>
  <transition name="wi-scrollbar-fade">
    <div
      v-show="size && show"
      ref="trackRef"
      class="wi-scrollbar__bar"
      :class="vertical ? 'wi-scrollbar__bar--vertical' : 'wi-scrollbar__bar--horizontal'"
      role="scrollbar"
      :aria-orientation="vertical ? 'vertical' : 'horizontal'"
      :aria-controls="scrollbar.contentId"
      tabindex="0"
      @mousedown="onTrackMouseDown"
      @keydown="onTrackKeyDown"
    >
      <div
        ref="thumbRef"
        class="wi-scrollbar__thumb"
        :style="thumbStyle"
        @mousedown="onThumbMouseDown"
      />
    </div>
  </transition>
</template>
