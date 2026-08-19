<script setup lang="ts">
import { computed } from 'vue'
import type { TabsProps } from './types'

const props = defineProps<TabsProps>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()
const activeValue = computed(() => props.modelValue ?? props.tabs.find((tab) => !tab.disabled)?.value)

function selectTab(value: string) {
  emit('update:modelValue', value)
  emit('change', value)
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const enabledTabs = props.tabs.filter((tab) => !tab.disabled)
  const currentIndex = enabledTabs.findIndex((tab) => tab.value === props.tabs[index]?.value)
  const targetIndex = event.key === 'Home' ? 0 : event.key === 'End' ? enabledTabs.length - 1 : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + enabledTabs.length) % enabledTabs.length
  const target = enabledTabs[targetIndex]
  if (!target) return
  selectTab(target.value)
  requestAnimationFrame(() =>
    document.getElementById(`wd-tab-${target.value}`)?.focus({ preventScroll: true }),
  )
}
</script>

<template>
  <div class="wd-tabs">
    <div class="wd-tabs__list" role="tablist" aria-label="Tabs">
      <button
        v-for="(tab, index) in tabs"
        :id="`wd-tab-${tab.value}`"
        :key="tab.value"
        class="wd-tabs__tab"
        :class="{ 'wd-tabs__tab--active': activeValue === tab.value }"
        type="button"
        role="tab"
        :aria-selected="activeValue === tab.value"
        :disabled="tab.disabled"
        @click="selectTab(tab.value)"
        @keydown="onKeydown($event, index)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="wd-tabs__panel" role="tabpanel">
      <slot :active-value="activeValue" />
    </div>
  </div>
</template>
