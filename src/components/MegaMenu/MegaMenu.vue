<script setup lang="ts">
import type { MegaMenuItem, MegaMenuProps } from './types'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useMenuKeyboard } from '../../shared/useMenuKeyboard'

const props = withDefaults(defineProps<MegaMenuProps>(), {
  model: () => [],
  selectedKey: null,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:selectedKey', value: string | null): void
  (event: 'select', item: MegaMenuItem): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const openIndex = ref<number | null>(null)
const root = ref<HTMLElement | null>(null)
const triggerEls = ref<(HTMLElement | null)[]>([])
const panelStyle = ref<Record<string, string>>({})
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

function setTriggerRef(el: unknown, index: number) {
  triggerEls.value[index] = el instanceof HTMLElement ? el : null
}

function updatePanelPosition() {
  if (!teleported.value || openIndex.value == null) return
  const trigger = triggerEls.value[openIndex.value]
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  panelStyle.value = computeFloatingOverlayStyle(rect, 'bottom-start', { gap: 4 })
}

function itemKey(item: MegaMenuItem) {
  return item.key ?? item.label
}

function isSelected(item: MegaMenuItem) {
  return Boolean(props.selectedKey && itemKey(item) === props.selectedKey)
}

function pick(item: MegaMenuItem) {
  if (item.disabled) return
  item.command?.()
  emit('update:selectedKey', itemKey(item))
  emit('select', item)
}

function toggle(index: number, item: MegaMenuItem) {
  if (item.disabled) return
  topKeyboard.setActive(index)
  if (!item.items?.length) {
    pick(item)
    closePanel()
    return
  }
  openIndex.value = openIndex.value === index ? null : index
  if (openIndex.value != null) void nextTick(() => updatePanelPosition())
}

const openLinks = computed<MegaMenuItem[]>(() =>
  openIndex.value != null ? (props.model[openIndex.value]?.items ?? []).flat() : [],
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

const panelKeyboard = useMenuKeyboard({
  itemCount: () => openLinks.value.length,
  isItemDisabled: (index) => Boolean(openLinks.value[index]?.disabled),
  enabled: () => openIndex.value != null,
  onActivate: (index) => {
    const item = openLinks.value[index]
    if (item) activateChild(item)
  },
})

function focusTop(index: number) {
  triggerEls.value[index]?.focus({ preventScroll: true })
}

function openPanelEl(): HTMLElement | null {
  const local = root.value?.querySelector<HTMLElement>('.wi-megamenu__panel')
  if (local) return local
  return document.querySelector<HTMLElement>('.wi-megamenu__panel--teleported')
}

function focusActiveLink() {
  const index = panelKeyboard.activeIndex.value
  if (index < 0) return
  openPanelEl()
    ?.querySelectorAll<HTMLElement>('.wi-megamenu__link')
    [index]?.focus({ preventScroll: true })
}

function panelLinkTabindex(columnIndex: number, childIndex: number) {
  const columns = openIndex.value != null ? (props.model[openIndex.value]?.items ?? []) : []
  let flatIndex = childIndex
  for (let i = 0; i < columnIndex; i++) flatIndex += columns[i]?.length ?? 0
  return panelKeyboard.tabindexFor(flatIndex)
}

function closePanel(restoreFocus = false) {
  const index = openIndex.value
  openIndex.value = null
  panelKeyboard.reset()
  if (restoreFocus && index != null) focusTop(index)
}

function openPanel(index: number, focusFirst = false) {
  openIndex.value = index
  topKeyboard.setActive(index)
  void nextTick(() => {
    updatePanelPosition()
    if (focusFirst) {
      panelKeyboard.moveFirst()
      focusActiveLink()
    }
  })
}

function moveTopLevel(delta: 1 | -1) {
  topKeyboard.move(delta)
  const index = topKeyboard.activeIndex.value
  const item = props.model[index]
  if (openIndex.value != null) {
    if (item?.items?.length) openPanel(index, true)
    else closePanel()
  }
  focusTop(index)
}

function onTopKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (openIndex.value != null) {
      event.preventDefault()
      closePanel(true)
    }
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const index = topKeyboard.activeIndex.value
    const item = props.model[index]
    if (item?.items?.length && !item.disabled) openPanel(index, true)
    return
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    moveTopLevel(event.key === 'ArrowRight' ? 1 : -1)
    return
  }
  topKeyboard.onKeydown(event)
}

function onPanelKeydown(event: KeyboardEvent) {
  // Keep the event from bubbling to the top-level nav handler.
  event.stopPropagation()
  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel(true)
    return
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    moveTopLevel(event.key === 'ArrowRight' ? 1 : -1)
    return
  }
  panelKeyboard.onKeydown(event)
}

function activateChild(item: MegaMenuItem) {
  if (item.disabled) return
  pick(item)
  closePanel(true)
}

watch(topKeyboard.activeIndex, (index) => {
  if (index >= 0 && openIndex.value == null) focusTop(index)
})

watch(panelKeyboard.activeIndex, () => {
  if (openIndex.value != null) focusActiveLink()
})

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target)) return
  const panel = document.querySelector('.wi-megamenu__panel--teleported')
  if (panel?.contains(target)) return
  closePanel()
}

function onViewportChange() {
  if (openIndex.value != null) updatePanelPosition()
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
  <nav ref="root" class="wi-megamenu" :aria-label="locale.megaMenu" @keydown="onTopKeydown">
    <div
      v-for="(item, index) in model"
      :key="`${item.label}-${index}`"
      class="wi-megamenu__item"
      :class="{ 'wi-megamenu__item--open': openIndex === index }"
    >
      <button
        :ref="(el) => setTriggerRef(el, index)"
        type="button"
        class="wi-megamenu__trigger"
        :class="{ 'wi-megamenu__trigger--selected': isSelected(item) }"
        :disabled="item.disabled"
        :tabindex="topKeyboard.tabindexFor(index)"
        :aria-expanded="item.items?.length ? openIndex === index : undefined"
        :aria-haspopup="item.items?.length ? 'menu' : undefined"
        @click.stop="toggle(index, item)"
        @focus="topKeyboard.setActive(index)"
      >
        <span v-if="item.icon" aria-hidden="true">{{ item.icon }}</span>
        {{ item.label }}
      </button>
      <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
        <Transition name="wi-scale-fade">
          <div
            v-if="item.items?.length && openIndex === index"
            class="wi-megamenu__panel"
            :class="{ 'wi-megamenu__panel--teleported': teleported }"
            :style="teleported ? panelStyle : undefined"
            role="menu"
            @keydown="onPanelKeydown"
          >
            <div
              v-for="(column, columnIndex) in item.items"
              :key="columnIndex"
              class="wi-megamenu__column"
            >
              <button
                v-for="(child, childIndex) in column"
                :key="`${child.label}-${childIndex}`"
                type="button"
                class="wi-megamenu__link"
                :class="{ 'wi-megamenu__link--selected': isSelected(child) }"
                role="menuitem"
                :disabled="child.disabled"
                :tabindex="panelLinkTabindex(columnIndex, childIndex)"
                @click.stop="activateChild(child)"
              >
                {{ child.label }}
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </nav>
</template>
