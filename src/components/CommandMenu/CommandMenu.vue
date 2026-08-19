<script setup lang="ts">
import { nextTick, computed, ref, toRef, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useModalOverlay } from '../../shared/useModalOverlay'
import type { CommandMenuItem, CommandMenuProps } from './types'

const props = withDefaults(defineProps<CommandMenuProps>(), {
  model: () => [],
  modelValue: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const config = useWdConfig()
const locale = useWdLocale()
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
    <Transition name="wd-fade">
      <div v-if="modelValue" class="wd-commandmenu-backdrop" @click.self="close">
        <div
          ref="panelRef"
          class="wd-commandmenu"
          role="dialog"
          aria-modal="true"
          :aria-label="locale.commandPalette"
          tabindex="-1"
          @keydown="onPanelKeydown"
        >
          <input
            ref="inputRef"
            v-model="query"
            class="wd-commandmenu__input"
            type="search"
            :placeholder="searchPlaceholder"
            :aria-label="locale.searchCommands"
          />
          <ul class="wd-commandmenu__list" role="listbox">
            <li v-for="(item, index) in filtered" :key="`${item.label}-${index}`" role="presentation">
              <button
                type="button"
                class="wd-commandmenu__item"
                role="option"
                :class="{ 'wd-commandmenu__item--active': index === activeIndex }"
                :aria-selected="index === activeIndex"
                :disabled="item.disabled"
                @click="activate(item)"
                @mouseenter="activeIndex = index"
              >
                <span v-if="item.icon" class="wd-commandmenu__icon" aria-hidden="true">{{ item.icon }}</span>
                <span class="wd-commandmenu__label">{{ item.label }}</span>
                <span v-if="item.shortcut" class="wd-commandmenu__shortcut">{{ item.shortcut }}</span>
              </button>
            </li>
            <li v-if="!filtered.length" class="wd-commandmenu__empty">{{ locale.noMatch }}</li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
