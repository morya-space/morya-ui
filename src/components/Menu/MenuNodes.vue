<script setup lang="ts">
import type { MenuItem } from './types'
import type { MRouteLocationRaw } from '../../shared/optionalRouter'
import { computed, inject } from 'vue'
import MIcon from '../Icon/Icon.vue'
import MPopover from '../Popover/Popover.vue'
import { resolveMenuIcon } from '../../shared/menu'
import { isExternalRoute, resolveOptionalRouterLink, resolveRouteHref } from '../../shared/optionalRouter'
import { M_MENU_KEY } from './context'
import MenuNodes from './MenuNodes.vue'

const props = defineProps<{
  items: MenuItem[]
  depth: number
  prefix: string
  /** Render nested menu inside collapsed flyout (always expanded layout). */
  flyout?: boolean
}>()

const menu = inject(M_MENU_KEY)
if (!menu) {
  throw new Error('MenuNodes must be used inside MMenu')
}

const ctx = menu
const RouterLink = resolveOptionalRouterLink()

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

function onLeafClick(item: MenuItem, event: MouseEvent) {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  ctx.activate(item)
  if (!item.to) event.preventDefault()
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
    'm-menu__item-content--selected': ctx.isSelected(item, index, props.prefix),
    'm-menu__item-content--child-active': ctx.isChildActive(item, index, props.prefix),
    'm-menu__item-content--disabled': Boolean(item.disabled),
    'm-menu__item-content--collapsed': collapsed.value,
    'm-menu__item-content--no-icon': !icon,
    'm-menu__item-content--active': ctx.activeKey.value === itemKey(item, index),
  }
}

function itemTabindex(item: MenuItem, index: number) {
  if (props.flyout) return 0
  return ctx.tabindexForKey(itemKey(item, index))
}

function paddingStyle(depth: number) {
  if (horizontal.value || props.flyout) return undefined
  return ctx.paddingStyle(depth)
}

function arrowIcon(item: MenuItem, index: number) {
  return isSubmenuExpanded(item, index) ? 'chevron-down' : 'chevron-right'
}

function usesRouterLink(item: MenuItem) {
  return Boolean(item.to && RouterLink && !isExternalRoute(item.to))
}

function leafHref(item: MenuItem) {
  if (!item.to || usesRouterLink(item)) return undefined
  return resolveRouteHref(item.to)
}

function leafLinkTo(item: MenuItem): MRouteLocationRaw | undefined {
  if (!usesRouterLink(item) || !item.to) return undefined
  return item.to
}
</script>

<template>
  <template v-for="(item, index) in items" :key="itemKey(item, index)">
    <div v-if="item.separator" class="m-menu__separator" role="separator" />

    <div
      v-else-if="item.items?.length"
      class="m-menu__item wk-menu__item--submenu"
      :class="{ 'm-menu__item--horizontal': horizontal }"
      role="none"
    >
      <MPopover
        v-if="useFlyout"
        class="m-menu__collapsed-popover"
        :model-value="Boolean(ctx.flyoutOpen[itemKey(item, index)])"
        :trigger="horizontal ? 'click' : 'hover'"
        :placement="horizontal ? 'bottom-start' : 'right-start'"
        :show-delay="horizontal ? 0 : 50"
        :hide-delay="horizontal ? 0 : 80"
        @update:model-value="setFlyoutOpen(itemKey(item, index), $event)"
      >
        <template #default>
          <div
            class="m-menu__item-content"
            :class="contentClass(item, index)"
            :style="paddingStyle(depth)"
            role="menuitem"
            :tabindex="itemTabindex(item, index)"
            :data-m-menu-key="flyout ? undefined : itemKey(item, index)"
            :aria-label="item.label"
            aria-haspopup="menu"
            :aria-expanded="horizontal ? Boolean(ctx.flyoutOpen[itemKey(item, index)]) : undefined"
            :title="collapsed ? item.label : undefined"
          >
            <span v-if="iconOf(item)" class="m-menu__icon" aria-hidden="true">
              <MIcon :name="iconOf(item)!" size="sm" />
            </span>
            <span class="m-menu__label">{{ item.label }}</span>
            <span v-if="horizontal" class="m-menu__arrow" aria-hidden="true">
              <MIcon name="chevron-down" size="sm" />
            </span>
          </div>
        </template>
        <template #content>
          <div class="m-menu wk-menu--flyout" role="menu">
            <MenuNodes
              :items="item.items"
              :depth="0"
              :prefix="`${prefix}-${index}`"
              flyout
            />
          </div>
        </template>
      </MPopover>

      <template v-else>
        <div
          class="m-menu__item-content"
          :class="contentClass(item, index)"
          :style="paddingStyle(depth)"
          role="menuitem"
          :tabindex="itemTabindex(item, index)"
          :data-m-menu-key="flyout ? undefined : itemKey(item, index)"
          aria-haspopup="menu"
          :aria-expanded="isSubmenuExpanded(item, index)"
          :aria-disabled="item.disabled || undefined"
          @click="onParentClick(item, index)"
        >
          <span v-if="iconOf(item)" class="m-menu__icon" aria-hidden="true">
            <MIcon :name="iconOf(item)!" size="sm" />
          </span>
          <span class="m-menu__label">{{ item.label }}</span>
          <span class="m-menu__arrow" aria-hidden="true">
            <MIcon :name="arrowIcon(item, index)" size="sm" />
          </span>
        </div>

        <Transition name="m-menu-expand">
          <div
            v-if="isSubmenuExpanded(item, index)"
            class="m-menu__submenu"
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
      class="m-menu__item"
      :class="{ 'm-menu__item--horizontal': horizontal }"
      role="none"
    >
      <component
        :is="usesRouterLink(item) ? RouterLink : leafHref(item) ? 'a' : 'div'"
        class="m-menu__item-content"
        :class="contentClass(item, index)"
        :style="paddingStyle(depth)"
        role="menuitem"
        :tabindex="itemTabindex(item, index)"
        :data-m-menu-key="flyout ? undefined : itemKey(item, index)"
        :aria-disabled="item.disabled || undefined"
        :aria-current="ctx.isSelected(item, index, prefix) ? 'page' : undefined"
        :title="collapsed ? item.label : undefined"
        :href="leafHref(item)"
        :to="leafLinkTo(item)"
        @click="onLeafClick(item, $event)"
      >
        <span v-if="iconOf(item)" class="m-menu__icon" aria-hidden="true">
          <MIcon :name="iconOf(item)!" size="sm" />
        </span>
        <span class="m-menu__label">{{ item.label }}</span>
      </component>
    </div>
  </template>
</template>
