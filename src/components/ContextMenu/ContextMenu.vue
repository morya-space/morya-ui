<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { ContextMenuItem, ContextMenuPosition, ContextMenuProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import ContextMenuNodes from './ContextMenuNodes.vue'

const props = withDefaults(defineProps<ContextMenuProps>(), {
  modelValue: false,
  teleport: true,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:position', value: ContextMenuPosition): void
}>()

const config = useMConfig()
const root = ref<HTMLElement | null>(null)
const localPosition = ref<ContextMenuPosition>({ x: 0, y: 0 })
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const menuStyle = computed(() => {
  const pos = props.position ?? localPosition.value
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
  emit('update:modelValue', false)
}

function show(event: MouseEvent | ContextMenuPosition) {
  const next =
    'clientX' in event
      ? { x: event.clientX, y: event.clientY }
      : { x: event.x, y: event.y }
  if ('preventDefault' in event) event.preventDefault()
  localPosition.value = next
  emit('update:position', next)
  emit('update:modelValue', true)
}

function activate(item: ContextMenuItem) {
  if (item.disabled || item.separator) return
  item.command?.()
  hide()
}

function onDocumentClick(event: MouseEvent) {
  if (!props.modelValue) return
  if (root.value && !root.value.contains(event.target as Node)) hide()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') hide()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.addEventListener('click', onDocumentClick)
      document.addEventListener('keydown', onKeydown)
      document.addEventListener('contextmenu', onDocumentClick)
    } else {
      document.removeEventListener('click', onDocumentClick)
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('contextmenu', onDocumentClick)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('contextmenu', onDocumentClick)
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
