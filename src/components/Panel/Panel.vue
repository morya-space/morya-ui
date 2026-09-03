<script setup lang="ts">
import type { PanelProps } from './types'
import { computed } from 'vue'
import { useWiLocale } from '../../locale'
import { useControllable } from '../../shared/useControllable'
import { resolveSizeClass } from '../../shared/types'
import WiIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<PanelProps>(), {
  toggleable: false,
  defaultCollapsed: false,
  collapsed: undefined,
  modelValue: undefined,
})

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
}>()

const locale = useWiLocale()
const sizeTone = computed(() => resolveSizeClass(props.size))

function resolveControlledCollapsed() {
  if (props.collapsed !== undefined) return props.collapsed
  if (props.modelValue !== undefined) return props.modelValue
  return undefined
}

const { value: isCollapsed, setValue: setCollapsed } = useControllable(
  {
    controlled: resolveControlledCollapsed,
    defaultValue: props.defaultCollapsed,
  },
  (next) => {
    emit('update:collapsed', next)
    emit('update:modelValue', next)
  },
)

const rootClass = computed(() => [
  'wi-panel',
  {
    'wi-panel--collapsed': isCollapsed.value,
    'wi-panel--small': sizeTone.value === 'small',
    'wi-panel--large': sizeTone.value === 'large',
  },
])

function toggle() {
  if (!props.toggleable) return
  setCollapsed(!isCollapsed.value)
}
</script>

<template>
  <section :class="rootClass">
    <header v-if="$slots.header || header || toggleable" class="wi-panel__header">
      <div class="wi-panel__title">
        <slot name="header">
          {{ header }}
        </slot>
      </div>
      <button
        v-if="toggleable"
        type="button"
        class="wi-panel__toggler"
        :aria-expanded="!isCollapsed"
        :aria-label="isCollapsed ? locale.expand : locale.collapse"
        @click="toggle"
      >
        <WiIcon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" size="sm" />
      </button>
    </header>
    <div v-show="!isCollapsed" class="wi-panel__content">
      <slot />
    </div>
    <footer v-if="$slots.footer && !isCollapsed" class="wi-panel__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
