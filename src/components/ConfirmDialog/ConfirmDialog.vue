<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { ConfirmDialogProps } from './types'
import { computed, ref, toRef, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { allowAfterGuard } from '../../shared/asyncGuard'
import { useWiConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import WiButton from '../Button/Button.vue'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  modelValue: false,
  acceptSeverity: undefined,
  loading: false,
  closeOnEsc: true,
  closeOnOutsideClick: true,
  blockScroll: true,
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
const pending = ref<'accept' | 'reject' | null>(null)
const busy = computed(() => pending.value != null || props.loading)
const resolvedType = computed(() => {
  const type = props.type
  if (type === 'warning' || type === 'warn') return 'warn'
  return type
})
const typeIcon = computed<IconName | undefined>(() => {
  switch (resolvedType.value) {
    case 'success':
      return 'check-circle'
    case 'warn':
      return 'warning'
    case 'error':
      return 'x-circle'
    case 'info':
      return 'info'
    default:
      return undefined
  }
})
const zoomStyle = computed(() => ({
  '--wi-dialog-origin-x': `${origin.value.x}px`,
  '--wi-dialog-origin-y': `${origin.value.y}px`,
}))

function close() {
  pending.value = null
  emit('update:modelValue', false)
}

async function accept() {
  if (pending.value) return
  pending.value = 'accept'
  try {
    if (!(await allowAfterGuard(props.beforeAccept))) return
    emit('accept')
    close()
  } finally {
    if (pending.value === 'accept') pending.value = null
  }
}

async function reject() {
  if (pending.value) return
  pending.value = 'reject'
  try {
    if (!(await allowAfterGuard(props.beforeReject))) return
    emit('reject')
    close()
  } finally {
    if (pending.value === 'reject') pending.value = null
  }
}

function onOutsideClick() {
  if (props.closeOnOutsideClick) void reject()
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
  closeOnEsc: () => props.closeOnEsc,
  blockScroll: () => props.blockScroll,
  onEscape: () => {
    void reject()
  },
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
        <div class="wi-dialog-zoom" @click.self="onOutsideClick">
          <section
            ref="dialogElement"
            class="wi-dialog wi-confirmdialog"
            :class="{ [`wi-dialog--${resolvedType}`]: resolvedType }"
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
              <span v-if="typeIcon" class="wi-dialog__type-icon" aria-hidden="true">
                <WiIcon :name="typeIcon" size="sm" />
              </span>
              <div class="wi-confirmdialog__copy">
                <slot>{{ message }}</slot>
              </div>
            </div>
            <footer class="wi-dialog__footer wi-confirmdialog__footer">
              <slot name="footer">
                <WiButton
                  :label="rejectText"
                  severity="secondary"
                  :disabled="busy"
                  :loading="pending === 'reject'"
                  @click="reject"
                />
                <WiButton
                  :label="acceptText"
                  :severity="acceptSeverity"
                  :disabled="busy && pending !== 'accept'"
                  :loading="loading || pending === 'accept'"
                  @click="accept"
                />
              </slot>
            </footer>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
