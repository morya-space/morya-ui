<script setup lang="ts">

import type { CommandMenuItem, CommandMenuProps } from './types'
import { computed, nextTick, ref, toRef, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useMConfig } from '../../shared/config'
import { filterItemsByLabel } from '../../shared/filterByQuery'
import { resolveMenuIcon, resolveMenuIconComponent } from '../../shared/menu'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useModalOverlay } from '../../shared/useModalOverlay'
import { useMotionTransition } from '../../theme/useMotionTransition'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CommandMenuProps>(), {
  transition: undefined,
  model: () => [],
  modelValue: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const config = useMConfig()
const { transitionName, transitionCss } = useMotionTransition({
  role: 'tooltip',
  local: () => props.transition,
  componentName: 'CommandMenu',
  fallback: 'fade',
})
const locale = useMLocale()
const searchPlaceholder = computed(() => props.placeholder ?? locale.value.searchCommands)
const query = ref('')
const panelRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))

const filtered = computed(() => filterItemsByLabel(props.model, query.value))

function close() {
  emit('update:modelValue', false)
}

function activate(item: CommandMenuItem) {
  if (item.disabled) return
  item.command?.()
  close()
}

function iconOf(item: CommandMenuItem) {
  return typeof item.icon === 'string' ? resolveMenuIcon(item.icon) : undefined
}

function iconComponentOf(item: CommandMenuItem) {
  return resolveMenuIconComponent(item.icon)
}

function hasIcon(item: CommandMenuItem) {
  return Boolean(iconOf(item) || iconComponentOf(item))
}

function onPanelKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(filtered.value.length - 1, activeIndex.value + 1)
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(0, activeIndex.value - 1)
  }
  if (event.key === 'Enter') {
    const item = filtered.value[activeIndex.value]
    if (item) {
      event.preventDefault()
      activate(item)
    }
  }
}

useModalOverlay({
  open: toRef(props, 'modelValue'),
  container: panelRef,
  blockScroll: true,
  autoFocus: false,
  onEscape: close,
  onOpen: () => {
    query.value = ''
    activeIndex.value = 0
  },
})

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return
    await nextTick()
    inputRef.value?.focus()
  },
)

watch(filtered, () => {
  activeIndex.value = 0
})
</script>

<template>
  <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
    <Transition :name="transitionName" :css="transitionCss">
      <div v-if="modelValue" v-bind="rootAttrs" class="m-command-menu-backdrop" @click.self="close">
        <div
          ref="panelRef"
          class="m-command-menu"
          role="dialog"
          aria-modal="true"
          :aria-label="locale.commandPalette"
          tabindex="-1"
          @keydown="onPanelKeydown"
        >
          <input
            ref="inputRef"
            v-model="query"
            class="m-command-menu__input"
            type="search"
            :placeholder="searchPlaceholder"
            :aria-label="locale.searchCommands"
          >
          <MScrollbar
            tag="ul"
            role="listbox"
            class="m-command-menu__list"
            fit-content
            view-class="m-command-menu__list-view"
          >
            <li v-for="(item, index) in filtered" :key="`${item.label}-${index}`" role="presentation">
              <button
                type="button"
                class="m-command-menu__item"
                role="option"
                :class="{ 'm-command-menu__item--active': index === activeIndex }"
                :aria-selected="index === activeIndex"
                :disabled="item.disabled"
                @click="activate(item)"
                @mouseenter="activeIndex = index"
              >
                <span v-if="hasIcon(item)" class="m-command-menu__icon" aria-hidden="true">
                  <MIcon v-if="iconOf(item)" :name="iconOf(item)!" size="sm" />
                  <component :is="iconComponentOf(item)" v-else-if="iconComponentOf(item)" />
                </span>
                <span class="m-command-menu__label">{{ item.label }}</span>
                <span v-if="item.shortcut" class="m-command-menu__shortcut">{{ item.shortcut }}</span>
              </button>
            </li>
            <li v-if="!filtered.length" class="m-command-menu__empty">
              {{ locale.noMatch }}
            </li>
          </MScrollbar>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
