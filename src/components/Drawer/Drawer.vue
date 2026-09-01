<script setup lang="ts">
import type { DrawerProps } from './types'
import { computed, ref, toRef } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  position: 'left',
  modal: true,
  dismissable: true,
  showCloseIcon: true,
  blockScroll: true,
  teleport: true,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'show'): void
  (event: 'hide'): void
  (event: 'after-leave'): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const drawerElement = ref<HTMLElement | null>(null)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))

function toCssSize(value?: string | number) {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

const paneStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.position === 'left' || props.position === 'right') {
    const width = toCssSize(props.width)
    if (width) style.width = width
  }
  if (props.position === 'top' || props.position === 'bottom') {
    const height = toCssSize(props.height)
    if (height) {
      style.height = height
      style.maxHeight = height
    }
  }
  return style
})

function close() {
  emit('update:modelValue', false)
}

function onOutsideClick() {
  if (props.dismissable) close()
}

useModalOverlay({
  open: toRef(props, 'modelValue'),
  container: drawerElement,
  blockScroll: () => props.blockScroll && props.modal,
  onEscape: close,
  onOpen: () => emit('show'),
  onClose: () => emit('hide'),
})
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="wi-drawer" @after-leave="emit('after-leave')">
      <div
        v-if="modelValue"
        class="wi-drawer-backdrop"
        :class="{ 'wi-drawer-backdrop--modal': modal }"
        @click.self="onOutsideClick"
      >
        <aside
          ref="drawerElement"
          class="wi-drawer"
          :class="`wi-drawer--${position}`"
          :style="paneStyle"
          role="dialog"
          :aria-modal="modal || undefined"
          :aria-label="header"
          tabindex="-1"
        >
          <header v-if="$slots.header || header || showCloseIcon" class="wi-drawer__header">
            <slot name="header">
              <h2 v-if="header">
                {{ header }}
              </h2>
            </slot>
            <button
              v-if="showCloseIcon"
              type="button"
              class="wi-drawer__close"
              :aria-label="locale.close"
              @click="close"
            >
              <WiIcon name="close" size="sm" />
            </button>
          </header>
          <div class="wi-drawer__body">
            <slot />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
