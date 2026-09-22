<script setup lang="ts">

import type { TieredMenuItem, TieredMenuProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useMConfig } from '../../shared/config'
import FlyoutSubmenu from '../../shared/FlyoutSubmenu.vue'
import { getLastPointer } from '../../shared/lastPointer'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { computeFloatingOverlayStyle } from '../../shared/overlayPlacement'
import { useFloatingViewportSync } from '../../shared/useFloatingViewportSync'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useMotionTransition } from '../../theme/useMotionTransition'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TieredMenuProps>(), {
  transition: undefined,
  popup: false,
  modelValue: false,
  placement: 'bottom-start',
  teleport: true,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)


const config = useMConfig()
const { transitionName, transitionCss } = useMotionTransition({
  role: 'popup',
  local: () => props.transition,
  componentName: 'TieredMenu',
  fallback: 'scale-fade',
})
const root = ref<HTMLElement | null>(null)
const openIndex = ref<number | null>(null)
const submenuAnchor = ref<HTMLElement | null>(null)
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

function resolveSubmenuAnchor(event?: MouseEvent) {
  if (!(event?.currentTarget instanceof HTMLElement)) return null
  const current = event.currentTarget
  return current.classList.contains('m-tieredmenu__item')
    ? current
    : current.querySelector<HTMLElement>('.m-tieredmenu__item')
}

function openSubmenu(index: number, item: TieredMenuItem, event?: MouseEvent) {
  if (item.disabled || !item.items?.length) {
    openIndex.value = null
    submenuAnchor.value = null
    return
  }
  openIndex.value = index
  submenuAnchor.value = resolveSubmenuAnchor(event)
}

function onOutsideClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target)) return
  if (document.querySelector('.m-tieredmenu__submenu--teleported')?.contains(target)) return
  openIndex.value = null
  submenuAnchor.value = null
  if (props.popup && props.modelValue) emit('update:modelValue', false)
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
    if (open) void nextTick(updatePopupPosition)
  },
  { immediate: true },
)

useFloatingViewportSync(
  () => Boolean(props.popup && props.modelValue && teleported.value),
  onViewportChange,
)

onBeforeUnmount(() => {
  document.removeEventListener('click', onOutsideClick)
})
</script>

<template>
  <div
    v-if="!popup"
    ref="root"
    v-bind="rootAttrs"
    class="m-tieredmenu"
    role="menu"
  >
    <MScrollbar
      class="m-tieredmenu__scroll"
      fit-content
      wrap-class="m-tieredmenu__scroll-wrap"
      view-class="m-tieredmenu__scroll-view"
    >
      <div
        v-for="(item, index) in model"
        :key="`${item.label ?? 'sep'}-${index}`"
        class="m-tieredmenu__row"
        @mouseenter="openSubmenu(index, item, $event)"
      >
        <div v-if="item.separator" class="m-tieredmenu__separator" role="separator" />
        <button
          v-else
          type="button"
          class="m-tieredmenu__item"
          role="menuitem"
          :disabled="item.disabled"
          :aria-haspopup="item.items?.length ? 'menu' : undefined"
          :aria-expanded="item.items?.length ? openIndex === index : undefined"
          @click="item.items?.length ? openSubmenu(index, item, $event) : activate(item)"
        >
          <span>{{ item.label }}</span>
          <span v-if="item.items?.length" class="m-tieredmenu__caret" aria-hidden="true">
            <MIcon name="chevron-right" size="sm" />
          </span>
        </button>
        <FlyoutSubmenu
          :open="openIndex === index && Boolean(item.items?.length)"
          :anchor="openIndex === index ? submenuAnchor : null"
          panel-class="m-tieredmenu__submenu"
        >
          <MScrollbar
            class="m-tieredmenu__submenu-scroll"
            fit-content
            wrap-class="m-tieredmenu__submenu-wrap-inner"
            view-class="m-tieredmenu__submenu-view"
          >
            <template v-for="(child, childIndex) in item.items" :key="`${child.label ?? 'sep'}-${childIndex}`">
              <div v-if="child.separator" class="m-tieredmenu__separator" role="separator" />
              <button
                v-else
                type="button"
                class="m-tieredmenu__item"
                role="menuitem"
                :disabled="child.disabled"
                @click="activateChild(child)"
              >
                {{ child.label }}
              </button>
            </template>
          </MScrollbar>
        </FlyoutSubmenu>
      </div>
    </MScrollbar>
  </div>
  <Teleport v-else :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition :name="transitionName" :css="transitionCss">
      <div
        v-if="modelValue"
        ref="root"
        v-bind="rootAttrs"
        class="m-tieredmenu m-tieredmenu--popup"
        :class="{ 'm-tieredmenu--teleported': teleported }"
        :style="teleported ? popupStyle : undefined"
        role="menu"
      >
        <MScrollbar
          class="m-tieredmenu__scroll"
          fit-content
          wrap-class="m-tieredmenu__scroll-wrap"
          view-class="m-tieredmenu__scroll-view"
        >
          <div
            v-for="(item, index) in model"
            :key="`${item.label ?? 'sep'}-${index}`"
            class="m-tieredmenu__row"
            @mouseenter="openSubmenu(index, item, $event)"
          >
            <div v-if="item.separator" class="m-tieredmenu__separator" role="separator" />
            <button
              v-else
              type="button"
              class="m-tieredmenu__item"
              role="menuitem"
              :disabled="item.disabled"
              :aria-haspopup="item.items?.length ? 'menu' : undefined"
              :aria-expanded="item.items?.length ? openIndex === index : undefined"
              @click="item.items?.length ? openSubmenu(index, item, $event) : activate(item)"
            >
              <span>{{ item.label }}</span>
              <span v-if="item.items?.length" class="m-tieredmenu__caret" aria-hidden="true">
                <MIcon name="chevron-right" size="sm" />
              </span>
            </button>
            <FlyoutSubmenu
              :open="openIndex === index && Boolean(item.items?.length)"
              :anchor="openIndex === index ? submenuAnchor : null"
              panel-class="m-tieredmenu__submenu"
            >
              <MScrollbar
                class="m-tieredmenu__submenu-scroll"
                fit-content
                wrap-class="m-tieredmenu__submenu-wrap-inner"
                view-class="m-tieredmenu__submenu-view"
              >
                <template v-for="(child, childIndex) in item.items" :key="`${child.label ?? 'sep'}-${childIndex}`">
                  <div v-if="child.separator" class="m-tieredmenu__separator" role="separator" />
                  <button
                    v-else
                    type="button"
                    class="m-tieredmenu__item"
                    role="menuitem"
                    :disabled="child.disabled"
                    @click="activateChild(child)"
                  >
                    {{ child.label }}
                  </button>
                </template>
              </MScrollbar>
            </FlyoutSubmenu>
          </div>
        </MScrollbar>
      </div>
    </Transition>
  </Teleport>
</template>
