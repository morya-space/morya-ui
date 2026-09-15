<script setup lang="ts">
import type { DocSection } from '../composables/useDocSections'
import { useDocsI18n } from '../i18n'

defineProps<{
  sections: DocSection[]
  activeId?: string
}>()

const emit = defineEmits<{
  (event: 'select', id: string): void
}>()

const { t } = useDocsI18n()
</script>

<template>
  <nav class="doc-section-nav" :aria-label="t.componentSection">
    <div class="doc-section-nav__heading">
      <h2 class="doc-section-nav__title">{{ t.componentSection }}</h2>
      <span v-if="sections.length" class="doc-section-nav__count">
        {{ t.sectionsCount.replace('{count}', String(sections.length)) }}
      </span>
    </div>
    <ol v-if="sections.length" class="doc-section-nav__list">
      <li
        v-for="section in sections"
        :key="section.id"
        class="doc-section-nav__item"
        :class="{
          'doc-section-nav__item--sub': section.level === 3,
          'doc-section-nav__item--active': section.id === activeId,
        }"
      >
        <button
          type="button"
          :aria-current="section.id === activeId ? 'location' : undefined"
          @click="emit('select', section.id)"
        >
          {{ section.label }}
        </button>
      </li>
    </ol>
    <p v-else class="doc-section-nav__empty">
      {{ t.defaultDoc }}
    </p>
  </nav>
</template>

<style scoped>
.doc-section-nav {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.doc-section-nav__heading {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.65rem;
  justify-content: space-between;
}

.doc-section-nav__title {
  color: var(--m-color-text);
  font-family: var(--docs-display);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
}

.doc-section-nav__count {
  color: var(--m-color-text-muted);
  font-family: var(--docs-mono);
  font-size: 0.68rem;
}

.doc-section-nav__list {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.doc-section-nav__item button {
  background: transparent;
  border: 0;
  border-radius: var(--m-radius-sm);
  color: var(--m-color-text-muted);
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1.45;
  padding: 0.4rem 0.55rem;
  text-align: left;
  transition:
    background-color var(--m-motion-fast) var(--m-motion-ease),
    color var(--m-motion-fast) var(--m-motion-ease);
  width: 100%;
}

.doc-section-nav__item button:hover {
  background: color-mix(in srgb, var(--m-color-primary) 8%, transparent);
  color: var(--m-color-primary);
}

.doc-section-nav__item--active button {
  background: color-mix(in srgb, var(--m-color-primary) 10%, var(--m-color-surface));
  color: var(--m-color-primary);
  font-weight: 600;
}

.doc-section-nav__item--sub button {
  font-size: 0.74rem;
  padding-left: 1rem;
}

.doc-section-nav__empty {
  color: var(--m-color-text-muted);
  font-size: 0.75rem;
  line-height: 1.5;
  margin: 0;
}
</style>
