<script setup lang="ts">
import type { ConfirmPopupProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { allowAfterGuard } from '../../shared/asyncGuard'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import WiButton from '../Button/Button.vue'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<ConfirmPopupProps>(), {
  modelValue: false,
  target: null,
  position: null,
  placement: 'bottom',
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'accept'): void
  (event: 'reject'): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const pending = ref(false)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

function close() {
  pending.value = false
  emit('update:modelValue', false)
}

async function accept() {
  if (pending.value) return
  pending.value = true
  try {
    if (!(await allowAfterGuard(props.beforeAccept))) return
    emit('accept')
    close()
  } finally {
    if (pending.value) pending.value = false
  }
}

function reject() {
  if (pending.value) return
  emit('reject')
  close()
}

function updatePosition() {
  if (props.target) {
    const rect = props.target.getBoundingClientRect()
    const placement =
      props.placement === 'top' ||
      props.placement === 'left' ||
      props.placement === 'right'
        ? props.placement
        : 'bottom'
    panelStyle.value = computeFloatingOverlayStyle(rect, placement)
    return
  }
  if (props.position) {
    panelStyle.value = {
      left: `${props.position.left}px`,
      top: `${props.position.top}px`,
    }
    return
  }
  panelStyle.value = {
    left: '50%',
    top: '30%',
    transform: 'translateX(-50%)',
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') reject()
}

function onDocumentClick(event: MouseEvent) {
  if (panel.value?.contains(event.target as Node)) return
  if (props.target?.contains(event.target as Node)) return
  reject()
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      document.addEventListener('keydown', onKeydown)
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
      await nextTick()
      updatePosition()
      panel.value?.focus()
      window.setTimeout(() => document.addEventListener('click', onDocumentClick), 0)
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('click', onDocumentClick)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  },
  { immediate: true },
)

watch(
  () => [props.target, props.position, props.placement] as const,
  () => {
    if (props.modelValue) updatePosition()
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
})

const visible = computed(() => props.modelValue)
const acceptText = computed(() => props.acceptLabel ?? locale.value.accept)
const rejectText = computed(() => props.rejectLabel ?? locale.value.reject)
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="wi-scale-fade">
      <div
        v-if="visible"
        ref="panel"
        class="wi-confirmpopup"
        :class="{ 'wi-confirmpopup--teleported': teleported }"
        role="alertdialog"
        aria-modal="true"
        tabindex="-1"
        :style="panelStyle"
      >
        <div class="wi-confirmpopup__message">
          <WiIcon v-if="icon" class="wi-confirmpopup__icon" :name="icon" size="sm" />
          <slot>{{ message }}</slot>
        </div>
        <div class="wi-confirmpopup__footer">
          <WiButton :label="rejectText" severity="secondary" size="small" @click="reject" />
          <WiButton :label="acceptText" size="small" :loading="pending" @click="accept" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
