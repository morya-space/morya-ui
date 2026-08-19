<script setup lang="ts">
import { computed } from 'vue'
import { useWdLocale } from '../../locale'
import type { PanelProps } from './types'

const props = withDefaults(defineProps<PanelProps>(), {
  toggleable: false,
})

const emit = defineEmits<{
  (event: 'update:collapsed', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
}>()

const locale = useWdLocale()

const isCollapsed = computed(() => props.modelValue ?? props.collapsed ?? false)

function toggle() {
  if (!props.toggleable) return
  const next = !isCollapsed.value
  emit('update:collapsed', next)
  emit('update:modelValue', next)
}
</script>

<template>
  <section class="wd-panel" :class="{ 'wd-panel--collapsed': isCollapsed }">
    <header v-if="$slots.header || header || toggleable" class="wd-panel__header">
      <div class="wd-panel__title">
        <slot name="header">{{ header }}</slot>
      </div>
      <button
        v-if="toggleable"
        type="button"
        class="wd-panel__toggler"
        :aria-expanded="!isCollapsed"
        :aria-label="isCollapsed ? locale.expand : locale.collapse"
        @click="toggle"
      >
        <span aria-hidden="true">{{ isCollapsed ? '▸' : '▾' }}</span>
      </button>
    </header>
    <div v-show="!isCollapsed" class="wd-panel__content">
      <slot />
    </div>
  </section>
</template>
