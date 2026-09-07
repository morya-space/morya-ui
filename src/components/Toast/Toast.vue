<script setup lang="ts">
import type { ToastMessage, ToastProps } from './types'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { formatLocale, useRdLocale } from '../../locale'
import { useRdConfig } from '../../shared/config'
import { plainTextOf } from '../../shared/content'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { RdRenderableView } from '../../shared/Renderable'
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
import RdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<ToastProps>(), {
  teleport: true,
  auto: false,
})
const emit = defineEmits<{ (event: 'close', message: ToastMessage): void }>()
const config = useRdConfig()
const locale = useRdLocale()
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
  return `rd-toast__message--${normalizeSeverity(severity) ?? 'info'}`
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
      class="rd-toast"
      :class="`rd-toast--${resolvedPosition}`"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup name="rd-slide-fade">
        <article
          v-for="message in list"
          :key="message.id"
          class="rd-toast__message"
          :class="messageSeverityClass(message.severity)"
          role="status"
          @mouseenter="onMouseEnter(message)"
          @mouseleave="onMouseLeave(message)"
        >
          <div class="rd-toast__content">
            <strong><RdRenderableView :value="message.summary" /></strong>
            <p v-if="message.detail != null && message.detail !== ''">
              <RdRenderableView :value="message.detail" />
            </p>
          </div>
          <button
            v-if="message.closable !== false"
            type="button"
            class="rd-toast__close"
            :aria-label="closeLabel(message)"
            @click="onClose(message)"
          >
            <RdIcon name="close" size="sm" />
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
