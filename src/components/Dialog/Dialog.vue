<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { DialogProps } from './types'
import {
  computed,
  onBeforeUnmount,
  ref,
  toRef,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import { useMLocale } from '../../locale'
import { allowAfterGuard } from '../../shared/asyncGuard'
import { useMConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { mergePtPart, useRootParts } from '../../shared/useComponentAttrs'
import { useModalOverlay } from '../../shared/useModalOverlay'
import { useMotionTransition } from '../../theme/useMotionTransition'
import MButton from '../Button/Button.vue'
import MIcon from '../Icon/Icon.vue'
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DialogProps>(), {
  transition: undefined,
  modelValue: false,
  closeOnEsc: true,
  closable: true,
  maximizable: false,
  fullscreen: undefined,
  modal: true,
  position: 'center',
  closeOnOutsideClick: false,
  teleport: true,
  blockScroll: true,
  width: undefined,
  top: undefined,
  zIndex: undefined,
  headerAriaLevel: 2,
  draggable: false,
  overflow: false,
  destroyOnClose: false,
  openDelay: undefined,
  closeDelay: undefined,
  closeIcon: undefined,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:fullscreen', value: boolean): void
  (event: 'close'): void
  (event: 'show'): void
  (event: 'opened'): void
  (event: 'hide'): void
  (event: 'closed'): void
  (event: 'maximize'): void
  (event: 'unmaximize'): void
}>()
const attrs = useAttrs()
const { rootAttrs: mergedRootAttrs } = useRootParts(attrs, () => props.pt)

/** Fallthrough `style.width` must not land on the full-viewport backdrop. */
const fallthroughPanelWidth = computed(() => {
  const style = mergedRootAttrs.value.style as string | Record<string, string> | undefined
  if (!style) return undefined
  if (typeof style === 'string') {
    return style.match(/(?:^|;)\s*width\s*:\s*([^;]+)/i)?.[1]?.trim()
  }
  return typeof style.width === 'string' ? style.width : undefined
})

const rootAttrs = computed(() => {
  const next = { ...mergedRootAttrs.value }
  const style = next.style as string | Record<string, string> | undefined
  if (!style || !fallthroughPanelWidth.value) return next
  if (typeof style === 'string') {
    const rest = style
      .replace(/(?:^|;)\s*width\s*:[^;]+/i, '')
      .replace(/^;|;$/g, '')
      .trim()
    if (rest) next.style = rest
    else delete next.style
    return next
  }
  const { width: _width, ...rest } = style
  if (Object.keys(rest).length) next.style = rest
  else delete next.style
  return next
})

const slots = useSlots()
const config = useMConfig()
const locale = useMLocale()
const dialogElement = ref<HTMLElement | null>(null)
const maximized = ref(false)
const origin = ref(getLastPointer())
const pending = ref<'close' | 'positive' | 'negative' | null>(null)

// —— Delay machinery ————————————————————————————————
// `internalVisible` is the source of truth for rendering + transitions. We
// delay its flip relative to `modelValue` based on `openDelay`/`closeDelay`.
const internalVisible = ref(props.modelValue)
let openTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (openTimer) {
    clearTimeout(openTimer)
    openTimer = null
  }
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

watch(
  () => props.modelValue,
  (next) => {
    clearTimers()
    if (next) {
      if (props.openDelay && props.openDelay > 0) {
        openTimer = setTimeout(() => {
          internalVisible.value = true
          openTimer = null
        }, props.openDelay)
      } else {
        internalVisible.value = true
      }
      if (next) origin.value = getLastPointer()
    } else {
      if (props.closeDelay && props.closeDelay > 0) {
        closeTimer = setTimeout(() => {
          internalVisible.value = false
          closeTimer = null
        }, props.closeDelay)
      } else {
        internalVisible.value = false
      }
    }
  },
)

onBeforeUnmount(clearTimers)

// —— destroyOnClose —————————————————————————————————
// After the leave transition finishes, bump `contentKey` so the default slot
// subtree is fully unmounted and recreated on next open.
const contentKey = ref(0)
const slotDestroyed = ref(false)
function maybeDestroyContent() {
  if (!props.destroyOnClose) return
  slotDestroyed.value = true
  contentKey.value += 1
}
watch(internalVisible, (visible) => {
  if (visible) slotDestroyed.value = false
})

// —— Draggable ————————————————————————————————————————
const dragOffset = ref<{ x: number; y: number } | null>(null)
const isDragging = ref(false)
let dragStart: { pointerX: number; pointerY: number; offsetX: number; offsetY: number } | null =
  null
let rafId = 0

function applyDragStyle() {
  rafId = 0
  const el = dialogElement.value
  if (!el) return
  if (!dragOffset.value) {
    el.style.transform = ''
    return
  }
  el.style.transform = `translate3d(${dragOffset.value.x}px, ${dragOffset.value.y}px, 0)`
}

function scheduleDragStyle() {
  if (rafId) return
  rafId = requestAnimationFrame(applyDragStyle)
}

function clampOffset(x: number, y: number): { x: number; y: number } {
  if (props.overflow) return { x, y }
  const el = dialogElement.value
  if (!el) return { x, y }
  const rect = el.getBoundingClientRect()
  // Keep at least a sliver of the panel reachable.
  const minVisible = 48
  const maxX = window.innerWidth - minVisible - (rect.left - (dragOffset.value?.x ?? 0))
  const minX = -(rect.right - (dragOffset.value?.x ?? 0)) + minVisible
  const maxY = window.innerHeight - minVisible - (rect.top - (dragOffset.value?.y ?? 0))
  const minY = -(rect.bottom - (dragOffset.value?.y ?? 0)) + minVisible
  return {
    x: Math.max(minX, Math.min(x, maxX)),
    y: Math.max(minY, Math.min(y, maxY)),
  }
}

function onDragPointerDown(event: PointerEvent) {
  if (!props.draggable) return
  if (event.button !== 0) return
  const target = event.target as HTMLElement | null
  // Ignore drags that start on interactive elements (buttons, inputs, links).
  if (target?.closest('button, a, input, textarea, select, [data-no-drag]')) return
  event.preventDefault()
  dragStart = {
    pointerX: event.clientX,
    pointerY: event.clientY,
    offsetX: dragOffset.value?.x ?? 0,
    offsetY: dragOffset.value?.y ?? 0,
  }
  isDragging.value = true
  document.addEventListener('pointermove', onDragPointerMove, { passive: false })
  document.addEventListener('pointerup', onDragPointerUp, { once: true })
  document.addEventListener('pointercancel', onDragPointerUp, { once: true })
}

function onDragPointerMove(event: PointerEvent) {
  if (!dragStart) return
  event.preventDefault()
  const next = clampOffset(
    dragStart.offsetX + (event.clientX - dragStart.pointerX),
    dragStart.offsetY + (event.clientY - dragStart.pointerY),
  )
  dragOffset.value = next
  scheduleDragStyle()
}

function onDragPointerUp() {
  dragStart = null
  isDragging.value = false
  document.removeEventListener('pointermove', onDragPointerMove)
}

function resetDrag() {
  dragOffset.value = null
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
  const el = dialogElement.value
  if (el) el.style.transform = ''
}

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  document.removeEventListener('pointermove', onDragPointerMove)
})

// —— Transition / motion ————————————————————————————
const { transitionName, transitionCss } = useMotionTransition({
  role: 'dialog',
  local: () => props.transition,
  componentName: 'Dialog',
  fallback: 'zoom',
})

const dialogTitle = computed(() => props.title)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const typeIcon = computed<IconName | undefined>(() => {
  switch (props.type) {
    case 'success':
      return 'check-circle'
    case 'warning':
      return 'warning'
    case 'danger':
      return 'x-circle'
    case 'info':
      return 'info'
    default:
      return undefined
  }
})
const showPresetFooter = computed(
  () => !slots.footer && Boolean(props.positiveText || props.negativeText),
)
const showFooter = computed(() => Boolean(slots.footer || showPresetFooter.value))
const positiveButtonProps = computed(() => {
  const color = props.positiveColor
  if (!color || color === 'primary') return { type: 'primary' as const }
  if (color === 'danger') return { type: 'primary' as const, danger: true }
  return { color, variant: 'solid' as const }
})
const busy = computed(() => pending.value != null)
const dialogAriaLabel = computed(() => props.ariaLabel ?? dialogTitle.value)
const backdropStyle = computed(() => {
  const style: Record<string, string> = {
    '--m-dialog-origin-x': `${origin.value.x}px`,
    '--m-dialog-origin-y': `${origin.value.y}px`,
  }
  if (props.zIndex !== undefined) style.zIndex = String(props.zIndex)
  return style
})

// —— Fullscreen / maximized unification ————————————————
// `fullscreen` prop is the external source of truth; `maximized` ref tracks
// user clicks on the header toggle. We treat "fullscreen-like" as either
// being true. When the user clicks the toggle we update both internal state
// and emit `update:fullscreen` so `v-model:fullscreen` stays in sync.
const isFullscreenLike = computed(() => Boolean(props.fullscreen) || maximized.value)

function setFullscreen(value: boolean, source: 'prop' | 'user') {
  if (source === 'user') {
    maximized.value = value
    if (props.fullscreen !== value) emit('update:fullscreen', value)
    if (value) emit('maximize')
    else emit('unmaximize')
  } else {
    maximized.value = value
    if (value) emit('maximize')
    else emit('unmaximize')
  }
}

watch(
  () => props.fullscreen,
  (value) => {
    if (value === undefined) return
    if (value !== maximized.value) setFullscreen(value, 'prop')
  },
)

function toggleMaximize() {
  setFullscreen(!isFullscreenLike.value, 'user')
}

const resolvedPosition = computed(() => props.position)
const backdropClass = computed(() => [
  `m-dialog-backdrop--${resolvedPosition.value}`,
  {
    'm-dialog-backdrop--modal': props.modal,
    'm-dialog-backdrop--maximized': isFullscreenLike.value,
    'm-dialog-backdrop--draggable': props.draggable && !isFullscreenLike.value,
  },
])

// Width: number → px
const resolvedWidth = computed(() => {
  if (props.width === undefined || props.width === null || props.width === '') {
    return fallthroughPanelWidth.value
  }
  if (typeof props.width === 'number') return `${props.width}px`
  return props.width
})

const panelStyle = computed(() => {
  if (isFullscreenLike.value) return undefined
  const style: Record<string, string> = {}
  if (resolvedWidth.value) {
    // Override the component token instead of `width` directly so the default
    // `max-width: var(--m-dialog-width)` no longer clamps larger sizes.
    style['--m-dialog-width'] = resolvedWidth.value
  }
  if (props.top && ['top', 'topleft', 'topright'].includes(resolvedPosition.value)) {
    style['--m-dialog-top'] = props.top
  }
  return Object.keys(style).length ? style : undefined
})

const zoomAttrs = computed(() => mergePtPart(props.pt?.zoom))
const panelAttrs = computed(() => mergePtPart(props.pt?.panel))
const headerAttrs = computed(() => mergePtPart(props.pt?.header))
const bodyAttrs = computed(() => mergePtPart(props.pt?.body))
const footerAttrs = computed(() => mergePtPart(props.pt?.footer))
const isDismissableMask = computed(() => props.closeOnOutsideClick)

const closeIconName = computed<IconName>(() => props.closeIcon ?? 'close')

function finishClose() {
  maximized.value = false
  pending.value = null
  resetDrag()
  emit('update:modelValue', false)
  emit('close')
}

async function dismiss() {
  if (pending.value) return
  if (!props.beforeClose) {
    finishClose()
    return
  }
  pending.value = 'close'
  try {
    if (!(await allowAfterGuard(props.beforeClose))) return
    finishClose()
  } finally {
    if (pending.value === 'close') pending.value = null
  }
}

async function onPositive(event: MouseEvent) {
  if (pending.value) return
  pending.value = 'positive'
  try {
    if (!(await allowAfterGuard(props.onPositiveClick, event))) return
    finishClose()
  } finally {
    if (pending.value === 'positive') pending.value = null
  }
}

async function onNegative(event: MouseEvent) {
  if (pending.value) return
  pending.value = 'negative'
  try {
    if (!(await allowAfterGuard(props.onNegativeClick, event))) return
    finishClose()
  } finally {
    if (pending.value === 'negative') pending.value = null
  }
}

function onOutsideClick() {
  if (isDismissableMask.value) void dismiss()
}

useModalOverlay({
  open: internalVisible,
  container: dialogElement,
  closeOnEsc: toRef(props, 'closeOnEsc'),
  blockScroll: () => props.blockScroll && props.modal,
  onEscape: () => {
    void dismiss()
  },
  onOpen: () => emit('show'),
  onClose: () => {
    maximized.value = false
    resetDrag()
    emit('hide')
  },
})

function onAfterEnter() {
  emit('opened')
}

function onAfterLeave() {
  emit('closed')
  maybeDestroyContent()
}

defineExpose({
  close: dismiss,
  maximize: () => {
    if (!isFullscreenLike.value) toggleMaximize()
  },
  unmaximize: () => {
    if (isFullscreenLike.value) toggleMaximize()
  },
  resetPosition: () => resetDrag(),
})
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition
      :name="transitionName"
      :css="transitionCss"
      @after-enter="onAfterEnter"
      @after-leave="onAfterLeave"
    >
      <div
        v-if="internalVisible"
        v-bind="rootAttrs"
        class="m-dialog-backdrop"
        :class="backdropClass"
        :style="backdropStyle"
      >
        <div v-bind="zoomAttrs" class="m-dialog-zoom" @click.self="onOutsideClick">
          <section
            v-bind="panelAttrs"
            ref="dialogElement"
            class="m-dialog"
            :class="{
              'm-dialog--maximized': isFullscreenLike,
              'm-dialog--fullscreen': props.fullscreen,
              'm-dialog--draggable': props.draggable && !isFullscreenLike,
              'm-dialog--dragging': isDragging,
              [`m-dialog--${props.type}`]: props.type,
            }"
            :style="panelStyle"
            role="dialog"
            :aria-modal="modal || undefined"
            :aria-label="dialogAriaLabel"
            tabindex="-1"
          >
            <header
              v-if="$slots.header || dialogTitle || typeIcon || closable || maximizable"
              v-bind="headerAttrs"
              class="m-dialog__header"
              @pointerdown="onDragPointerDown"
            >
              <div class="m-dialog__heading">
                <span v-if="typeIcon" class="m-dialog__type-icon" aria-hidden="true">
                  <MIcon :name="typeIcon" size="sm" />
                </span>
                <slot name="header">
                  <h2
                    v-if="dialogTitle"
                    class="m-dialog__title"
                    role="heading"
                    :aria-level="String(props.headerAriaLevel)"
                  >
                    {{ dialogTitle }}
                  </h2>
                </slot>
              </div>
              <div v-if="maximizable || closable" class="m-dialog__actions">
                <button
                  v-if="maximizable"
                  type="button"
                  class="m-dialog__action"
                  :aria-label="isFullscreenLike ? locale.restore : locale.maximize"
                  :disabled="busy"
                  @click="toggleMaximize"
                >
                  <MIcon :name="isFullscreenLike ? 'restore' : 'maximize'" size="sm" />
                </button>
                <button
                  v-if="closable"
                  type="button"
                  class="m-dialog__action"
                  :aria-label="locale.close"
                  :disabled="busy"
                  @click="dismiss"
                >
                  <MIcon :name="closeIconName" size="sm" />
                </button>
              </div>
            </header>
            <div v-bind="bodyAttrs" class="m-dialog__body">
              <slot v-if="!slotDestroyed" :key="contentKey" />
            </div>
            <footer
              v-if="showFooter"
              v-bind="footerAttrs"
              class="m-dialog__footer"
              :class="{ 'm-dialog__footer--preset': showPresetFooter }"
            >
              <slot name="footer">
                <MButton
                  v-if="negativeText"
                  :label="negativeText"
                  :disabled="busy"
                  :loading="pending === 'negative'"
                  @click="onNegative"
                />
                <MButton
                  v-if="positiveText"
                  v-bind="positiveButtonProps"
                  :label="positiveText"
                  :disabled="busy && pending !== 'positive'"
                  :loading="pending === 'positive'"
                  @click="onPositive"
                />
              </slot>
            </footer>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
