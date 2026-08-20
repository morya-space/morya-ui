<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import type { DropdownItem, DropdownProps } from './types'

const props = withDefaults(defineProps<DropdownProps>(), {
  modelValue: false,
  placement: 'bottom-start',
  closeOnSelect: true,
  teleport: true,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'select', item: DropdownItem): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const menuStyle = ref<Record<string, string>>({})
const highlightedIndex = ref(-1)
const enabledItems = computed(() => props.items.filter((item) => !item.disabled))
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

function initHighlight() {
  highlightedIndex.value = enabledItems.value.length ? 0 : -1
}

function updateMenuPosition() {
  if (!teleported.value || !trigger.value) return
  const rect = trigger.value.getBoundingClientRect()
  menuStyle.value = {
    left: props.placement === 'bottom-end' ? `${rect.right}px` : `${rect.left}px`,
    minWidth: `${rect.width}px`,
    top: `${rect.bottom + 8}px`,
    ...(props.placement === 'bottom-end' ? { transform: 'translateX(-100%)' } : {}),
  }
}

function setOpen(open: boolean) {
  emit('update:modelValue', open)
  if (open) {
    initHighlight()
    void nextTick(() => {
      updateMenuPosition()
      menu.value?.focus({ preventScroll: true })
    })
  }
}

function toggle() {
  setOpen(!props.modelValue)
}

function onViewportChange() {
  if (props.modelValue) updateMenuPosition()
}

function selectItem(item: DropdownItem) {
  if (!item.disabled) {
    emit('select', item)
    if (props.closeOnSelect) setOpen(false)
  }
}

function onKeydown(event: KeyboardEvent) {
  if (!props.modelValue) return
  if (event.key === 'Escape') {
    event.preventDefault()
    setOpen(false)
    trigger.value?.focus({ preventScroll: true })
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const length = enabledItems.value.length
    if (length) highlightedIndex.value = (highlightedIndex.value + direction + length) % length
  }
  if (event.key === 'Home') {
    event.preventDefault()
    highlightedIndex.value = 0
  }
  if (event.key === 'End') {
    event.preventDefault()
    highlightedIndex.value = enabledItems.value.length - 1
  }
  if (event.key === 'Enter' || event.key === ' ') {
    const item = enabledItems.value[highlightedIndex.value]
    if (highlightedIndex.value >= 0 && item) {
      event.preventDefault()
      selectItem(item)
    }
  }
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!props.modelValue) setOpen(true)
  }
}

function onDocumentClick(event: MouseEvent) {
  if (
    props.modelValue &&
    root.value &&
    !root.value.contains(event.target as Node) &&
    !menu.value?.contains(event.target as Node)
  ) {
    setOpen(false)
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.addEventListener('click', onDocumentClick)
      if (teleported.value) {
        window.addEventListener('resize', onViewportChange)
        window.addEventListener('scroll', onViewportChange, true)
      }
    } else {
      document.removeEventListener('click', onDocumentClick)
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div ref="root" class="wi-dropdown">
    <span
      ref="trigger"
      class="wi-dropdown__trigger"
      role="button"
      tabindex="0"
      :aria-expanded="modelValue"
      aria-haspopup="menu"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <slot name="trigger">{{ locale.openMenu }}</slot>
    </span>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-scale-fade">
        <div
          v-if="modelValue"
          ref="menu"
          class="wi-dropdown__menu"
          :class="[`wi-dropdown__menu--${placement}`, { 'wi-dropdown__menu--teleported': teleported }]"
          :style="teleported ? menuStyle : undefined"
          role="menu"
          tabindex="-1"
          @keydown="onKeydown"
        >
          <button
            v-for="item in items"
            :key="item.value"
            type="button"
            class="wi-dropdown__item"
            :class="{ 'wi-dropdown__item--highlighted': enabledItems[highlightedIndex]?.value === item.value }"
            role="menuitem"
            :disabled="item.disabled"
            @mouseenter="!item.disabled && (highlightedIndex = enabledItems.findIndex((enabledItem) => enabledItem.value === item.value))"
            @click="selectItem(item)"
          >
            <slot name="item" :item="item">{{ item.label }}</slot>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
