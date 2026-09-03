<script setup lang="ts">
import type { MenuItem } from './types'
import { computed, inject } from 'vue'
import WiIcon from '../Icon/Icon.vue'
import WiPopover from '../Popover/Popover.vue'
import { resolveMenuIcon } from '../../shared/menu'
import { WI_MENU_KEY } from './context'
import MenuNodes from './MenuNodes.vue'

const props = defineProps<{
  items: MenuItem[]
  depth: number
  prefix: string
  /** Render nested menu inside collapsed flyout (always expanded layout). */
  flyout?: boolean
}>()

const menu = inject(WI_MENU_KEY)
if (!menu) {
  throw new Error('MenuNodes must be used inside WiMenu')
}

const ctx = menu

const collapsed = computed(() => ctx.collapsed.value && !props.flyout)
const horizontal = computed(() => ctx.mode === 'horizontal')
const useFlyout = computed(() => (collapsed.value || horizontal.value) && !props.flyout)

function setFlyoutOpen(key: string, open: boolean) {
  ctx.setFlyoutOpen(key, open)
}

function itemKey(item: MenuItem, index: number) {
  return ctx.resolveKey(item, index, props.prefix)
}

function iconOf(item: MenuItem) {
  return resolveMenuIcon(item.icon)
}

function onLeafClick(item: MenuItem) {
  ctx.activate(item)
}

function onParentClick(item: MenuItem, index: number) {
  if (item.disabled) return
  if (useFlyout.value) return
  ctx.toggleExpand(itemKey(item, index))
}

function isSubmenuExpanded(item: MenuItem, index: number) {
  return ctx.isExpanded(itemKey(item, index))
}

function contentClass(item: MenuItem, index: number) {
  const icon = iconOf(item)
  return {
    'wi-menu__item-content--selected': ctx.isSelected(item, index, props.prefix),
    'wi-menu__item-content--child-active': ctx.isChildActive(item, index, props.prefix),
    'wi-menu__item-content--disabled': Boolean(item.disabled),
    'wi-menu__item-content--collapsed': collapsed.value,
    'wi-menu__item-content--no-icon': !icon,
    'wi-menu__item-content--active': ctx.activeKey.value === itemKey(item, index),
  }
}

function itemTabindex(item: MenuItem, index: number) {
  // Flyout panels keep natural tab order; roving tabindex applies to the main tree only.
  if (props.flyout) return 0
  return ctx.tabindexForKey(itemKey(item, index))
}

function paddingStyle(depth: number) {
  if (horizontal.value || props.flyout) return undefined
  return { paddingLeft: `${ctx.paddingLeft(depth)}px` }
}

function arrowIcon(item: MenuItem, index: number) {
  return isSubmenuExpanded(item, index) ? 'chevron-down' : 'chevron-right'
}
</script>

<template>
  <template v-for="(item, index) in items" :key="itemKey(item, index)">
    <div v-if="item.separator" class="wi-menu__separator" role="separator" />

    <div
      v-else-if="item.items?.length"
      class="wi-menu__item wi-menu__item--submenu"
      :class="{ 'wi-menu__item--horizontal': horizontal }"
      role="none"
    >
      <WiPopover
        v-if="useFlyout"
        class="wi-menu__collapsed-popover"
        :model-value="Boolean(ctx.flyoutOpen[itemKey(item, index)])"
        :trigger="horizontal ? 'click' : 'hover'"
        :placement="horizontal ? 'bottom-start' : 'right-start'"
        :show-delay="horizontal ? 0 : 50"
        :hide-delay="horizontal ? 0 : 80"
        @update:model-value="setFlyoutOpen(itemKey(item, index), $event)"
      >
        <template #default>
          <div
            class="wi-menu__item-content"
            :class="contentClass(item, index)"
            :style="paddingStyle(depth)"
            role="menuitem"
            :tabindex="itemTabindex(item, index)"
            :data-wi-menu-key="flyout ? undefined : itemKey(item, index)"
            :aria-label="item.label"
            aria-haspopup="menu"
            :aria-expanded="horizontal ? Boolean(ctx.flyoutOpen[itemKey(item, index)]) : undefined"
            :title="collapsed ? item.label : undefined"
          >
            <span v-if="iconOf(item)" class="wi-menu__icon" aria-hidden="true">
              <WiIcon :name="iconOf(item)!" size="sm" />
            </span>
            <span class="wi-menu__label">{{ item.label }}</span>
            <span v-if="horizontal" class="wi-menu__arrow" aria-hidden="true">
              <WiIcon name="chevron-down" size="sm" />
            </span>
          </div>
        </template>
        <template #content>
          <div class="wi-menu wi-menu--flyout" role="menu">
            <MenuNodes
              :items="item.items"
              :depth="0"
              :prefix="`${prefix}-${index}`"
              flyout
            />
          </div>
        </template>
      </WiPopover>

      <template v-else>
        <div
          class="wi-menu__item-content"
          :class="contentClass(item, index)"
          :style="paddingStyle(depth)"
          role="menuitem"
          :tabindex="itemTabindex(item, index)"
          :data-wi-menu-key="flyout ? undefined : itemKey(item, index)"
          aria-haspopup="menu"
          :aria-expanded="isSubmenuExpanded(item, index)"
          :aria-disabled="item.disabled || undefined"
          @click="onParentClick(item, index)"
        >
          <span v-if="iconOf(item)" class="wi-menu__icon" aria-hidden="true">
            <WiIcon :name="iconOf(item)!" size="sm" />
          </span>
          <span class="wi-menu__label">{{ item.label }}</span>
          <span class="wi-menu__arrow" aria-hidden="true">
            <WiIcon :name="arrowIcon(item, index)" size="sm" />
          </span>
        </div>

        <Transition name="wi-menu-expand">
          <div
            v-if="isSubmenuExpanded(item, index)"
            class="wi-menu__submenu"
            role="group"
          >
            <MenuNodes
              :items="item.items"
              :depth="depth + 1"
              :prefix="`${prefix}-${index}`"
            />
          </div>
        </Transition>
      </template>
    </div>

    <div
      v-else
      class="wi-menu__item"
      :class="{ 'wi-menu__item--horizontal': horizontal }"
      role="none"
    >
      <div
        class="wi-menu__item-content"
        :class="contentClass(item, index)"
        :style="paddingStyle(depth)"
        role="menuitem"
        :tabindex="itemTabindex(item, index)"
        :data-wi-menu-key="flyout ? undefined : itemKey(item, index)"
        :aria-disabled="item.disabled || undefined"
        :aria-current="ctx.isSelected(item, index, prefix) ? 'page' : undefined"
        :title="collapsed ? item.label : undefined"
        @click="onLeafClick(item)"
      >
        <span v-if="iconOf(item)" class="wi-menu__icon" aria-hidden="true">
          <WiIcon :name="iconOf(item)!" size="sm" />
        </span>
        <span class="wi-menu__label">{{ item.label }}</span>
      </div>
    </div>
  </template>
</template>
