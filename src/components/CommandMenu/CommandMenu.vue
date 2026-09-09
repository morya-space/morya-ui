<script setup lang="ts">
import type { CommandMenuItem, CommandMenuProps } from './types'
import { computed, nextTick, ref, toRef, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useMConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { resolveMenuIcon } from '../../shared/menu'
import { useModalOverlay } from '../../shared/useModalOverlay'
import MIcon from '../Icon/Icon.vue'
import MScrollbar from '../Scrollbar/Scrollbar.vue'

const props = withDefaults(defineProps<CommandMenuProps>(), {
  model: () => [],
  modelValue: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const config = useMConfig()
const locale = useMLocale()
const searchPlaceholder = computed(() => props.placeholder ?? locale.value.searchCommands)
const query = ref('')
const panelRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.model
  return props.model.filter((item) => item.label.toLowerCase().includes(q))
})

function close() {
  emit('update:modelValue', false)
}

function activate(item: CommandMenuItem) {
  if (item.disabled) return
  item.command?.()
  close()
}

function iconOf(item: CommandMenuItem) {
  return resolveMenuIcon(item.icon)
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
    <Transition name="m-fade">
      <div v-if="modelValue" class="m-commandmenu-backdrop" @click.self="close">
        <div
          ref="panelRef"
          class="m-commandmenu"
          role="dialog"
          aria-modal="true"
          :aria-label="locale.commandPalette"
          tabindex="-1"
          @keydown="onPanelKeydown"
        >
          <input
            ref="inputRef"
            v-model="query"
            class="m-commandmenu__input"
            type="search"
            :placeholder="searchPlaceholder"
            :aria-label="locale.searchCommands"
          >
          <MScrollbar
            tag="ul"
            role="listbox"
            class="m-commandmenu__list"
            fit-content
            view-class="m-commandmenu__list-view"
          >
            <li v-for="(item, index) in filtered" :key="`${item.label}-${index}`" role="presentation">
              <button
                type="button"
                class="m-commandmenu__item"
                role="option"
                :class="{ 'm-commandmenu__item--active': index === activeIndex }"
                :aria-selected="index === activeIndex"
                :disabled="item.disabled"
                @click="activate(item)"
                @mouseenter="activeIndex = index"
              >
                <span v-if="iconOf(item)" class="m-commandmenu__icon" aria-hidden="true">
                  <MIcon :name="iconOf(item)!" size="sm" />
                </span>
                <span class="m-commandmenu__label">{{ item.label }}</span>
                <span v-if="item.shortcut" class="m-commandmenu__shortcut">{{ item.shortcut }}</span>
              </button>
            </li>
            <li v-if="!filtered.length" class="m-commandmenu__empty">
              {{ locale.noMatch }}
            </li>
          </MScrollbar>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
