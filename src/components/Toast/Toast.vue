<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { formatLocale, useWdLocale } from '../../locale'
import { plainTextOf } from '../../shared/content'
import { useWdConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { WdRenderableView } from '../../shared/Renderable'
import { normalizeSeverity } from '../../shared/types'
import {
  closeToastItem,
  registerToastManualHost,
  toastState,
  unregisterToastManualHost,
} from './toastState'
import type { ToastMessage, ToastProps } from './types'

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
            ×
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
