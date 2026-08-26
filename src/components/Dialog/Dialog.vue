<script setup lang="ts">
import { computed, ref, toRef, useSlots, watch } from 'vue'
import { allowAfterGuard } from '../../shared/asyncGuard'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { normalizeSeverity } from '../../shared/types'
import { useModalOverlay } from '../../shared/useModalOverlay'
import WiButton from '../Button/Button.vue'
import WiIcon from '../Icon/Icon.vue'
import type { IconName } from '../Icon/types'
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
const slots = useSlots()
const config = useWiConfig()
const locale = useWiLocale()
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
          :class="{
            'wi-dialog--maximized': maximized,
            [`wi-dialog--${resolvedType}`]: resolvedType,
          }"
          :style="width && !maximized ? { width } : undefined"
          role="dialog"
          :aria-modal="modal || undefined"
          :aria-label="dialogTitle"
          tabindex="-1"
        >
          <header v-if="$slots.header || dialogTitle || typeIcon || closable || maximizable" class="wi-dialog__header">
            <div class="wi-dialog__heading">
              <span v-if="typeIcon" class="wi-dialog__type-icon" aria-hidden="true">
                <WiIcon :name="typeIcon" size="sm" />
              </span>
              <slot name="header"><h2 v-if="dialogTitle">{{ dialogTitle }}</h2></slot>
            </div>
            <div v-if="maximizable || closable" class="wi-dialog__actions">
              <button
                v-if="maximizable"
                type="button"
                class="wi-dialog__action"
                :aria-label="maximized ? locale.restore : locale.maximize"
                :disabled="busy"
                @click="toggleMaximize"
              >
                {{ maximized ? '❐' : '▢' }}
              </button>
              <button
                v-if="closable"
                type="button"
                class="wi-dialog__action"
                :aria-label="locale.close"
                :disabled="busy"
                @click="dismiss"
              >
                ×
              </button>
            </div>
          </header>
          <div class="wi-dialog__body"><slot /></div>
          <footer
            v-if="showFooter"
            class="wi-dialog__footer"
            :class="{ 'wi-dialog__footer--preset': showPresetFooter }"
          >
            <slot name="footer">
              <WiButton
                v-if="negativeText"
                :label="negativeText"
                severity="secondary"
                :disabled="busy"
                :loading="pending === 'negative'"
                @click="onNegative"
              />
              <WiButton
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
