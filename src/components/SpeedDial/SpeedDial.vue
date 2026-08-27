<script setup lang="ts">
import type { SpeedDialItem, SpeedDialProps } from './types'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { isOverlayTeleported, resolveOverlayTeleport } from '../../shared/overlay'

const props = withDefaults(defineProps<SpeedDialProps>(), {
  model: () => [],
  direction: 'up',
  modelValue: false,
  disabled: false,
  teleport: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const config = useWiConfig()
const locale = useWiLocale()
const speedDialLabel = computed(() => props.ariaLabel ?? locale.value.speedDial)
const root = ref<HTMLElement | null>(null)
const button = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const listStyle = ref<Record<string, string>>({})
const teleportTarget = computed(() => resolveOverlayTeleport(props, config.value.appendTo))
const teleported = computed(() => isOverlayTeleported(props, config.value.appendTo))

const rootClass = computed(() => [
  'wi-speeddial',
  `wi-speeddial--${props.direction}`,
  {
    'wi-speeddial--open': props.modelValue,
    'wi-speeddial--disabled': props.disabled,
  },
])

function updateListPosition() {
  if (!teleported.value || !button.value) return
  const rect = button.value.getBoundingClientRect()
  const gap = 8
  if (props.direction === 'up') {
    listStyle.value = {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top - gap}px`,
      transform: 'translate(-50%, -100%)',
    }
  } else if (props.direction === 'down') {
    listStyle.value = {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.bottom + gap}px`,
      transform: 'translateX(-50%)',
    }
  } else if (props.direction === 'left') {
    listStyle.value = {
      left: `${rect.left - gap}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: 'translate(-100%, -50%)',
    }
  } else {
    listStyle.value = {
      left: `${rect.right + gap}px`,
      top: `${rect.top + rect.height / 2}px`,
      transform: 'translateY(-50%)',
    }
  }
}

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}

function activate(item: SpeedDialItem) {
  if (props.disabled || item.disabled) return
  item.command?.()
  emit('update:modelValue', false)
}

function onViewportChange() {
  if (props.modelValue) updateListPosition()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      void nextTick(() => updateListPosition())
      if (teleported.value) {
        window.addEventListener('resize', onViewportChange)
        window.addEventListener('scroll', onViewportChange, true)
      }
    } else {
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
    }
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div ref="root" :class="rootClass">
    <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition name="wi-scale-fade">
        <ul
          v-if="modelValue"
          ref="list"
          class="wi-speeddial__list"
          :class="{ 'wi-speeddial__list--teleported': teleported }"
          :style="teleported ? listStyle : undefined"
          role="menu"
        >
          <li v-for="(item, index) in model" :key="`${item.label}-${index}`" role="none">
            <button
              type="button"
              class="wi-speeddial__action"
              role="menuitem"
              :title="item.label"
              :aria-label="item.label"
              :disabled="item.disabled"
              @click="activate(item)"
            >
              <span v-if="item.icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="wi-speeddial__action-label">{{ item.label }}</span>
            </button>
          </li>
        </ul>
      </Transition>
    </Teleport>
    <button
      ref="button"
      type="button"
      class="wi-speeddial__button"
      :aria-label="speedDialLabel"
      :aria-expanded="modelValue"
      :disabled="disabled"
      @click="toggle"
    >
      <slot name="icon">
        +
      </slot>
    </button>
  </div>
</template>
