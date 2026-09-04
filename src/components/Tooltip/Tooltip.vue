<script setup lang="ts">
import type { TooltipProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWdId } from '../../shared/useWdId'
import { useWdConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle, toCssSize } from '../../shared/overlayPlacement'

const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  disabled: false,
  showDelay: 0,
  hideDelay: 0,
  teleport: true,
})

const config = useWdConfig()
const root = ref<HTMLElement | null>(null)
const tipId = useWdId()
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

function updateTipPosition() {
  if (!teleported.value || !root.value) return
  tipStyle.value = computeFloatingOverlayStyle(
    root.value.getBoundingClientRect(),
    props.placement,
    { maxWidth: toCssSize(props.maxWidth) },
  )
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
    class="wd-tooltip"
    :aria-describedby="visible ? tipId : undefined"
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
          :id="tipId"
          class="wd-tooltip__content"
          :class="[`wd-tooltip__content--${placement}`, { 'wd-tooltip__content--teleported': teleported }]"
          :style="contentStyle"
          role="tooltip"
        >
          {{ content }}
        </span>
      </Transition>
    </Teleport>
  </span>
</template>
