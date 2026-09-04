<script setup lang="ts">
import type { ToastMessage, ToastProps } from './types'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { formatLocale, useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { plainTextOf } from '../../shared/content'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { WdRenderableView } from '../../shared/Renderable'
import { normalizeSeverity } from '../../shared/types'
import {
  closeToastItem,
  pauseToastLife,
  registerToastManualHost,
  resumeToastLife,
  toastState,
  trimToastsToMax,
  unregisterToastManualHost,
} from './toastState'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<ToastProps>(), {
  teleport: true,
  auto: false,
})
const emit = defineEmits<{ (event: 'close', message: ToastMessage): void }>()
const config = useWdConfig()
const locale = useWdLocale()
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const isService = computed(() => props.messages === undefined)
const list = computed(() => props.messages ?? toastState.messages)
const resolvedPosition = computed(
  () => props.position ?? (isService.value ? toastState.position : 'top-right'),
)

onMounted(() => {
  if (isService.value && !props.auto) registerToastManualHost()
})

onBeforeUnmount(() => {
  if (isService.value && !props.auto) unregisterToastManualHost()
})

watch(
  () => props.max,
  (max) => {
    if (!isService.value || max === undefined) return
    toastState.max = max
    trimToastsToMax(max)
  },
  { immediate: true },
)

function messageSeverityClass(severity?: ToastMessage['severity']) {
  return `wd-toast__message--${normalizeSeverity(severity) ?? 'info'}`
}

function closeLabel(message: ToastMessage) {
  return formatLocale(locale.value.closeNamed, {
    summary: plainTextOf(message.summary) || 'toast',
  })
}

function onClose(message: ToastMessage) {
  if (isService.value) closeToastItem(message.id)
  emit('close', message)
}

function onMouseEnter(message: ToastMessage) {
  if (isService.value) pauseToastLife(message.id)
}

function onMouseLeave(message: ToastMessage) {
  if (isService.value) resumeToastLife(message.id, closeToastItem)
}
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <div
      class="wd-toast"
      :class="`wd-toast--${resolvedPosition}`"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup name="wd-slide-fade">
        <article
          v-for="message in list"
          :key="message.id"
          class="wd-toast__message"
          :class="messageSeverityClass(message.severity)"
          role="status"
          @mouseenter="onMouseEnter(message)"
          @mouseleave="onMouseLeave(message)"
        >
          <div class="wd-toast__content">
            <strong><WdRenderableView :value="message.summary" /></strong>
            <p v-if="message.detail != null && message.detail !== ''">
              <WdRenderableView :value="message.detail" />
            </p>
          </div>
          <button
            v-if="message.closable !== false"
            type="button"
            class="wd-toast__close"
            :aria-label="closeLabel(message)"
            @click="onClose(message)"
          >
            <WdIcon name="close" size="sm" />
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
