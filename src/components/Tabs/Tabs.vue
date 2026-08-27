<script setup lang="ts">
import type { TabItem, TabsProps } from './types'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWiLocale } from '../../locale'

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

const locale = useWiLocale()
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
    document.getElementById(`wi-tab-${target.value}`)?.focus({ preventScroll: true }),
  )
}

function updateOverflow() {
  const el = scroller.value
  overflowed.value = Boolean(el && el.scrollWidth > el.clientWidth + 1)
}

function scrollTabs(delta: number) {
  scroller.value?.scrollBy({ left: delta, behavior: 'smooth' })
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
  <div class="wi-tabs" :class="`wi-tabs--${type}`">
    <div class="wi-tabs__bar">
      <button
        v-if="overflowed"
        type="button"
        class="wi-tabs__scroll"
        :aria-label="locale.prev"
        @click="scrollTabs(-160)"
      >
        ‹
      </button>
      <div ref="scroller" class="wi-tabs__scroller">
        <div class="wi-tabs__list" role="tablist" :aria-label="locale.tabs">
          <div
            v-for="(tab, index) in tabs"
            :key="tab.value"
            class="wi-tabs__item"
            :class="{ 'wi-tabs__item--active': activeValue === tab.value }"
          >
            <button
              :id="`wi-tab-${tab.value}`"
              class="wi-tabs__tab"
              :class="{ 'wi-tabs__tab--active': activeValue === tab.value }"
              type="button"
              role="tab"
              :aria-selected="activeValue === tab.value"
              :disabled="tab.disabled"
              @click="selectTab(tab.value)"
              @keydown="onKeydown($event, index)"
            >
              {{ tab.label }}
            </button>
            <button
              v-if="isClosable(tab)"
              type="button"
              class="wi-tabs__close"
              :aria-label="locale.closeTab"
              :disabled="tab.disabled"
              @click.stop="closeTab(tab)"
            >
              ×
            </button>
          </div>
        </div>
      </div>
      <button
        v-if="overflowed"
        type="button"
        class="wi-tabs__scroll"
        :aria-label="locale.next"
        @click="scrollTabs(160)"
      >
        ›
      </button>
      <button
        v-if="addable"
        type="button"
        class="wi-tabs__add"
        :aria-label="locale.addTab"
        @click="emit('add')"
      >
        +
      </button>
      <div v-if="$slots.extra" class="wi-tabs__extra">
        <slot name="extra" />
      </div>
    </div>
    <div class="wi-tabs__panel" role="tabpanel">
      <slot :active-value="activeValue" />
    </div>
  </div>
</template>
