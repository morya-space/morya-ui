<script setup lang="ts">
import type { MenuItem } from './types'
import { computed, ref } from 'vue'
import WiIcon from '../Icon/Icon.vue'
import { menuNodeKey, resolveMenuIcon } from '../../shared/menu'
import MenuNodes from './MenuNodes.vue'

const props = defineProps<{
  items: MenuItem[]
  depth: number
  indent: number
  collapsed: boolean
  selectedKey: string | null
}>()

const emit = defineEmits<{
  (event: 'activate', item: MenuItem): void
}>()

const openKeys = ref<Record<string, boolean>>({})

function itemKey(item: MenuItem, index: number) {
  return menuNodeKey(item, index, `item-${props.depth}`)
}

function isSelected(item: MenuItem) {
  const key = item.key ?? item.label
  return Boolean(key && key === props.selectedKey)
}

function toggleSub(item: MenuItem, index: number) {
  if (item.disabled) return
  const key = itemKey(item, index)
  openKeys.value = { ...openKeys.value, [key]: !openKeys.value[key] }
}

function iconOf(item: MenuItem) {
  return resolveMenuIcon(item.icon)
}

const pad = computed(() => (props.collapsed ? 0 : props.depth * props.indent))
</script>

<template>
  <template v-for="(item, index) in items" :key="itemKey(item, index)">
    <div v-if="item.separator" class="wi-menu__separator" role="separator" />
    <div v-else-if="item.items?.length" class="wi-menu__group">
      <button
        type="button"
        class="wi-menu__item wi-menu__item--parent"
        :class="{ 'wi-menu__item--selected': isSelected(item) }"
        :disabled="item.disabled"
        :style="{ paddingLeft: `${12 + pad}px` }"
        :aria-expanded="Boolean(openKeys[itemKey(item, index)])"
        @click="toggleSub(item, index)"
      >
        <span v-if="iconOf(item) || item.icon" class="wi-menu__icon" aria-hidden="true">
          <WiIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
          <template v-else>{{ item.icon }}</template>
        </span>
        <span v-if="!collapsed" class="wi-menu__label">{{ item.label }}</span>
        <span v-if="!collapsed" class="wi-menu__caret" aria-hidden="true">
          <WiIcon :name="openKeys[itemKey(item, index)] ? 'chevron-down' : 'chevron-right'" size="sm" />
        </span>
      </button>
      <div v-if="openKeys[itemKey(item, index)]" class="wi-menu__submenu" role="group">
        <MenuNodes
          :items="item.items"
          :depth="depth + 1"
          :indent="indent"
          :collapsed="collapsed"
          :selected-key="selectedKey"
          @activate="$emit('activate', $event)"
        />
      </div>
    </div>
    <button
      v-else
      type="button"
      class="wi-menu__item"
      :class="{ 'wi-menu__item--selected': isSelected(item) }"
      role="menuitem"
      :disabled="item.disabled"
      :style="{ paddingLeft: `${12 + pad}px` }"
      :title="collapsed ? item.label : undefined"
      @click="$emit('activate', item)"
    >
      <span v-if="iconOf(item) || item.icon" class="wi-menu__icon" aria-hidden="true">
        <WiIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
        <template v-else>{{ item.icon }}</template>
      </span>
      <span v-if="!collapsed" class="wi-menu__label">{{ item.label }}</span>
    </button>
  </template>
</template>
