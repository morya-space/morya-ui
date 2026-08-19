<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWdConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import type { TooltipProps } from './types'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  disabled: false,
  showDelay: 0,
  teleport: true,
})

const config = useWdConfig()
const root = ref<HTMLElement | null>(null)
const visible = ref(false)
const tipStyle = ref<Record<string, string>>({})
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))
let showTimer: ReturnType<typeof setTimeout> | null = null

function clearShowTimer() {
  if (showTimer !== null) {
    clearTimeout(showTimer)
    showTimer = null
  }
}

function updateTipPosition() {
  if (!teleported.value || !root.value) return
  const rect = root.value.getBoundingClientRect()
  const gap = 8
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  if (props.placement === 'top') {
    tipStyle.value = {
      left: `${centerX}px`,
      top: `${rect.top - gap}px`,
      transform: 'translate(-50%, -100%)',
    }
  } else if (props.placement === 'bottom') {
    tipStyle.value = {
      left: `${centerX}px`,
      top: `${rect.bottom + gap}px`,
      transform: 'translateX(-50%)',
    }
  } else if (props.placement === 'left') {
    tipStyle.value = {
      left: `${rect.left - gap}px`,
      top: `${centerY}px`,
      transform: 'translate(-100%, -50%)',
    }
  } else {
    tipStyle.value = {
      left: `${rect.right + gap}px`,
      top: `${centerY}px`,
      transform: 'translateY(-50%)',
    }
  }
}

function show() {
  if (props.disabled) return
  clearShowTimer()
  const reveal = () => {
    visible.value = true
    void nextTick(updateTipPosition)
  }
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
  clearShowTimer()
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
  clearShowTimer()
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <span
    ref="root"
    class="wd-tooltip"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wd-fade">
        <span
          v-if="visible"
          class="wd-tooltip__content"
          :class="[`wd-tooltip__content--${placement}`, { 'wd-tooltip__content--teleported': teleported }]"
          :style="teleported ? tipStyle : undefined"
          role="tooltip"
        >
          {{ content }}
        </span>
      </Transition>
    </Teleport>
  </span>
</template>
