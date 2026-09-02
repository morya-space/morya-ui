<script setup lang="ts">
import type { MenuItem, MenuProps } from './types'
import { computed, nextTick, onBeforeUnmount, provide, reactive, ref, useSlots, watch } from 'vue'
import { useWiConfig } from '../../shared/config'
import {
  collectExpandableKeys,
  collectTopLevelKeys,
  findMenuKeyPath,
  menuHasDescendantKey,
  resolveMenuItemKey,
} from '../../shared/menu'
import { getLastPointer } from '../../shared/lastPointer'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { WI_MENU_KEY } from './context'
import MenuNodes from './MenuNodes.vue'

const props = withDefaults(defineProps<MenuProps>(), {
  popup: false,
  modelValue: false,
  placement: 'bottom-start',
  selectedKey: null,
  collapsed: false,
  indent: 12,
  rootIndent: 16,
  collapsedWidth: 80,
  accordion: false,
  defaultExpandedKeys: () => [],
  defaultExpandAll: false,
  mode: 'vertical',
  inverted: false,
  embedded: undefined,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:selectedKey', value: string | null): void
  (event: 'update:expandedKeys', value: string[]): void
  (event: 'select', item: MenuItem): void
}>()

const slots = useSlots()
const config = useWiConfig()
const root = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLElement | null>(null)
const popupStyle = ref<Record<string, string>>({})
const hasTriggerSlot = computed(() => Boolean(slots.default?.()?.length))
const teleportTarget = computed(() =>
  resolveOverlayTeleport(props.popup ? props : { teleport: false }, config.value.appendTo),
)
const teleported = computed(() => props.popup && isOverlayTeleported(props, config.value.appendTo))
const embedded = computed(() => props.embedded ?? !props.popup)

const selectedKeyRef = computed(() => props.selectedKey)
const expandedKeysInternal = ref<string[]>([])
const flyoutOpen = reactive<Record<string, boolean>>({})

function setFlyoutOpen(key: string, open: boolean) {
  flyoutOpen[key] = open
}

function closeAllFlyouts() {
  for (const key of Object.keys(flyoutOpen)) {
    flyoutOpen[key] = false
  }
}

function resolvePopupAnchor(): DOMRect {
  const triggerRect = triggerEl.value?.getBoundingClientRect()
  if (triggerRect && (triggerRect.width > 0 || triggerRect.height > 0)) {
    return triggerRect
  }
  const { x, y } = getLastPointer()
  return {
    left: x,
    top: y,
    right: x,
    bottom: y,
    width: 0,
    height: 0,
  } as DOMRect
}

function updatePopupPosition() {
  if (!props.popup || !props.modelValue || !teleported.value) return
  popupStyle.value = computeFloatingOverlayStyle(
    resolvePopupAnchor(),
    props.placement,
    {
      minWidth: '10rem',
      zIndex: config.value.zIndex ?? 1000,
    },
  )
}

function onViewportChange() {
  if (props.modelValue) updatePopupPosition()
}

function initExpandedKeys() {
  if (props.defaultExpandAll) {
    expandedKeysInternal.value = collectExpandableKeys(props.model)
    return
  }
  if (props.defaultExpandedKeys.length) {
    expandedKeysInternal.value = [...props.defaultExpandedKeys]
    return
  }
  if (props.selectedKey) {
    const path = findMenuKeyPath(props.model, props.selectedKey)
    expandedKeysInternal.value = path ?? []
    return
  }
  expandedKeysInternal.value = []
}

initExpandedKeys()

const expandedKeysRef = computed({
  get: () => props.expandedKeys ?? expandedKeysInternal.value,
  set: (value: string[]) => {
    expandedKeysInternal.value = value
    emit('update:expandedKeys', value)
  },
})

const topLevelKeys = computed(() => collectTopLevelKeys(props.model))

function isExpanded(key: string) {
  return expandedKeysRef.value.includes(key)
}

function toggleExpand(key: string) {
  const next = [...expandedKeysRef.value]
  const index = next.indexOf(key)
  if (index >= 0) {
    next.splice(index, 1)
  } else {
    if (props.accordion && topLevelKeys.value.includes(key)) {
      for (const openKey of [...next]) {
        if (topLevelKeys.value.includes(openKey) && openKey !== key) {
          const removeIndex = next.indexOf(openKey)
          if (removeIndex >= 0) next.splice(removeIndex, 1)
        }
      }
    }
    next.push(key)
  }
  expandedKeysRef.value = next
}

function expandToSelected(key: string | null) {
  if (!key) return
  const path = findMenuKeyPath(props.model, key)
  if (!path?.length) return
  const merged = new Set([...expandedKeysRef.value, ...path])
  if (props.accordion) {
    for (const topKey of topLevelKeys.value) {
      if (merged.has(topKey) && !path.includes(topKey)) merged.delete(topKey)
    }
  }
  expandedKeysRef.value = Array.from(merged)
}

watch(() => props.selectedKey, expandToSelected)

function resolveKey(item: MenuItem, index: number, prefix: string) {
  return resolveMenuItemKey(item, index, prefix)
}

function isSelected(item: MenuItem, index: number, prefix: string) {
  const key = resolveKey(item, index, prefix)
  return Boolean(props.selectedKey && key === props.selectedKey)
}

function isChildActive(item: MenuItem, index: number, prefix: string) {
  if (!props.selectedKey) return false
  return menuHasDescendantKey(item, props.selectedKey, index, prefix)
}

function paddingLeft(depth: number) {
  if (props.mode === 'horizontal') return props.rootIndent
  if (props.collapsed) {
    const iconSize = 20
    return Math.max(0, props.collapsedWidth / 2 - iconSize / 2)
  }
  return props.rootIndent + depth * props.indent
}

function activate(item: MenuItem) {
  if (item.disabled || item.separator) return
  item.command?.()
  const key = item.key ?? item.label ?? null
  emit('update:selectedKey', key)
  emit('select', item)
  if (props.popup) emit('update:modelValue', false)
  if (props.mode === 'horizontal') closeAllFlyouts()
}

provide(WI_MENU_KEY, {
  collapsed: computed(() => props.collapsed),
  selectedKey: selectedKeyRef,
  expandedKeys: expandedKeysRef,
  accordion: props.accordion,
  indent: props.indent,
  rootIndent: props.rootIndent,
  mode: props.mode,
  inverted: props.inverted,
  flyoutOpen,
  setFlyoutOpen,
  toggleExpand,
  isExpanded,
  activate,
  resolveKey,
  isSelected,
  isChildActive,
  paddingLeft,
})

function onOutsideClick(event: MouseEvent) {
  if (!props.popup || !props.modelValue) return
  const target = event.target as Node
  if (root.value?.contains(target)) return
  if (triggerEl.value?.contains(target)) return
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (open) => {
    if (!props.popup) return
    if (open) {
      void nextTick(updatePopupPosition)
      document.addEventListener('click', onOutsideClick)
      if (teleported.value) {
        window.addEventListener('resize', onViewportChange)
        window.addEventListener('scroll', onViewportChange, true)
      }
    } else {
      document.removeEventListener('click', onOutsideClick)
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('click', onOutsideClick)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})

const menuClass = computed(() => [
  'wi-menu',
  {
    'wi-menu--popup': props.popup,
    'wi-menu--teleported': teleported.value,
    'wi-menu--collapsed': props.collapsed,
    'wi-menu--embedded': embedded.value,
    'wi-menu--horizontal': props.mode === 'horizontal',
    'wi-menu--inverted': props.inverted,
  },
])
</script>

<template>
  <div
    v-if="!popup"
    ref="root"
    :class="menuClass"
    role="menu"
  >
    <MenuNodes :items="model" :depth="0" prefix="item" />
  </div>
  <div v-else-if="hasTriggerSlot" class="wi-menu-popup">
    <div ref="triggerEl" class="wi-menu-popup__anchor">
      <slot />
    </div>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-scale-fade">
        <div
          v-if="modelValue"
          ref="root"
          :class="menuClass"
          :style="teleported ? popupStyle : undefined"
          role="menu"
        >
          <MenuNodes :items="model" :depth="0" prefix="item" />
        </div>
      </Transition>
    </Teleport>
  </div>
  <Teleport v-else :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="wi-scale-fade">
      <div
        v-if="modelValue"
        ref="root"
        :class="menuClass"
        :style="teleported ? popupStyle : undefined"
        role="menu"
      >
        <MenuNodes :items="model" :depth="0" prefix="item" />
      </div>
    </Transition>
  </Teleport>
</template>
