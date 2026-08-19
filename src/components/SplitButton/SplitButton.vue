<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWdLocale } from '../../locale'
import { useWdConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'
import { resolveSizeClass } from '../../shared/types'
import type { SplitButtonItem, SplitButtonProps } from './types'

const props = withDefaults(defineProps<SplitButtonProps>(), {
  model: () => [],
  disabled: false,
  outlined: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
  (event: 'command', item: SplitButtonItem): void
}>()

const config = useWdConfig()
const locale = useWdLocale()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const menuStyle = ref<Record<string, string>>({})
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const rootClass = computed(() => [
  'wd-splitbutton',
  `wd-splitbutton--${sizeClass.value}`,
  {
    'wd-splitbutton--disabled': props.disabled,
    'wd-splitbutton--outlined': props.outlined,
    [`wd-splitbutton--${props.severity}`]: Boolean(props.severity),
    'wd-splitbutton--open': open.value,
  },
])

function updateMenuPosition() {
  if (!teleported.value || !root.value) return
  const rect = root.value.getBoundingClientRect()
  menuStyle.value = {
    left: 'auto',
    minWidth: `${rect.width}px`,
    right: `${document.documentElement.clientWidth - rect.right}px`,
    top: `${rect.bottom + 4}px`,
  }
}

function onViewportChange() {
  if (open.value) updateMenuPosition()
}

function onMainClick(event: MouseEvent) {
  if (props.disabled) return
  emit('click', event)
}

function toggleMenu() {
  if (props.disabled) return
  open.value = !open.value
}

function activate(item: SplitButtonItem) {
  if (item.disabled || props.disabled) return
  item.command?.()
  emit('command', item)
  open.value = false
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || menu.value?.contains(target)) return
  open.value = false
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', onDocumentClick)
    void nextTick(() => updateMenuPosition())
    if (teleported.value) {
      window.addEventListener('resize', onViewportChange)
      window.addEventListener('scroll', onViewportChange, true)
    }
  } else {
    document.removeEventListener('click', onDocumentClick)
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div ref="root" :class="rootClass">
    <button
      type="button"
      class="wd-splitbutton__main"
      :disabled="disabled"
      @click="onMainClick"
    >
      <span v-if="icon" class="wd-splitbutton__icon" aria-hidden="true">{{ icon }}</span>
      <span v-if="label">{{ label }}</span>
    </button>
    <button
      type="button"
      class="wd-splitbutton__trigger"
      :aria-label="locale.moreActions"
      :aria-expanded="open"
      aria-haspopup="menu"
      :disabled="disabled"
      @click="toggleMenu"
    >
      ▾
    </button>
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wd-scale-fade">
        <ul
          v-if="open"
          ref="menu"
          class="wd-splitbutton__menu"
          :class="{ 'wd-splitbutton__menu--teleported': teleported }"
          :style="teleported ? menuStyle : undefined"
          role="menu"
        >
          <li v-for="(item, index) in model" :key="`${item.label}-${index}`" role="presentation">
            <button
              type="button"
              class="wd-splitbutton__item"
              role="menuitem"
              :disabled="item.disabled"
              @click="activate(item)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>
