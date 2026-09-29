<script setup lang="ts">
import type { QRCodeProps } from './types'
import {
  computed,
  onMounted,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import MButton from '../Button/Button.vue'
import MIcon from '../Icon/Icon.vue'
import MProgressSpinner from '../ProgressSpinner/ProgressSpinner.vue'
import { drawQrToCanvas } from './qrEncoder'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<QRCodeProps>(), {
  size: 160,
  bordered: true,
  errorLevel: 'M',
  status: 'active',
})

const emit = defineEmits<{ refresh: [] }>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const locale = useMLocale()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const rootClass = computed(() => [
  'm-qrcode',
  {
    'm-qrcode--bordered': props.bordered,
    'm-qrcode--loading': props.status === 'loading',
    'm-qrcode--expired': props.status === 'expired',
    'm-qrcode--scanned': props.status === 'scanned',
  },
])

const rootStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

async function paint() {
  if (!canvasRef.value || props.status === 'loading') return
  await drawQrToCanvas(canvasRef.value, {
    value: props.value,
    size: props.size,
    color: props.color ?? 'var(--m-color-text)',
    bgColor: props.bgColor ?? 'var(--m-color-surface)',
    errorLevel: props.errorLevel,
    icon: props.icon,
    bordered: props.bordered,
  })
}

onMounted(() => {
  paint()
})

watch(
  () => [props.value, props.size, props.color, props.bgColor, props.errorLevel, props.icon, props.bordered, props.status] as const,
  () => paint(),
)

function onRefresh() {
  emit('refresh')
}
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClass"
    :style="rootStyle"
    role="img"
    :aria-label="value"
  >
    <canvas
      ref="canvasRef"
      class="m-qrcode__canvas"
      :width="size"
      :height="size"
    />

    <div
      v-if="status !== 'active'"
      class="m-qrcode__mask"
    >
      <slot
        name="statusRender"
        :status="status"
        :refresh="onRefresh"
      >
        <template v-if="status === 'loading'">
          <MProgressSpinner size="small" />
        </template>
        <template v-else-if="status === 'expired'">
          <p class="m-qrcode__status-text">
            {{ locale.qrCodeExpired }}
          </p>
          <MButton
            variant="text"
            size="small"
            @click="onRefresh"
          >
            <MIcon
              name="refresh"
              size="sm"
            />
            {{ locale.qrCodeRefresh }}
          </MButton>
        </template>
        <template v-else-if="status === 'scanned'">
          <p class="m-qrcode__status-text">
            {{ locale.qrCodeScanned }}
          </p>
        </template>
      </slot>
    </div>
  </div>
</template>
