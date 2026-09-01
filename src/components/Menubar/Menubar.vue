<script setup lang="ts">
import type { MenubarItem, MenubarProps } from './types'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { resolveMenuIcon } from '../../shared/menu'
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
  if (!item.items?.length) {
    pick(item)
    openIndex.value = null
    return
  }
  openIndex.value = openIndex.value === index ? null : index
  if (openIndex.value != null) void nextTick(() => updateSubmenuPosition())
}

function activateChild(item: MenubarItem) {
  pick(item)
  openIndex.value = null
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target)) return
  const openSubmenu = document.querySelector('.wi-menubar__submenu--teleported')
  if (openSubmenu?.contains(target)) return
  openIndex.value = null
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
  <nav ref="root" class="wi-menubar" :aria-label="locale.menubar">
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
        :aria-expanded="item.items?.length ? openIndex === index : undefined"
        :aria-haspopup="item.items?.length ? 'menu' : undefined"
        @click.stop="toggle(index, item)"
      >
        <span v-if="iconOf(item) || item.icon" class="wi-menubar__icon" aria-hidden="true">
          <WiIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
          <template v-else>{{ item.icon }}</template>
        </span>
        {{ item.label }}
        <span v-if="item.items?.length" class="wi-menubar__caret" aria-hidden="true">▾</span>
      </button>
      <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
        <Transition name="wi-scale-fade">
          <div
            v-if="item.items?.length && openIndex === index"
            class="wi-menubar__submenu"
            :class="{ 'wi-menubar__submenu--teleported': teleported }"
            :style="teleported ? submenuStyle : undefined"
            role="menu"
          >
            <button
              v-for="(child, childIndex) in item.items"
              :key="`${child.label}-${childIndex}`"
              type="button"
              class="wi-menubar__subitem"
              :class="{ 'wi-menubar__subitem--selected': isSelected(child) }"
              role="menuitem"
              :disabled="child.disabled"
              @click.stop="activateChild(child)"
            >
              <span v-if="iconOf(child) || child.icon" class="wi-menubar__icon" aria-hidden="true">
                <WiIcon v-if="iconOf(child)" :name="iconOf(child)!" size="sm" />
                <template v-else>{{ child.icon }}</template>
              </span>
              {{ child.label }}
            </button>
          </div>
        </Transition>
      </Teleport>
    </div>
  </nav>
</template>
