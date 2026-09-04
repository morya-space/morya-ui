<script setup lang="ts">
import type { SpeedDialItem, SpeedDialProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { useWdId } from '../../shared/useWdId'
import { computeFloatingOverlayStyle, type FloatingOverlayPlacement } from '../../shared/overlayPlacement'
import { resolveMenuIcon } from '../../shared/menu'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<SpeedDialProps>(), {
  model: () => [],
  direction: 'up',
  modelValue: false,
  disabled: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'item-click', item: SpeedDialItem): void
}>()

const config = useWdConfig()
const locale = useWdLocale()
const speedDialLabel = computed(() => props.ariaLabel ?? locale.value.speedDial)
const root = ref<HTMLElement | null>(null)
const button = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const listStyle = ref<Record<string, string>>({})
const listId = useWdId('wd-speeddial-list')
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const rootClass = computed(() => [
  'wd-speeddial',
  `wd-speeddial--${props.direction}`,
  {
    'wd-speeddial--open': props.modelValue,
    'wd-speeddial--disabled': props.disabled,
  },
])

function updateListPosition() {
  if (!teleported.value || !button.value) return
  const rect = button.value.getBoundingClientRect()
  const placement: FloatingOverlayPlacement =
    props.direction === 'up'
      ? 'top'
      : props.direction === 'down'
        ? 'bottom'
        : props.direction === 'left'
          ? 'left'
          : 'right'
  listStyle.value = computeFloatingOverlayStyle(rect, placement)
}

const keyboard = useMenuKeyboard({
  itemCount: () => props.model.length,
  isItemDisabled: (index) => Boolean(props.model[index]?.disabled),
  enabled: () => props.modelValue,
})

function close(restoreFocus = false) {
  emit('update:modelValue', false)
  if (restoreFocus) button.value?.focus({ preventScroll: true })
}

function focusActiveAction() {
  const index = keyboard.activeIndex.value
  if (index < 0) return
  list.value?.querySelectorAll<HTMLElement>('.wd-speeddial__action')[index]?.focus({ preventScroll: true })
}

function arrowDelta(key: string): number | null {
  const vertical = props.direction === 'up' || props.direction === 'down'
  // For `up`/`left` the list grows away from the button, so moving "outward"
  // (visually up/left) means advancing to the next item.
  if (vertical) {
    if (key === 'ArrowUp') return props.direction === 'up' ? 1 : -1
    if (key === 'ArrowDown') return props.direction === 'up' ? -1 : 1
    return null
  }
  if (key === 'ArrowLeft') return props.direction === 'left' ? 1 : -1
  if (key === 'ArrowRight') return props.direction === 'left' ? -1 : 1
  return null
}

function onListKeydown(event: KeyboardEvent) {
  if (!props.modelValue) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close(true)
    return
  }
  const delta = arrowDelta(event.key)
  if (delta !== null) {
    event.preventDefault()
    keyboard.move(delta)
    return
  }
  if (event.key === 'Home') {
    event.preventDefault()
    keyboard.moveFirst()
    return
  }
  if (event.key === 'End') {
    event.preventDefault()
    keyboard.moveLast()
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    const index = keyboard.activeIndex.value
    const item = props.model[index]
    if (item && !item.disabled) {
      event.preventDefault()
      activate(item)
    }
  }
}

function onButtonKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (!props.modelValue) {
    if (event.key.startsWith('Arrow')) {
      event.preventDefault()
      emit('update:modelValue', true)
    }
    return
  }
  onListKeydown(event)
}

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}

function activate(item: SpeedDialItem) {
  if (props.disabled || item.disabled) return
  item.command?.()
  emit('item-click', item)
  close(true)
}

function iconOf(item: SpeedDialItem) {
  return resolveMenuIcon(item.icon)
}

function onViewportChange() {
  if (props.modelValue) updateListPosition()
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || list.value?.contains(target)) return
  close()
}

function onDocumentFocusIn(event: FocusEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || list.value?.contains(target)) return
  close()
}

watch(keyboard.activeIndex, () => {
  if (props.modelValue) focusActiveAction()
})

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      void nextTick(() => {
        updateListPosition()
        keyboard.moveFirst()
        focusActiveAction()
      })
      document.addEventListener('click', onDocumentClick)
      document.addEventListener('focusin', onDocumentFocusIn)
      if (teleported.value) {
        window.addEventListener('resize', onViewportChange)
        window.addEventListener('scroll', onViewportChange, true)
      }
    } else {
      keyboard.reset()
      document.removeEventListener('click', onDocumentClick)
      document.removeEventListener('focusin', onDocumentFocusIn)
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('focusin', onDocumentFocusIn)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div ref="root" :class="rootClass">
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wd-scale-fade">
        <ul
          v-if="modelValue"
          :id="listId"
          ref="list"
          class="wd-speeddial__list"
          :class="{ 'wd-speeddial__list--teleported': teleported }"
          :style="teleported ? listStyle : undefined"
          role="menu"
          @keydown="onListKeydown"
        >
          <li v-for="(item, index) in model" :key="`${item.label}-${index}`" role="none">
            <button
              type="button"
              class="wd-speeddial__action"
              role="menuitem"
              :title="item.label"
              :aria-label="item.label"
              :disabled="item.disabled"
              :tabindex="keyboard.tabindexFor(index)"
              @click="activate(item)"
            >
              <slot name="item" :item="item">
                <span v-if="iconOf(item)" aria-hidden="true">
                  <WdIcon :name="iconOf(item)!" size="sm" />
                </span>
                <span class="wd-speeddial__action-label">{{ item.label }}</span>
              </slot>
            </button>
          </li>
        </ul>
      </Transition>
    </Teleport>
    <slot name="button">
      <button
        ref="button"
        type="button"
        class="wd-speeddial__button"
        :aria-label="speedDialLabel"
        :aria-expanded="modelValue"
        :aria-controls="modelValue ? listId : undefined"
        aria-haspopup="menu"
        :disabled="disabled"
        @click="toggle"
        @keydown="onButtonKeydown"
      >
        <slot name="icon">
          <WdIcon name="plus" size="sm" />
        </slot>
      </button>
    </slot>
  </div>
</template>
