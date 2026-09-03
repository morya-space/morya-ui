<script setup lang="ts">
import type { MenubarItem, MenubarProps } from './types'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { resolveMenuIcon } from '../../shared/menu'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<MenubarProps>(), {
  selectedKey: null,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:selectedKey', value: string | null): void
  (event: 'select', item: MenubarItem): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const openIndex = ref<number | null>(null)
const root = ref<HTMLElement | null>(null)
const triggerEls = ref<(HTMLElement | null)[]>([])
const submenuStyle = ref<Record<string, string>>({})
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

function setTriggerRef(el: unknown, index: number) {
  triggerEls.value[index] = el instanceof HTMLElement ? el : null
}

function updateSubmenuPosition() {
  if (!teleported.value || openIndex.value == null) return
  const trigger = triggerEls.value[openIndex.value]
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  submenuStyle.value = computeFloatingOverlayStyle(rect, 'bottom-start', { gap: 4 })
}

function itemKey(item: MenubarItem) {
  return item.key ?? item.label
}

function isSelected(item: MenubarItem) {
  return Boolean(props.selectedKey && itemKey(item) === props.selectedKey)
}

function iconOf(item: MenubarItem) {
  return resolveMenuIcon(item.icon)
}

function pick(item: MenubarItem) {
  if (item.disabled) return
  item.command?.()
  emit('update:selectedKey', itemKey(item))
  emit('select', item)
}

function toggle(index: number, item: MenubarItem) {
  if (item.disabled) return
  topKeyboard.setActive(index)
  if (!item.items?.length) {
    pick(item)
    openIndex.value = null
    return
  }
  openIndex.value = openIndex.value === index ? null : index
  if (openIndex.value != null) void nextTick(() => updateSubmenuPosition())
}

const openItems = computed<MenubarItem[]>(() =>
  openIndex.value != null ? (props.model[openIndex.value]?.items ?? []) : [],
)

const topKeyboard = useMenuKeyboard({
  itemCount: () => props.model.length,
  isItemDisabled: (index) => Boolean(props.model[index]?.disabled),
  orientation: 'horizontal',
  initialActiveIndex: 0,
  onActivate: (index) => {
    const item = props.model[index]
    if (item) toggle(index, item)
  },
})

const subKeyboard = useMenuKeyboard({
  itemCount: () => openItems.value.length,
  isItemDisabled: (index) => Boolean(openItems.value[index]?.disabled),
  enabled: () => openIndex.value != null,
  onActivate: (index) => {
    const item = openItems.value[index]
    if (item) activateChild(item)
  },
})

function focusTop(index: number) {
  triggerEls.value[index]?.focus({ preventScroll: true })
}

function openSubmenuEl(): HTMLElement | null {
  const local = root.value?.querySelector<HTMLElement>('.wi-menubar__submenu')
  if (local) return local
  return document.querySelector<HTMLElement>('.wi-menubar__submenu--teleported')
}

function focusActiveSubitem() {
  const index = subKeyboard.activeIndex.value
  if (index < 0) return
  openSubmenuEl()
    ?.querySelectorAll<HTMLElement>('.wi-menubar__subitem')
    [index]?.focus({ preventScroll: true })
}

function closeSubmenu(restoreFocus = false) {
  const index = openIndex.value
  openIndex.value = null
  subKeyboard.reset()
  if (restoreFocus && index != null) focusTop(index)
}

function openSubmenu(index: number, focusFirst = false) {
  openIndex.value = index
  topKeyboard.setActive(index)
  void nextTick(() => {
    updateSubmenuPosition()
    if (focusFirst) {
      subKeyboard.moveFirst()
      focusActiveSubitem()
    }
  })
}

function moveTopLevel(delta: 1 | -1) {
  topKeyboard.move(delta)
  const index = topKeyboard.activeIndex.value
  const item = props.model[index]
  if (openIndex.value != null) {
    if (item?.items?.length) openSubmenu(index, true)
    else closeSubmenu()
  }
  focusTop(index)
}

function onTopKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (openIndex.value != null) {
      event.preventDefault()
      closeSubmenu(true)
    }
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const index = topKeyboard.activeIndex.value
    const item = props.model[index]
    if (item?.items?.length && !item.disabled) openSubmenu(index, true)
    return
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    moveTopLevel(event.key === 'ArrowRight' ? 1 : -1)
    return
  }
  topKeyboard.onKeydown(event)
}

function onSubmenuKeydown(event: KeyboardEvent) {
  // Keep the event from bubbling to the top-level nav handler.
  event.stopPropagation()
  if (event.key === 'Escape') {
    event.preventDefault()
    closeSubmenu(true)
    return
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    moveTopLevel(event.key === 'ArrowRight' ? 1 : -1)
    return
  }
  subKeyboard.onKeydown(event)
}

function activateChild(item: MenubarItem) {
  pick(item)
  closeSubmenu(true)
}

watch(topKeyboard.activeIndex, (index) => {
  if (index >= 0 && openIndex.value == null) focusTop(index)
})

watch(subKeyboard.activeIndex, () => {
  if (openIndex.value != null) focusActiveSubitem()
})

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target)) return
  const openSubmenu = document.querySelector('.wi-menubar__submenu--teleported')
  if (openSubmenu?.contains(target)) return
  closeSubmenu()
}

function onViewportChange() {
  if (openIndex.value != null) updateSubmenuPosition()
}

watch(openIndex, (index) => {
  if (index != null && teleported.value) {
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true)
  } else {
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <nav ref="root" class="wi-menubar" :aria-label="locale.menubar" @keydown="onTopKeydown">
    <div
      v-for="(item, index) in model"
      :key="`${item.label}-${index}`"
      class="wi-menubar__item"
      :class="{ 'wi-menubar__item--open': openIndex === index, 'wi-menubar__item--selected': isSelected(item) }"
    >
      <button
        :ref="(el) => setTriggerRef(el, index)"
        type="button"
        class="wi-menubar__trigger"
        :class="{ 'wi-menubar__trigger--selected': isSelected(item) }"
        :disabled="item.disabled"
        :tabindex="topKeyboard.tabindexFor(index)"
        :aria-expanded="item.items?.length ? openIndex === index : undefined"
        :aria-haspopup="item.items?.length ? 'menu' : undefined"
        @click.stop="toggle(index, item)"
        @focus="topKeyboard.setActive(index)"
      >
        <span v-if="iconOf(item)" class="wi-menubar__icon" aria-hidden="true">
          <WiIcon :name="iconOf(item)!" size="sm" />
        </span>
        {{ item.label }}
        <span v-if="item.items?.length" class="wi-menubar__caret" aria-hidden="true">
          <WiIcon name="chevron-down" size="sm" />
        </span>
      </button>
      <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
        <Transition name="wi-scale-fade">
          <div
            v-if="item.items?.length && openIndex === index"
            class="wi-menubar__submenu"
            :class="{ 'wi-menubar__submenu--teleported': teleported }"
            :style="teleported ? submenuStyle : undefined"
            role="menu"
            @keydown="onSubmenuKeydown"
          >
            <button
              v-for="(child, childIndex) in item.items"
              :key="`${child.label}-${childIndex}`"
              type="button"
              class="wi-menubar__subitem"
              :class="{ 'wi-menubar__subitem--selected': isSelected(child) }"
              role="menuitem"
              :disabled="child.disabled"
              :tabindex="subKeyboard.tabindexFor(childIndex)"
              @click.stop="activateChild(child)"
            >
              <span v-if="iconOf(child)" class="wi-menubar__icon" aria-hidden="true">
                <WiIcon :name="iconOf(child)!" size="sm" />
              </span>
              {{ child.label }}
            </button>
          </div>
        </Transition>
      </Teleport>
    </div>
  </nav>
</template>
