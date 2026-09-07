<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { ConfirmDialogProps } from './types'
import { computed, ref, toRef, watch } from 'vue'
import { useRdLocale } from '../../locale'
import { allowAfterGuard } from '../../shared/asyncGuard'
import { useRdConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import RdButton from '../Button/Button.vue'
import RdIcon from '../Icon/Icon.vue'

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

const config = useRdConfig()
const locale = useRdLocale()
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
  '--rd-dialog-origin-x': `${origin.value.x}px`,
  '--rd-dialog-origin-y': `${origin.value.y}px`,
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
    <Transition name="rd-dialog">
      <div
        v-if="modelValue"
        class="rd-dialog-backdrop rd-dialog-backdrop--center rd-dialog-backdrop--modal rd-confirmdialog-backdrop"
        :style="zoomStyle"
      >
        <div class="rd-dialog-zoom" @click.self="onOutsideClick">
          <section
            ref="dialogElement"
            class="rd-dialog rd-confirmdialog"
            :class="{ [`rd-dialog--${resolvedType}`]: resolvedType }"
            role="alertdialog"
            aria-modal="true"
            :aria-label="title"
            tabindex="-1"
          >
            <header class="rd-dialog__header rd-confirmdialog__header">
              <slot name="header">
                <h2>{{ title }}</h2>
              </slot>
            </header>
            <div class="rd-dialog__body rd-confirmdialog__message">
              <span v-if="typeIcon" class="rd-dialog__type-icon" aria-hidden="true">
                <RdIcon :name="typeIcon" size="sm" />
              </span>
              <div class="rd-confirmdialog__copy">
                <slot>{{ message }}</slot>
              </div>
            </div>
            <footer class="rd-dialog__footer rd-confirmdialog__footer">
              <slot name="footer">
                <RdButton
                  :label="rejectText"
                  severity="secondary"
                  :disabled="busy"
                  :loading="pending === 'reject'"
                  @click="reject"
                />
                <RdButton
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
