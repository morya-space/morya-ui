<script setup lang="ts">
import type { IconName } from '../Icon/types'
import type { DialogProps } from './types'
import { computed, ref, toRef, useSlots, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { allowAfterGuard } from '../../shared/asyncGuard'
import { useWdConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import WdButton from '../Button/Button.vue'
import WdIcon from '../Icon/Icon.vue'

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
const slots = useSlots()
const config = useWdConfig()
const locale = useWdLocale()
const dialogElement = ref<HTMLElement | null>(null)
const maximized = ref(false)
const origin = ref(getLastPointer())
const pending = ref<'close' | 'positive' | 'negative' | null>(null)

const dialogTitle = computed(() => props.header ?? props.title)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
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
const showPresetFooter = computed(
  () => !slots.footer && Boolean(props.positiveText || props.negativeText),
)
const showFooter = computed(() => Boolean(slots.footer || showPresetFooter.value))
const busy = computed(() => pending.value != null)
const dialogAriaLabel = computed(() => props.ariaLabel ?? dialogTitle.value)
const backdropStyle = computed(() => ({
  '--wd-dialog-origin-x': `${origin.value.x}px`,
  '--wd-dialog-origin-y': `${origin.value.y}px`,
}))
const isDismissableMask = computed(() => {
  if (props.dismissableMask !== undefined) return props.dismissableMask
  if (props.closeOnOutsideClick !== undefined) return props.closeOnOutsideClick
  return true
})

function finishClose() {
  maximized.value = false
  pending.value = null
  emit('update:modelValue', false)
  emit('close')
}

async function dismiss() {
  if (pending.value) return
  if (!props.beforeClose) {
    finishClose()
    return
  }
  pending.value = 'close'
  try {
    if (!(await allowAfterGuard(props.beforeClose))) return
    finishClose()
  } finally {
    if (pending.value === 'close') pending.value = null
  }
}

async function onPositive(event: MouseEvent) {
  if (pending.value) return
  pending.value = 'positive'
  try {
    if (!(await allowAfterGuard(props.onPositiveClick, event))) return
    finishClose()
  } finally {
    if (pending.value === 'positive') pending.value = null
  }
}

async function onNegative(event: MouseEvent) {
  if (pending.value) return
  pending.value = 'negative'
  try {
    if (!(await allowAfterGuard(props.onNegativeClick, event))) return
    finishClose()
  } finally {
    if (pending.value === 'negative') pending.value = null
  }
}

function toggleMaximize() {
  maximized.value = !maximized.value
  if (maximized.value) emit('maximize')
  else emit('unmaximize')
}

function onOutsideClick() {
  if (isDismissableMask.value) void dismiss()
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
  onEscape: () => {
    void dismiss()
  },
  onOpen: () => emit('show'),
  onClose: () => {
    maximized.value = false
    emit('hide')
  },
})

defineExpose({
  close: dismiss,
  maximize: () => {
    if (!maximized.value) toggleMaximize()
  },
  unmaximize: () => {
    if (maximized.value) toggleMaximize()
  },
})
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="wd-dialog">
      <div
        v-if="modelValue"
        class="wd-dialog-backdrop"
        :class="[
          `wd-dialog-backdrop--${position}`,
          {
            'wd-dialog-backdrop--modal': modal,
            'wd-dialog-backdrop--maximized': maximized,
          },
        ]"
        :style="backdropStyle"
      >
        <div class="wd-dialog-zoom" @click.self="onOutsideClick">
          <section
            ref="dialogElement"
            class="wd-dialog"
            :class="{
              'wd-dialog--maximized': maximized,
              [`wd-dialog--${resolvedType}`]: resolvedType,
            }"
            :style="width && !maximized ? { width } : undefined"
            role="dialog"
            :aria-modal="modal || undefined"
            :aria-label="dialogAriaLabel"
            tabindex="-1"
          >
            <header v-if="$slots.header || dialogTitle || typeIcon || closable || maximizable" class="wd-dialog__header">
              <div class="wd-dialog__heading">
                <span v-if="typeIcon" class="wd-dialog__type-icon" aria-hidden="true">
                  <WdIcon :name="typeIcon" size="sm" />
                </span>
                <slot name="header">
                  <h2 v-if="dialogTitle">
                    {{ dialogTitle }}
                  </h2>
                </slot>
              </div>
              <div v-if="maximizable || closable" class="wd-dialog__actions">
                <button
                  v-if="maximizable"
                  type="button"
                  class="wd-dialog__action"
                  :aria-label="maximized ? locale.restore : locale.maximize"
                  :disabled="busy"
                  @click="toggleMaximize"
                >
                  <WdIcon :name="maximized ? 'restore' : 'maximize'" size="sm" />
                </button>
                <button
                  v-if="closable"
                  type="button"
                  class="wd-dialog__action"
                  :aria-label="locale.close"
                  :disabled="busy"
                  @click="dismiss"
                >
                  <WdIcon name="close" size="sm" />
                </button>
              </div>
            </header>
            <div class="wd-dialog__body">
              <slot />
            </div>
            <footer
              v-if="showFooter"
              class="wd-dialog__footer"
              :class="{ 'wd-dialog__footer--preset': showPresetFooter }"
            >
              <slot name="footer">
                <WdButton
                  v-if="negativeText"
                  :label="negativeText"
                  severity="secondary"
                  :disabled="busy"
                  :loading="pending === 'negative'"
                  @click="onNegative"
                />
                <WdButton
                  v-if="positiveText"
                  :label="positiveText"
                  :severity="positiveSeverity"
                  :disabled="busy && pending !== 'positive'"
                  :loading="pending === 'positive'"
                  @click="onPositive"
                />
              </slot>
            </footer>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
