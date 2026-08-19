<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { WdRenderableView } from '../../shared/Renderable'
import { normalizeSeverity } from '../../shared/types'
import WdIcon from '../Icon/Icon.vue'
import type { IconName } from '../Icon/types'
import {
  closeMessageItem,
  messageState,
  registerMessageManualHost,
  unregisterMessageManualHost,
} from './messageState'
import type { MessageItem, MessageProps } from './types'

const props = withDefaults(defineProps<MessageProps>(), {
  teleport: true,
  auto: false,
})

const config = useWdConfig()
const locale = useWdLocale()
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))

onMounted(() => {
  if (!props.auto) registerMessageManualHost()
})

onBeforeUnmount(() => {
  if (!props.auto) unregisterMessageManualHost()
})

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
  return `wd-message--${normalizeSeverity(severity) ?? 'info'}`
}

function onClose(item: MessageItem) {
  closeMessageItem(item.id)
}
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <div class="wd-message-host" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="wd-message-slide">
        <div
          v-for="item in messageState.items"
          :key="item.id"
          class="wd-message"
          :class="severityClass(item.severity)"
          role="status"
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
