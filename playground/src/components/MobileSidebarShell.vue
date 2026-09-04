<script setup lang="ts">
import { WdIcon, WdScrollbar } from '@wex-design/ui'
import { onUnmounted, ref, useAttrs, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  title: string
  toggleLabel: string
  scrollClass?: string
  bodyClass?: string
}>()

const attrs = useAttrs()
const open = ref(false)

watch(open, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function onPanelClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('a.docs-nav__item, a.nav-item')) {
    close()
  }
}
</script>

<template>
  <div class="mobile-sidebar-shell">
    <button
      type="button"
      class="mobile-sidebar-shell__toggle"
      :aria-expanded="open"
      :aria-label="toggleLabel"
      @click="toggle"
    >
      <WdIcon name="menu" size="sm" />
      <span>{{ title }}</span>
    </button>

    <Transition name="wd-fade">
      <button
        v-if="open"
        type="button"
        class="mobile-sidebar-shell__backdrop"
        :aria-label="toggleLabel"
        @click="close"
      />
    </Transition>

    <aside
      :class="['mobile-sidebar-shell__panel', attrs.class]"
      :aria-label="title"
      :data-open="open ? 'true' : undefined"
    >
      <WdScrollbar :class="scrollClass ?? 'mobile-sidebar-shell__scroll'">
        <div
          :class="bodyClass"
          @click="onPanelClick"
        >
          <slot />
        </div>
      </WdScrollbar>
    </aside>
  </div>
</template>

<style scoped>
.mobile-sidebar-shell {
  display: contents;
}

.mobile-sidebar-shell__toggle {
  display: none;
}

.mobile-sidebar-shell__backdrop {
  display: none;
}

.mobile-sidebar-shell__panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.mobile-sidebar-shell__panel > :deep(.wd-scrollbar),
.mobile-sidebar-shell__scroll {
  flex: 1;
  height: 100%;
  min-height: 0;
}

.mobile-sidebar-shell__panel > :deep(.wd-scrollbar .wd-scrollbar__wrap) {
  overscroll-behavior: contain;
}

.mobile-sidebar-shell__scroll {
  flex: 1;
  height: 100%;
  min-height: 0;
}

.mobile-sidebar-shell__scroll :deep(.wd-scrollbar__wrap) {
  overscroll-behavior: contain;
}

@media (max-width: 700px) {
  .mobile-sidebar-shell {
    display: block;
  }

  .mobile-sidebar-shell__toggle {
    align-items: center;
    background: color-mix(in srgb, var(--wd-color-surface) 88%, transparent);
    border: 1px solid var(--docs-edge);
    border-radius: 0.75rem;
    color: var(--wd-color-text);
    cursor: pointer;
    display: inline-flex;
    font-size: 0.86rem;
    font-weight: 600;
    gap: 0.45rem;
    margin: 0.85rem 0.85rem 0;
    padding: 0.55rem 0.75rem;
    width: calc(100% - 1.7rem);
  }

  .mobile-sidebar-shell__backdrop {
    background: color-mix(in srgb, #000 42%, transparent);
    border: 0;
    cursor: pointer;
    display: block;
    inset: 0;
    position: fixed;
    z-index: 280;
  }

  .mobile-sidebar-shell__panel {
    background: color-mix(in srgb, var(--wd-color-surface) 96%, transparent);
    border-right: 1px solid var(--docs-edge);
    bottom: 0;
    box-shadow: 0 0 40px color-mix(in srgb, #000 18%, transparent);
    left: 0;
    max-width: min(18rem, 88vw);
    position: fixed;
    top: 0;
    transform: translateX(-105%);
    transition: transform var(--wd-motion-normal) var(--wd-motion-ease);
    width: min(18rem, 88vw);
    z-index: 290;
    backdrop-filter: blur(16px);
  }

  .mobile-sidebar-shell__panel[data-open='true'] {
    transform: translateX(0);
  }
}
</style>
