<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import type { DrawerProps } from './types'

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
}>()

const config = useWdConfig()
const locale = useWdLocale()
const drawerElement = ref<HTMLElement | null>(null)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))

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
    <Transition name="wd-drawer">
      <div
        v-if="modelValue"
        class="wd-drawer-backdrop"
        :class="{ 'wd-drawer-backdrop--modal': modal }"
        @click.self="onOutsideClick"
      >
        <aside
          ref="drawerElement"
          class="wd-drawer"
          :class="`wd-drawer--${position}`"
          role="dialog"
          :aria-modal="modal || undefined"
          :aria-label="header"
          tabindex="-1"
        >
          <header v-if="$slots.header || header || showCloseIcon" class="wd-drawer__header">
            <slot name="header"><h2 v-if="header">{{ header }}</h2></slot>
            <button
              v-if="showCloseIcon"
              type="button"
              class="wd-drawer__close"
              :aria-label="locale.close"
              @click="close"
            >
              ×
            </button>
          </header>
          <div class="wd-drawer__body"><slot /></div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
