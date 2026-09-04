<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { ConfirmDialogProps } from './types'
import { computed, ref, toRef, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { allowAfterGuard } from '../../shared/asyncGuard'
import { useWdConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import WdButton from '../Button/Button.vue'
import WdIcon from '../Icon/Icon.vue'

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

const config = useWdConfig()
const locale = useWdLocale()
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
  '--wd-dialog-origin-x': `${origin.value.x}px`,
  '--wd-dialog-origin-y': `${origin.value.y}px`,
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
    <Transition name="wd-dialog">
      <div
        v-if="modelValue"
        class="wd-dialog-backdrop wd-dialog-backdrop--center wd-dialog-backdrop--modal wd-confirmdialog-backdrop"
        :style="zoomStyle"
      >
        <div class="wd-dialog-zoom" @click.self="onOutsideClick">
          <section
            ref="dialogElement"
            class="wd-dialog wd-confirmdialog"
            :class="{ [`wd-dialog--${resolvedType}`]: resolvedType }"
            role="alertdialog"
            aria-modal="true"
            :aria-label="title"
            tabindex="-1"
          >
            <header class="wd-dialog__header wd-confirmdialog__header">
              <slot name="header">
                <h2>{{ title }}</h2>
              </slot>
            </header>
            <div class="wd-dialog__body wd-confirmdialog__message">
              <span v-if="typeIcon" class="wd-dialog__type-icon" aria-hidden="true">
                <WdIcon :name="typeIcon" size="sm" />
              </span>
              <div class="wd-confirmdialog__copy">
                <slot>{{ message }}</slot>
              </div>
            </div>
            <footer class="wd-dialog__footer wd-confirmdialog__footer">
              <slot name="footer">
                <WdButton
                  :label="rejectText"
                  severity="secondary"
                  :disabled="busy"
                  :loading="pending === 'reject'"
                  @click="reject"
                />
                <WdButton
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
