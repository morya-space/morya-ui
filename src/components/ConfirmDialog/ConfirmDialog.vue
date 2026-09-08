<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { ConfirmDialogProps } from './types'
import { computed, ref, toRef, watch } from 'vue'
import { useWkLocale } from '../../locale'
import { allowAfterGuard } from '../../shared/asyncGuard'
import { useWkConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import WkButton from '../Button/Button.vue'
import WkIcon from '../Icon/Icon.vue'

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

const config = useWkConfig()
const locale = useWkLocale()
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
  '--wk-dialog-origin-x': `${origin.value.x}px`,
  '--wk-dialog-origin-y': `${origin.value.y}px`,
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
    <Transition name="wk-dialog">
      <div
        v-if="modelValue"
        class="wk-dialog-backdrop wk-dialog-backdrop--center wk-dialog-backdrop--modal wk-confirmdialog-backdrop"
        :style="zoomStyle"
      >
        <div class="wk-dialog-zoom" @click.self="onOutsideClick">
          <section
            ref="dialogElement"
            class="wk-dialog wk-confirmdialog"
            :class="{ [`wk-dialog--${resolvedType}`]: resolvedType }"
            role="alertdialog"
            aria-modal="true"
            :aria-label="title"
            tabindex="-1"
          >
            <header class="wk-dialog__header wk-confirmdialog__header">
              <slot name="header">
                <h2>{{ title }}</h2>
              </slot>
            </header>
            <div class="wk-dialog__body wk-confirmdialog__message">
              <span v-if="typeIcon" class="wk-dialog__type-icon" aria-hidden="true">
                <WkIcon :name="typeIcon" size="sm" />
              </span>
              <div class="wk-confirmdialog__copy">
                <slot>{{ message }}</slot>
              </div>
            </div>
            <footer class="wk-dialog__footer wk-confirmdialog__footer">
              <slot name="footer">
                <WkButton
                  :label="rejectText"
                  severity="secondary"
                  :disabled="busy"
                  :loading="pending === 'reject'"
                  @click="reject"
                />
                <WkButton
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
