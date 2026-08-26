<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { WiRenderableView } from '../../shared/Renderable'
import { normalizeSeverity } from '../../shared/types'
import WiIcon from '../Icon/Icon.vue'
import type { IconName } from '../Icon/types'
import {
  closeMessageItem,
  messageState,
  registerMessageManualHost,
  trimMessagesToMax,
  unregisterMessageManualHost,
} from './messageState'
import type { MessageItem, MessageProps } from './types'

const props = withDefaults(defineProps<MessageProps>(), {
  teleport: true,
  auto: false,
})

const config = useWiConfig()
const locale = useWiLocale()
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const resolvedPlacement = computed(() => props.placement ?? messageState.placement)

onMounted(() => {
  if (!props.auto) registerMessageManualHost()
})

onBeforeUnmount(() => {
  if (!props.auto) unregisterMessageManualHost()
})

watch(
  () => [props.placement, props.max] as const,
  ([placement, max]) => {
    if (placement) messageState.placement = placement
    if (max !== undefined) {
      messageState.max = max
      trimMessagesToMax(max)
    }
  },
  { immediate: true },
)

function iconName(severity?: MessageItem['severity']): IconName {
  switch (normalizeSeverity(severity) ?? 'info') {
    case 'success':
      return 'check-circle'
    case 'warn':
      return 'warning'
    case 'error':
      return 'x-circle'
    default:
      return 'info'
  }
}

function severityClass(severity?: MessageItem['severity']) {
  return `wi-message--${normalizeSeverity(severity) ?? 'info'}`
}

function onClose(item: MessageItem) {
  closeMessageItem(item.id)
}
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <div
      class="wi-message-host"
      :class="`wi-message-host--${resolvedPlacement}`"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup name="wi-message-slide">
        <div
          v-for="item in messageState.items"
          :key="item.id"
          class="wi-message"
          :class="severityClass(item.severity)"
          role="status"
        >
          <span v-if="item.icon !== false" class="wi-message__icon" aria-hidden="true">
            <WiIcon :name="iconName(item.severity)" size="sm" />
          </span>
          <div class="wi-message__content">
            <WiRenderableView :value="item.content" />
          </div>
          <button
            v-if="item.closable"
            type="button"
            class="wi-message__close"
            :aria-label="locale.close"
            @click="onClose(item)"
          >
            <WiIcon name="close" size="sm" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
