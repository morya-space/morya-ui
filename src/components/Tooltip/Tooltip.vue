<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import type { TooltipProps } from './types'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  disabled: false,
  showDelay: 0,
  hideDelay: 0,
  teleport: true,
})

const config = useWiConfig()
const root = ref<HTMLElement | null>(null)
const visible = ref(false)
const tipStyle = ref<Record<string, string>>({})
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (showTimer !== null) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer !== null) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

function toCssSize(value?: string | number) {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

function updateTipPosition() {
  if (!teleported.value || !root.value) return
  const rect = root.value.getBoundingClientRect()
  const gap = 8
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const maxWidth = toCssSize(props.maxWidth)

  if (props.placement === 'top') {
    tipStyle.value = {
      left: `${centerX}px`,
      top: `${rect.top - gap}px`,
      transform: 'translate(-50%, -100%)',
      ...(maxWidth ? { maxWidth } : {}),
    }
  } else if (props.placement === 'bottom') {
    tipStyle.value = {
      left: `${centerX}px`,
      top: `${rect.bottom + gap}px`,
      transform: 'translateX(-50%)',
      ...(maxWidth ? { maxWidth } : {}),
    }
  } else if (props.placement === 'left') {
    tipStyle.value = {
      left: `${rect.left - gap}px`,
      top: `${centerY}px`,
      transform: 'translate(-100%, -50%)',
      ...(maxWidth ? { maxWidth } : {}),
    }
  } else {
    tipStyle.value = {
      left: `${rect.right + gap}px`,
      top: `${centerY}px`,
      transform: 'translateY(-50%)',
      ...(maxWidth ? { maxWidth } : {}),
    }
  }
}

function reveal() {
  visible.value = true
  void nextTick(updateTipPosition)
}

function show() {
  if (props.disabled) return
  clearTimers()
  if (props.showDelay > 0) {
    showTimer = setTimeout(() => {
      reveal()
      showTimer = null
    }, props.showDelay)
    return
  }
  reveal()
}

function hide() {
  clearTimers()
  if (props.hideDelay > 0) {
    hideTimer = setTimeout(() => {
      visible.value = false
      hideTimer = null
    }, props.hideDelay)
    return
  }
  visible.value = false
}

function onViewportChange() {
  if (visible.value) updateTipPosition()
}

watch(visible, (next) => {
  if (next && teleported.value) {
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true)
  } else {
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

onBeforeUnmount(() => {
  clearTimers()
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})

const contentStyle = computed(() => {
  const maxWidth = toCssSize(props.maxWidth)
  if (teleported.value) return tipStyle.value
  return maxWidth ? { maxWidth } : undefined
})
</script>

<template>
  <span
    ref="root"
    class="wi-tooltip"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-fade">
        <span
          v-if="visible"
          class="wi-tooltip__content"
          :class="[`wi-tooltip__content--${placement}`, { 'wi-tooltip__content--teleported': teleported }]"
          :style="contentStyle"
          role="tooltip"
        >
          {{ content }}
        </span>
      </Transition>
    </Teleport>
  </span>
</template>
