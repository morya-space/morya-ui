<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { ContextMenuItem, ContextMenuPosition, ContextMenuProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import ContextMenuNodes from './ContextMenuNodes.vue'

const props = withDefaults(defineProps<Omit<ContextMenuProps, 'modelValue' | 'position'>>(), {
  teleport: true,
})
const modelValue = defineModel<boolean>({ default: false })
const position = defineModel<ContextMenuPosition>('position')
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const config = useMConfig()
const root = ref<HTMLElement | null>(null)
const localPosition = ref<ContextMenuPosition>({ x: 0, y: 0 })
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const menuStyle = computed(() => {
  const pos = position.value ?? localPosition.value
  return {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
  }
})

function onContextMenu(event: MouseEvent) {
  if (!props.model.length) return
  show(event)
}

function hide() {
  modelValue.value = false
}

function show(event: MouseEvent | ContextMenuPosition) {
  const next =
    'clientX' in event
      ? { x: event.clientX, y: event.clientY }
      : { x: event.x, y: event.y }
  if ('preventDefault' in event) event.preventDefault()
  if ('stopPropagation' in event) event.stopPropagation()
  localPosition.value = next
  position.value = next
  modelValue.value = true
}

function activate(item: ContextMenuItem) {
  if (item.disabled || item.separator) return
  item.command?.()
  hide()
}

function onDocumentClick(event: MouseEvent) {
  if (!modelValue.value) return
  if (root.value && !root.value.contains(event.target as Node)) hide()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') hide()
}

let contextMenuListenerToken = 0

function removeDocumentListeners() {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('contextmenu', onDocumentClick)
}

watch(
  modelValue,
  (open) => {
    removeDocumentListeners()
    if (!open) return

    document.addEventListener('click', onDocumentClick)
    document.addEventListener('keydown', onKeydown)
    const token = ++contextMenuListenerToken
    nextTick(() => {
      if (token === contextMenuListenerToken && modelValue.value) {
        document.addEventListener('contextmenu', onDocumentClick)
      }
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  removeDocumentListeners()
})

defineExpose({ show, hide })
</script>

<template>
  <div v-bind="rootAttrs" class="m-contextmenu-anchor" @contextmenu="onContextMenu">
    <slot />
  </div>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="m-scale-fade">
      <div
        v-if="modelValue"
        ref="root"
        class="m-contextmenu"
        :class="{ 'm-contextmenu--teleported': teleported }"
        role="menu"
        :style="menuStyle"
        @click.stop
      >
        <ContextMenuNodes :items="model" @activate="activate" />
      </div>
    </Transition>
  </Teleport>
</template>
