<script setup lang="ts">
import type { MegaMenuItem, MegaMenuProps } from './types'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'

const props = withDefaults(defineProps<MegaMenuProps>(), {
  model: () => [],
  teleport: true,
})

const config = useWiConfig()
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

function toggle(index: number, item: MegaMenuItem) {
  if (item.disabled) return
  if (!item.items?.length) {
    item.command?.()
    openIndex.value = null
    return
  }
  openIndex.value = openIndex.value === index ? null : index
  if (openIndex.value != null) void nextTick(() => updatePanelPosition())
}

function activateChild(item: MegaMenuItem) {
  if (item.disabled) return
  item.command?.()
  openIndex.value = null
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target)) return
  const panel = document.querySelector('.wi-megamenu__panel--teleported')
  if (panel?.contains(target)) return
  openIndex.value = null
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
  <nav ref="root" class="wi-megamenu" aria-label="Mega menu">
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
        :disabled="item.disabled"
        :aria-expanded="item.items?.length ? openIndex === index : undefined"
        :aria-haspopup="item.items?.length ? 'true' : undefined"
        @click.stop="toggle(index, item)"
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
                role="menuitem"
                :disabled="child.disabled"
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
