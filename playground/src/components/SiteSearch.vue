<script setup lang="ts">
import { WiCommandMenu, WiIcon } from '@well-insight/ui'
import { onMounted, onUnmounted } from 'vue'
import { useSiteSearchPalette } from '../composables/useSiteSearch'
import { useDocsI18n } from '../i18n'

const { visible, items, open, toggle } = useSiteSearchPalette()
const { t } = useDocsI18n()

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    toggle()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <button
    type="button"
    class="site-search-trigger"
    :aria-label="t.searchOpen"
    @click="open"
  >
    <WiIcon name="search" size="sm" />
    <span class="site-search-trigger__label">{{ t.searchOpen }}</span>
    <kbd class="site-search-trigger__kbd" aria-hidden="true">⌘K</kbd>
  </button>
  <WiCommandMenu
    v-model="visible"
    :model="items"
    :placeholder="t.searchPlaceholder"
  />
</template>

<style scoped>
.site-search-trigger {
  align-items: center;
  background: color-mix(in srgb, var(--wi-color-surface) 88%, transparent);
  border: 1px solid var(--docs-edge);
  border-radius: 999px;
  color: var(--wi-color-text-muted);
  cursor: pointer;
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  transition:
    border-color var(--wi-motion-fast) var(--wi-motion-ease),
    color var(--wi-motion-fast) var(--wi-motion-ease);
}

.site-search-trigger:hover {
  border-color: color-mix(in srgb, var(--wi-color-primary) 35%, var(--docs-edge));
  color: var(--wi-color-text);
}

.site-search-trigger__label {
  font-size: 0.78rem;
}

.site-search-trigger__kbd {
  background: color-mix(in srgb, var(--wi-color-text) 6%, var(--wi-color-surface));
  border: 1px solid var(--docs-edge);
  border-radius: 0.35rem;
  font-family: var(--docs-mono);
  font-size: 0.62rem;
  line-height: 1;
  padding: 0.15rem 0.35rem;
}

@media (max-width: 700px) {
  .site-search-trigger__label,
  .site-search-trigger__kbd {
    display: none;
  }
}
</style>
