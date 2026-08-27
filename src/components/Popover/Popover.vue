<script setup lang="ts">
import type { PopoverProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'

const props = withDefaults(defineProps<PopoverProps>(), {
  modelValue: false,
  placement: 'bottom',
  trigger: 'manual',
  showDelay: 0,
  hideDelay: 200,
  teleport: true,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'show'): void
  (event: 'hide'): void
}>()

const config = useWiConfig()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

function setOpen(open: boolean) {
  emit('update:modelValue', open)
}

function close() {
  setOpen(false)
}

function clearHoverTimers() {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
  showTimer = undefined
  hideTimer = undefined
}

function onTriggerClick() {
  if (props.trigger !== 'click') return
  setOpen(!props.modelValue)
}

function onTriggerEnter() {
  if (props.trigger !== 'hover') return
  clearHoverTimers()
  if (props.showDelay > 0) {
    showTimer = setTimeout(setOpen, props.showDelay, true)
    return
  }
  setOpen(true)
}

function onTriggerLeave() {
  if (props.trigger !== 'hover') return
  clearHoverTimers()
  if (props.hideDelay > 0) {
    hideTimer = setTimeout(setOpen, props.hideDelay, false)
    return
  }
  setOpen(false)
}

function onPanelEnter() {
  if (props.trigger !== 'hover') return
  clearHoverTimers()
}

function onPanelLeave() {
  if (props.trigger !== 'hover') return
  clearHoverTimers()
  if (props.hideDelay > 0) {
    hideTimer = setTimeout(setOpen, props.hideDelay, false)
    return
  }
  setOpen(false)
}

function onTriggerFocus() {
  if (props.trigger !== 'focus') return
  clearHoverTimers()
  if (props.showDelay > 0) {
    showTimer = setTimeout(setOpen, props.showDelay, true)
    return
  }
  setOpen(true)
}

function onTriggerBlur() {
  if (props.trigger !== 'focus') return
  clearHoverTimers()
  if (props.hideDelay > 0) {
    hideTimer = setTimeout(setOpen, props.hideDelay, false)
    return
  }
  setOpen(false)
}

function updatePanelPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  const gap = 8
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  if (props.placement === 'top') {
    panelStyle.value = {
      left: `${centerX}px`,
      top: `${rect.top - gap}px`,
      transform: 'translate(-50%, -100%)',
    }
  } else if (props.placement === 'bottom') {
    panelStyle.value = {
      left: `${centerX}px`,
      top: `${rect.bottom + gap}px`,
      transform: 'translateX(-50%)',
    }
  } else if (props.placement === 'left') {
    panelStyle.value = {
      left: `${rect.left - gap}px`,
      top: `${centerY}px`,
      transform: 'translate(-100%, -50%)',
    }
  } else if (props.placement === 'right') {
    panelStyle.value = {
      left: `${rect.right + gap}px`,
      top: `${centerY}px`,
      transform: 'translateY(-50%)',
    }
  } else if (props.placement === 'bottom-end') {
    panelStyle.value = {
      left: `${rect.right}px`,
      top: `${rect.bottom + gap}px`,
      transform: 'translateX(-100%)',
    }
  } else {
    panelStyle.value = {
      left: `${rect.left}px`,
      top: `${rect.bottom + gap}px`,
    }
  }
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || panel.value?.contains(target)) return
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

function onViewportChange() {
  if (props.modelValue) updatePanelPosition()
}

watch(
  () => props.modelValue,
  async (open, previousOpen) => {
    if (open) {
      document.addEventListener('click', onDocumentClick)
      document.addEventListener('keydown', onKeydown)
      if (teleported.value) {
        window.addEventListener('resize', onViewportChange)
        window.addEventListener('scroll', onViewportChange, true)
      }
      emit('show')
      await nextTick()
      updatePanelPosition()
    } else {
      document.removeEventListener('click', onDocumentClick)
      document.removeEventListener('keydown', onKeydown)
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
      if (previousOpen) emit('hide')
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearHoverTimers()
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <span
    ref="root"
    class="wi-popover"
    @mouseenter="onTriggerEnter"
    @mouseleave="onTriggerLeave"
  >
    <span
      ref="trigger"
      class="wi-popover__trigger"
      @click="onTriggerClick"
      @focusin="onTriggerFocus"
      @focusout="onTriggerBlur"
    >
      <slot />
    </span>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-fade">
        <div
          v-if="modelValue"
          ref="panel"
          class="wi-popover__content"
          :class="[`wi-popover__content--${placement}`, { 'wi-popover__content--teleported': teleported }]"
          :style="teleported ? panelStyle : undefined"
          role="dialog"
          @mouseenter="onPanelEnter"
          @mouseleave="onPanelLeave"
        >
          <slot name="content" />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
