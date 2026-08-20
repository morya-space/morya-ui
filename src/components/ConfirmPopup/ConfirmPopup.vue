<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import WiButton from '../Button/Button.vue'
import type { ConfirmPopupProps } from './types'

const props = withDefaults(defineProps<ConfirmPopupProps>(), {
  modelValue: false,
  target: null,
  position: null,
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
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

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

function updatePosition() {
  if (props.target) {
    const rect = props.target.getBoundingClientRect()
    panelStyle.value = {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.bottom + 8}px`,
      transform: 'translateX(-50%)',
    }
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
      // Defer so the opening click does not immediately dismiss.
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
  () => [props.target, props.position] as const,
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
          <slot>{{ message }}</slot>
        </div>
        <div class="wi-confirmpopup__footer">
          <WiButton :label="rejectText" severity="secondary" size="small" @click="reject" />
          <WiButton :label="acceptText" size="small" @click="accept" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
