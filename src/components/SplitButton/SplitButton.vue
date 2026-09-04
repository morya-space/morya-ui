<script setup lang="ts">
import type { SplitButtonItem, SplitButtonProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { useConfiguredSize, useWdConfig } from '../../shared/config'
import { useWdId } from '../../shared/useWdId'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { resolveIconSizeFromClass } from '../../shared/types'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import { isIconName } from '../Icon/icons'
import WdIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<SplitButtonProps>(), {
  model: () => [],
  disabled: false,
  outlined: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
  (event: 'command', item: SplitButtonItem): void
}>()

const config = useWdConfig()
const locale = useWdLocale()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const menuStyle = ref<Record<string, string>>({})
const menuId = useWdId('wd-splitbutton-menu')
const sizeClass = useConfiguredSize('SplitButton', () => props.size)
const iconSize = computed(() => resolveIconSizeFromClass(sizeClass.value))
const iconName = computed(() => (props.icon && isIconName(props.icon) ? props.icon : undefined))
const iconGlyph = computed(() => (props.icon && !iconName.value ? props.icon : undefined))
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const rootClass = computed(() => [
  'wd-splitbutton',
  `wd-splitbutton--${sizeClass.value}`,
  {
    'wd-splitbutton--disabled': props.disabled,
    'wd-splitbutton--outlined': props.outlined,
    [`wd-splitbutton--${props.severity}`]: Boolean(props.severity),
    'wd-splitbutton--open': open.value,
  },
])

function updateMenuPosition() {
  if (!teleported.value || !root.value) return
  const rect = root.value.getBoundingClientRect()
  menuStyle.value = computeFloatingOverlayStyle(rect, 'bottom-end', {
    gap: 4,
    minWidth: `${rect.width}px`,
  })
}

function onViewportChange() {
  if (open.value) updateMenuPosition()
}

const keyboard = useMenuKeyboard({
  itemCount: () => props.model.length,
  isItemDisabled: (index) => Boolean(props.model[index]?.disabled),
  enabled: open,
  onActivate: (index) => {
    const item = props.model[index]
    if (item) activate(item)
  },
  onEscape: () => {
    open.value = false
  },
  returnFocusTo: trigger,
})

function focusActiveItem() {
  const index = keyboard.activeIndex.value
  if (index < 0) return
  menu.value?.querySelectorAll<HTMLElement>('.wd-splitbutton__item')[index]?.focus({ preventScroll: true })
}

function onMainClick(event: MouseEvent) {
  if (props.disabled) return
  emit('click', event)
}

function openMenu() {
  open.value = true
  void nextTick(() => {
    updateMenuPosition()
    keyboard.moveFirst()
    focusActiveItem()
  })
}

function toggleMenu() {
  if (props.disabled) return
  if (open.value) {
    open.value = false
    return
  }
  openMenu()
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (!open.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu()
    }
    return
  }
  keyboard.onKeydown(event)
}

function activate(item: SplitButtonItem) {
  if (item.disabled || props.disabled) return
  item.command?.()
  emit('command', item)
  open.value = false
  trigger.value?.focus({ preventScroll: true })
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || menu.value?.contains(target)) return
  open.value = false
}

function onDocumentFocusIn(event: FocusEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || menu.value?.contains(target)) return
  open.value = false
}

watch(keyboard.activeIndex, () => {
  if (open.value) focusActiveItem()
})

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('focusin', onDocumentFocusIn)
    void nextTick(() => updateMenuPosition())
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
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('focusin', onDocumentFocusIn)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div ref="root" :class="rootClass">
    <button
      type="button"
      class="wd-splitbutton__main"
      :disabled="disabled"
      @click="onMainClick"
    >
      <slot>
        <span v-if="iconName || iconGlyph" class="wd-splitbutton__icon" aria-hidden="true">
          <WdIcon v-if="iconName" :name="iconName" :size="iconSize" />
          <template v-else>{{ iconGlyph }}</template>
        </span>
        <span v-if="label">{{ label }}</span>
      </slot>
    </button>
    <button
      ref="trigger"
      type="button"
      class="wd-splitbutton__trigger"
      :aria-label="locale.moreActions"
      :aria-expanded="open"
      :aria-controls="open ? menuId : undefined"
      aria-haspopup="menu"
      :disabled="disabled"
      @click="toggleMenu"
      @keydown="onTriggerKeydown"
    >
      <WdIcon name="chevron-down" :size="iconSize" />
    </button>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wd-scale-fade">
        <ul
          v-if="open"
          :id="menuId"
          ref="menu"
          class="wd-splitbutton__menu"
          :class="{ 'wd-splitbutton__menu--teleported': teleported }"
          :style="teleported ? menuStyle : undefined"
          role="menu"
          @keydown="keyboard.onKeydown"
        >
          <li v-for="(item, index) in model" :key="`${item.label}-${index}`" role="presentation">
            <button
              type="button"
              class="wd-splitbutton__item"
              role="menuitem"
              :disabled="item.disabled"
              :tabindex="keyboard.tabindexFor(index)"
              @click="activate(item)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>
