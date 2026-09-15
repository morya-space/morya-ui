<script setup lang="ts">
import type { FloatingOverlayPlacement } from './overlayPlacement'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useMConfig } from './config'
import { resolveOverlayTeleport } from './overlay'
import { computeFloatingOverlayStyle } from './overlayPlacement'

defineOptions({ name: 'MFlyoutSubmenu', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    open: boolean
    anchor: HTMLElement | null
    panelClass: string
    placement?: FloatingOverlayPlacement
    minWidth?: string
  }>(),
  {
    placement: 'right-start',
    minWidth: '10rem',
  },
)

const emit = defineEmits<{
  (event: 'enter'): void
  (event: 'leave'): void
}>()

const config = useMConfig()
const panelStyle = ref<Record<string, string>>({})
const teleportTarget = computed(() => resolveOverlayTeleport({ teleport: true }, config.value.appendTo))

function updatePosition() {
  if (!props.open || !props.anchor) return
  panelStyle.value = computeFloatingOverlayStyle(props.anchor.getBoundingClientRect(), props.placement, {
    minWidth: props.minWidth,
    maxHeight: 'min(18rem, 45vh)',
    gap: 4,
  })
}

function onViewportChange() {
  if (props.open) updatePosition()
}

watch(
  () => [props.open, props.anchor] as const,
  ([open]) => {
    if (open) {
      void nextTick(updatePosition)
      window.addEventListener('resize', onViewportChange)
      window.addEventListener('scroll', onViewportChange, true)
    } else {
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
    }
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <div
      v-if="open && anchor"
      :class="[panelClass, `${panelClass}--teleported`]"
      :style="panelStyle"
      role="menu"
      @mouseenter="emit('enter')"
      @mouseleave="emit('leave')"
    >
      <slot />
    </div>
  </Teleport>
</template>
