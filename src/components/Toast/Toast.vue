<script setup lang="ts">
import type { ToastMessage, ToastProps } from './types'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { formatLocale, useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { plainTextOf } from '../../shared/content'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { WiRenderableView } from '../../shared/Renderable'
import { normalizeSeverity } from '../../shared/types'
import {
  closeToastItem,
  registerToastManualHost,
  toastState,
  trimToastsToMax,
  unregisterToastManualHost,
} from './toastState'

const props = withDefaults(defineProps<ToastProps>(), {
  teleport: true,
  auto: false,
})
const emit = defineEmits<{ (event: 'close', message: ToastMessage): void }>()
const config = useWiConfig()
const locale = useWiLocale()
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
  return `wi-toast__message--${normalizeSeverity(severity) ?? 'info'}`
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
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <div
      class="wi-toast"
      :class="`wi-toast--${resolvedPosition}`"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup name="wi-slide-fade">
        <article
          v-for="message in list"
          :key="message.id"
          class="wi-toast__message"
          :class="messageSeverityClass(message.severity)"
          role="status"
        >
          <div class="wi-toast__content">
            <strong><WiRenderableView :value="message.summary" /></strong>
            <p v-if="message.detail != null && message.detail !== ''">
              <WiRenderableView :value="message.detail" />
            </p>
          </div>
          <button
            v-if="message.closable !== false"
            type="button"
            class="wi-toast__close"
            :aria-label="closeLabel(message)"
            @click="onClose(message)"
          >
            ×
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
