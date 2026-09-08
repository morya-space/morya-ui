<script setup lang="ts">
import type { TabItem, TabsProps } from './types'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWkId } from '../../shared/useWkId'
import { useWkLocale } from '../../locale'
import WkIcon from '../Icon/Icon.vue'

const props = withDefaults(defineProps<TabsProps>(), {
  type: 'line',
  closable: false,
  addable: false,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
  (event: 'close', value: string): void
  (event: 'add'): void
}>()

const locale = useWkLocale()
const tabsUid = useWkId()
const scroller = ref<HTMLElement | null>(null)
const overflowed = ref(false)
const activeValue = computed(() => props.modelValue ?? props.tabs.find((tab) => !tab.disabled)?.value)

function selectTab(value: string) {
  emit('update:modelValue', value)
  emit('change', value)
}

function isClosable(tab: TabItem) {
  return tab.closable ?? props.closable
}

function closeTab(tab: TabItem) {
  if (tab.disabled) return
  emit('close', tab.value)
  if (activeValue.value !== tab.value) return
  const next = props.tabs.find((item) => item.value !== tab.value && !item.disabled)
  if (next) selectTab(next.value)
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const enabledTabs = props.tabs.filter((tab) => !tab.disabled)
  const currentIndex = enabledTabs.findIndex((tab) => tab.value === props.tabs[index]?.value)
  const targetIndex =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? enabledTabs.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + enabledTabs.length) % enabledTabs.length
  const target = enabledTabs[targetIndex]
  if (!target) return
  selectTab(target.value)
  requestAnimationFrame(() =>
    document.getElementById(`wk-tab-${target.value}`)?.focus({ preventScroll: true }),
  )
}

function updateOverflow() {
  const el = scroller.value
  overflowed.value = Boolean(el && el.scrollWidth > el.clientWidth + 1)
}

function scrollTabs(direction: number) {
  const el = scroller.value
  if (!el) return
  const step = Math.round(el.clientWidth * 0.75) * Math.sign(direction)
  el.scrollBy({ left: step, behavior: 'smooth' })
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  updateOverflow()
  if (!scroller.value || typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(() => updateOverflow())
  resizeObserver.observe(scroller.value)
})

watch(
  () => props.tabs,
  () => {
    void nextTick(updateOverflow)
  },
  { deep: true },
)

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="wk-tabs" :class="`wk-tabs--${type}`">
    <div class="wk-tabs__bar">
      <button
        v-if="overflowed"
        type="button"
        class="wk-tabs__scroll"
        :aria-label="locale.prev"
        @click="scrollTabs(-1)"
      >
        <WkIcon name="chevron-left" size="sm" />
      </button>
      <div ref="scroller" class="wk-tabs__scroller">
        <div class="wk-tabs__list" role="tablist" :aria-label="locale.tabs">
          <div
            v-for="(tab, index) in tabs"
            :key="tab.value"
            class="wk-tabs__item"
            :class="{ 'wk-tabs__item--active': activeValue === tab.value }"
          >
            <button
              :id="`wk-tab-${tab.value}`"
              class="wk-tabs__tab"
              :class="{ 'wk-tabs__tab--active': activeValue === tab.value }"
              type="button"
              role="tab"
              :aria-selected="activeValue === tab.value"
              :aria-controls="`${tabsUid}-panel-${tab.value}`"
              :disabled="tab.disabled"
              @click="selectTab(tab.value)"
              @keydown="onKeydown($event, index)"
            >
              {{ tab.label }}
            </button>
            <button
              v-if="isClosable(tab)"
              type="button"
              class="wk-tabs__close"
              :aria-label="locale.closeTab"
              :disabled="tab.disabled"
              @click.stop="closeTab(tab)"
            >
              <WkIcon name="close" size="sm" />
            </button>
          </div>
        </div>
      </div>
      <button
        v-if="overflowed"
        type="button"
        class="wk-tabs__scroll"
        :aria-label="locale.next"
        @click="scrollTabs(1)"
      >
        <WkIcon name="chevron-right" size="sm" />
      </button>
      <button
        v-if="addable"
        type="button"
        class="wk-tabs__add"
        :aria-label="locale.addTab"
        @click="emit('add')"
      >
        <WkIcon name="plus" size="sm" />
      </button>
      <div v-if="$slots.extra" class="wk-tabs__extra">
        <slot name="extra" />
      </div>
    </div>
    <div
      v-if="activeValue"
      :id="`${tabsUid}-panel-${activeValue}`"
      class="wk-tabs__panel"
      role="tabpanel"
      :aria-labelledby="`wk-tab-${activeValue}`"
    >
      <slot :active-value="activeValue" />
    </div>
  </div>
</template>
