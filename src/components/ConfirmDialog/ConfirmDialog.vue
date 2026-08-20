<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import WiButton from '../Button/Button.vue'
import type { ConfirmDialogProps } from './types'

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  modelValue: false,
  acceptSeverity: undefined,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'accept'): void
  (event: 'reject'): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const dialogElement = ref<HTMLElement | null>(null)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const title = computed(() => props.header ?? locale.value.confirm)
const acceptText = computed(() => props.acceptLabel ?? locale.value.accept)
const rejectText = computed(() => props.rejectLabel ?? locale.value.reject)
const origin = ref(getLastPointer())
const zoomStyle = computed(() => ({
  '--wi-dialog-origin-x': `${origin.value.x}px`,
  '--wi-dialog-origin-y': `${origin.value.y}px`,
}))

function close() {
  emit('update:modelValue', false)
}

function accept() {
  emit('accept')
  close()
}

function reject() {
  emit('reject')
  close()
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
  blockScroll: true,
  onEscape: reject,
})
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="wi-dialog">
      <div
        v-if="modelValue"
        class="wi-dialog-backdrop wi-dialog-backdrop--center wi-dialog-backdrop--modal wi-confirmdialog-backdrop"
        :style="zoomStyle"
      >
        <div class="wi-dialog-zoom" @click.self="reject">
        <section
          ref="dialogElement"
          class="wi-dialog wi-confirmdialog"
          role="alertdialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
        >
          <header class="wi-dialog__header wi-confirmdialog__header">
            <slot name="header">
              <h2>{{ title }}</h2>
            </slot>
          </header>
          <div class="wi-dialog__body wi-confirmdialog__message">
            <slot>{{ message }}</slot>
          </div>
          <footer class="wi-dialog__footer wi-confirmdialog__footer">
            <slot name="footer">
              <WiButton :label="rejectText" severity="secondary" @click="reject" />
              <WiButton :label="acceptText" :severity="acceptSeverity" @click="accept" />
            </slot>
          </footer>
        </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
