<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { MessageItem, MessageProps } from './types'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { WdRenderableView } from '../../shared/Renderable'
import { normalizeSeverity } from '../../shared/types'
import WdIcon from '../Icon/Icon.vue'
import {
  closeMessageItem,
  messageState,
  pauseMessageLife,
  registerMessageManualHost,
  resumeMessageLife,
  trimMessagesToMax,
  unregisterMessageManualHost,
} from './messageState'

const props = withDefaults(defineProps<MessageProps>(), {
  teleport: true,
  auto: false,
})

const config = useWdConfig()
const locale = useWdLocale()
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const isService = computed(() => props.messages === undefined)
const list = computed(() => props.messages ?? messageState.items)
const resolvedPlacement = computed(
  () => props.placement ?? (isService.value ? messageState.placement : 'top'),
)

onMounted(() => {
  if (isService.value && !props.auto) registerMessageManualHost()
})

onBeforeUnmount(() => {
  if (isService.value && !props.auto) unregisterMessageManualHost()
})

watch(
  () => [props.placement, props.max] as const,
  ([placement, max]) => {
    if (!isService.value) return
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
    case 'danger':
      return 'x-circle'
    default:
      return 'info'
  }
}

function severityClass(severity?: MessageItem['severity']) {
  return `wd-message--${normalizeSeverity(severity) ?? 'info'}`
}

function onClose(item: MessageItem) {
  if (isService.value) closeMessageItem(item.id)
}

function onMouseEnter(item: MessageItem) {
  if (isService.value) pauseMessageLife(item.id)
}

function onMouseLeave(item: MessageItem) {
  if (isService.value) resumeMessageLife(item.id, closeMessageItem)
}
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <div
      class="wd-message-host"
      :class="`wd-message-host--${resolvedPlacement}`"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup name="wd-message-slide">
        <div
          v-for="item in list"
          :key="item.id"
          class="wd-message"
          :class="severityClass(item.severity)"
          role="status"
          @mouseenter="onMouseEnter(item)"
          @mouseleave="onMouseLeave(item)"
        >
          <span v-if="item.icon !== false" class="wd-message__icon" aria-hidden="true">
            <WdIcon :name="iconName(item.severity)" size="sm" />
          </span>
          <div class="wd-message__content">
            <WdRenderableView :value="item.content" />
          </div>
          <button
            v-if="item.closable"
            type="button"
            class="wd-message__close"
            :aria-label="locale.close"
            @click="onClose(item)"
          >
            <WdIcon name="close" size="sm" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
