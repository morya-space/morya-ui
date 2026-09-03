<script setup lang="ts">
import type { TieredMenuItem, TieredMenuProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiConfig } from '../../shared/config'
import { getLastPointer } from '../../shared/lastPointer'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<TieredMenuProps>(), {
  popup: false,
  modelValue: false,
  placement: 'bottom-start',
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const config = useWiConfig()
const root = ref<HTMLElement | null>(null)
const openIndex = ref<number | null>(null)
const popupStyle = ref<Record<string, string>>({})
const teleportTarget = computed(() =>
  resolveOverlayTeleport(props.popup ? props : { teleport: false }, config.value.appendTo),
)
const teleported = computed(() => props.popup && isOverlayTeleported(props, config.value.appendTo))

function resolvePopupAnchor(): DOMRect {
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
  popupStyle.value = computeFloatingOverlayStyle(resolvePopupAnchor(), props.placement, {
    minWidth: '12rem',
  })
}

function onViewportChange() {
  if (props.modelValue) updatePopupPosition()
}

function activate(item: TieredMenuItem) {
  if (item.disabled || item.separator) return
  if (item.items?.length) return
  item.command?.()
  openIndex.value = null
  if (props.popup) emit('update:modelValue', false)
}

function activateChild(item: TieredMenuItem) {
  if (item.disabled || item.separator) return
  item.command?.()
  openIndex.value = null
  if (props.popup) emit('update:modelValue', false)
}

function openSubmenu(index: number, item: TieredMenuItem) {
  if (item.disabled || !item.items?.length) {
    openIndex.value = null
    return
  }
  openIndex.value = index
}

function onOutsideClick(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) {
    openIndex.value = null
    if (props.popup && props.modelValue) emit('update:modelValue', false)
  }
}

watch(
  () => Boolean(props.popup ? props.modelValue : true),
  (listening) => {
    if (listening) document.addEventListener('click', onOutsideClick)
    else document.removeEventListener('click', onOutsideClick)
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (open) => {
    if (!props.popup) return
    if (open) {
      void nextTick(updatePopupPosition)
      if (teleported.value) {
        window.addEventListener('resize', onViewportChange)
        window.addEventListener('scroll', onViewportChange, true)
      }
    } else {
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
</script>

<template>
  <div
    v-if="!popup"
    ref="root"
    class="wi-tieredmenu"
    role="menu"
  >
    <div
      v-for="(item, index) in model"
      :key="`${item.label ?? 'sep'}-${index}`"
      class="wi-tieredmenu__row"
      @mouseenter="openSubmenu(index, item)"
    >
      <div v-if="item.separator" class="wi-tieredmenu__separator" role="separator" />
      <button
        v-else
        type="button"
        class="wi-tieredmenu__item"
        role="menuitem"
        :disabled="item.disabled"
        :aria-haspopup="item.items?.length ? 'menu' : undefined"
        :aria-expanded="item.items?.length ? openIndex === index : undefined"
        @click="item.items?.length ? openSubmenu(index, item) : activate(item)"
      >
        <span>{{ item.label }}</span>
        <span v-if="item.items?.length" class="wi-tieredmenu__caret" aria-hidden="true">
          <WiIcon name="chevron-right" size="sm" />
        </span>
      </button>
      <div
        v-if="item.items?.length && openIndex === index"
        class="wi-tieredmenu__submenu"
        role="menu"
      >
        <template v-for="(child, childIndex) in item.items" :key="`${child.label ?? 'sep'}-${childIndex}`">
          <div v-if="child.separator" class="wi-tieredmenu__separator" role="separator" />
          <button
            v-else
            type="button"
            class="wi-tieredmenu__item"
            role="menuitem"
            :disabled="child.disabled"
            @click="activateChild(child)"
          >
            {{ child.label }}
          </button>
        </template>
      </div>
    </div>
  </div>
  <Teleport v-else :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition name="wi-scale-fade">
      <div
        v-if="modelValue"
        ref="root"
        class="wi-tieredmenu wi-tieredmenu--popup"
        :class="{ 'wi-tieredmenu--teleported': teleported }"
        :style="teleported ? popupStyle : undefined"
        role="menu"
      >
        <div
          v-for="(item, index) in model"
          :key="`${item.label ?? 'sep'}-${index}`"
          class="wi-tieredmenu__row"
          @mouseenter="openSubmenu(index, item)"
        >
          <div v-if="item.separator" class="wi-tieredmenu__separator" role="separator" />
          <button
            v-else
            type="button"
            class="wi-tieredmenu__item"
            role="menuitem"
            :disabled="item.disabled"
            :aria-haspopup="item.items?.length ? 'menu' : undefined"
            :aria-expanded="item.items?.length ? openIndex === index : undefined"
            @click="item.items?.length ? openSubmenu(index, item) : activate(item)"
          >
            <span>{{ item.label }}</span>
            <span v-if="item.items?.length" class="wi-tieredmenu__caret" aria-hidden="true">
              <WiIcon name="chevron-right" size="sm" />
            </span>
          </button>
          <div
            v-if="item.items?.length && openIndex === index"
            class="wi-tieredmenu__submenu"
            role="menu"
          >
            <template v-for="(child, childIndex) in item.items" :key="`${child.label ?? 'sep'}-${childIndex}`">
              <div v-if="child.separator" class="wi-tieredmenu__separator" role="separator" />
              <button
                v-else
                type="button"
                class="wi-tieredmenu__item"
                role="menuitem"
                :disabled="child.disabled"
                @click="activateChild(child)"
              >
                {{ child.label }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
