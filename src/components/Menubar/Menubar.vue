<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import type { MenubarItem, MenubarProps } from './types'

const props = withDefaults(defineProps<MenubarProps>(), {
  teleport: true,
})

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
  submenuStyle.value = {
    left: `${rect.left}px`,
    top: `${rect.bottom + 4}px`,
  }
}

function toggle(index: number, item: MenubarItem) {
  if (item.disabled) return
  if (!item.items?.length) {
    item.command?.()
    openIndex.value = null
    return
  }
  openIndex.value = openIndex.value === index ? null : index
  if (openIndex.value != null) void nextTick(() => updateSubmenuPosition())
}

function activateChild(item: MenubarItem) {
  if (item.disabled) return
  item.command?.()
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
      :class="{ 'wi-menubar__item--open': openIndex === index }"
    >
      <button
        :ref="(el) => setTriggerRef(el, index)"
        type="button"
        class="wi-menubar__trigger"
        :disabled="item.disabled"
        :aria-expanded="item.items?.length ? openIndex === index : undefined"
        :aria-haspopup="item.items?.length ? 'menu' : undefined"
        @click.stop="toggle(index, item)"
      >
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
              role="menuitem"
              :disabled="child.disabled"
              @click.stop="activateChild(child)"
            >
              {{ child.label }}
            </button>
          </div>
        </Transition>
      </Teleport>
    </div>
  </nav>
</template>
