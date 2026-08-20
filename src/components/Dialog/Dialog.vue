<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import type { DialogProps } from './types'

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  closeOnEsc: true,
  closable: true,
  maximizable: false,
  modal: true,
  position: 'center',
  teleport: true,
  blockScroll: true,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
  (event: 'show'): void
  (event: 'hide'): void
  (event: 'maximize'): void
  (event: 'unmaximize'): void
}>()
const config = useWiConfig()
const locale = useWiLocale()
const dialogElement = ref<HTMLElement | null>(null)
const maximized = ref(false)
const origin = ref(getLastPointer())

const dialogTitle = computed(() => props.header ?? props.title)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const backdropStyle = computed(() => ({
  zIndex: String(config.value.zIndex ?? 1000),
  '--wi-dialog-origin-x': `${origin.value.x}px`,
  '--wi-dialog-origin-y': `${origin.value.y}px`,
}))
const isDismissableMask = computed(() => {
  if (props.dismissableMask !== undefined) return props.dismissableMask
  if (props.closeOnOutsideClick !== undefined) return props.closeOnOutsideClick
  return true
})

function close() {
  maximized.value = false
  emit('update:modelValue', false)
  emit('close')
}

function toggleMaximize() {
  maximized.value = !maximized.value
  if (maximized.value) emit('maximize')
  else emit('unmaximize')
}

function onOutsideClick() {
  if (isDismissableMask.value) close()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) origin.value = getLastPointer()
  },
)

useModalOverlay({
  open: toRef(props, 'modelValue'),
  container: dialogElement,
  closeOnEsc: toRef(props, 'closeOnEsc'),
  blockScroll: () => props.blockScroll && props.modal,
  onEscape: close,
  onOpen: () => emit('show'),
  onClose: () => {
    maximized.value = false
    emit('hide')
  },
})
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="wi-dialog">
      <div
        v-if="modelValue"
        class="wi-dialog-backdrop"
        :class="[
          `wi-dialog-backdrop--${position}`,
          {
            'wi-dialog-backdrop--modal': modal,
            'wi-dialog-backdrop--maximized': maximized,
          },
        ]"
        :style="backdropStyle"
      >
        <div class="wi-dialog-zoom" @click.self="onOutsideClick">
        <section
          ref="dialogElement"
          class="wi-dialog"
          :class="{ 'wi-dialog--maximized': maximized }"
          :style="width && !maximized ? { width } : undefined"
          role="dialog"
          :aria-modal="modal || undefined"
          :aria-label="dialogTitle"
          tabindex="-1"
        >
          <header v-if="$slots.header || dialogTitle || closable || maximizable" class="wi-dialog__header">
            <slot name="header"><h2 v-if="dialogTitle">{{ dialogTitle }}</h2></slot>
            <div v-if="maximizable || closable" class="wi-dialog__actions">
              <button
                v-if="maximizable"
                type="button"
                class="wi-dialog__action"
                :aria-label="maximized ? locale.restore : locale.maximize"
                @click="toggleMaximize"
              >
                {{ maximized ? '❐' : '▢' }}
              </button>
              <button
                v-if="closable"
                type="button"
                class="wi-dialog__action"
                :aria-label="locale.close"
                @click="close"
              >
                ×
              </button>
            </div>
          </header>
          <div class="wi-dialog__body"><slot /></div>
          <footer v-if="$slots.footer" class="wi-dialog__footer"><slot name="footer" /></footer>
        </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
