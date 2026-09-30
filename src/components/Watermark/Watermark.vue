<script setup lang="ts">
import type { WatermarkProps } from './types'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { resolveCssColor } from '../../shared/resolveCssColor'
import { useRootParts } from '../../shared/useComponentAttrs'
import { createWatermarkPattern, watermarkOverlayStyle } from './watermarkCanvas'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<WatermarkProps>(), {
  rotate: -22,
  inherit: true,
})

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const rootRef = ref<HTMLElement | null>(null)
const overlayStyle = ref<Record<string, string> | null>(null)

const mergedZIndex = computed(() => props.zIndex ?? 9)

let overlayObserver: MutationObserver | null = null

function disconnectOverlayObserver() {
  overlayObserver?.disconnect()
  overlayObserver = null
}

function restoreOverlayIfMissing() {
  const root = rootRef.value
  if (!root || !overlayStyle.value) return
  if (root.querySelector('.m-watermark__overlay')) return
  const style = { ...overlayStyle.value }
  overlayStyle.value = null
  void nextTick(() => {
    overlayStyle.value = style
    ensureOverlayObserver()
  })
}

function ensureOverlayObserver() {
  disconnectOverlayObserver()
  const root = rootRef.value
  if (!root || !overlayStyle.value) return
  overlayObserver = new MutationObserver(() => {
    restoreOverlayIfMissing()
  })
  overlayObserver.observe(root, { childList: true })
}

async function renderWatermark() {
  try {
    const textColor = resolveCssColor(props.font?.color ?? 'var(--m-color-text)', 'rgb(0, 0, 0)')
    const { base64, width, height } = await createWatermarkPattern({
      content: props.content,
      image: props.image,
      width: props.width,
      height: props.height,
      rotate: props.rotate,
      gap: props.gap,
      offset: props.offset,
      font: {
        color: textColor,
        fontSize: props.font?.fontSize,
        fontWeight: props.font?.fontWeight,
        fontFamily: props.font?.fontFamily,
      },
    })
    overlayStyle.value = { ...watermarkOverlayStyle(base64, width, height, mergedZIndex.value) }
    await nextTick()
    ensureOverlayObserver()
  }
  catch (error) {
    overlayStyle.value = null
    disconnectOverlayObserver()
    console.error('[MWatermark] Failed to render watermark', error)
  }
}

onBeforeUnmount(() => {
  disconnectOverlayObserver()
})

watch(
  () => [
    props.content,
    props.image,
    props.width,
    props.height,
    props.rotate,
    props.gap,
    props.offset,
    props.font,
    props.zIndex,
  ],
  async () => {
    await renderWatermark()
  },
  { deep: true, immediate: true },
)

const rootClass = computed(() => [
  'm-watermark',
  { 'm-watermark--inherit': props.inherit },
])
</script>

<template>
  <div
    ref="rootRef"
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <slot />
    <div
      v-if="overlayStyle"
      class="m-watermark__overlay"
      aria-hidden="true"
      :style="overlayStyle"
    />
  </div>
</template>
