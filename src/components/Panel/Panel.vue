<script setup lang="ts">
import type { PanelProps } from './types'
import { computed } from 'vue'
import { useWiLocale } from '../../locale'
import WiIcon from '../Icon/Icon.vue'
import { resolveSizeClass } from '../../shared/types'

const props = withDefaults(defineProps<PanelProps>(), {
  toggleable: false,
})

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
}>()

const locale = useWiLocale()
const sizeTone = computed(() => resolveSizeClass(props.size))
const isCollapsed = computed(() => props.modelValue ?? props.collapsed ?? false)

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
  const next = !isCollapsed.value
  emit('update:collapsed', next)
  emit('update:modelValue', next)
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
