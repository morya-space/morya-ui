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
      <h2 class="doc-section-nav__title">
        {{ t.componentSection }}
      </h2>
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
  position: relative;
}

.doc-section-nav__list::before {
  background: var(--docs-edge);
  border-radius: 999px;
  content: '';
  left: 0;
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  width: 1px;
}

.doc-section-nav__item {
  position: relative;
}

.doc-section-nav__item button {
  background: transparent;
  border: 0;
  border-radius: 0 var(--m-radius-sm) var(--m-radius-sm) 0;
  color: var(--m-color-text-muted);
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1.45;
  padding: 0.4rem 0.55rem 0.4rem 0.95rem;
  position: relative;
  text-align: left;
  transition:
    background-color var(--m-motion-fast) var(--m-motion-ease),
    color var(--m-motion-fast) var(--m-motion-ease);
  width: 100%;
}

/* dot centered exactly on the 1px rail at left:0 (center = 0.5px) */
.doc-section-nav__item button::before {
  background: var(--m-color-text-muted);
  border-radius: 50%;
  content: '';
  height: 0.35rem;
  left: calc(0.5px - 0.175rem);
  opacity: 0.45;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition:
    background-color var(--m-motion-fast) var(--m-motion-ease),
    height var(--m-motion-fast) var(--m-motion-ease),
    left var(--m-motion-fast) var(--m-motion-ease),
    opacity var(--m-motion-fast) var(--m-motion-ease),
    width var(--m-motion-fast) var(--m-motion-ease);
  width: 0.35rem;
}

.doc-section-nav__item button:hover {
  color: var(--m-color-primary);
}

.doc-section-nav__item button:hover::before {
  background: var(--m-color-primary);
  opacity: 0.8;
}

.doc-section-nav__item--active button {
  color: var(--m-color-primary);
  font-weight: 600;
}

/* active pill keeps the same center on the rail */
.doc-section-nav__item--active button::before {
  background: var(--m-color-primary);
  border-radius: 999px;
  height: 1.05rem;
  left: calc(0.5px - 0.1rem);
  opacity: 1;
  width: 0.2rem;
}

.doc-section-nav__item--sub button {
  font-size: 0.74rem;
  padding-left: 1.45rem;
}

/* sub-items sit on their own inner guide at 0.5rem */
.doc-section-nav__item--sub button::before {
  left: calc(0.5rem + 0.5px - 0.15rem);
  height: 0.3rem;
  width: 0.3rem;
}

.doc-section-nav__item--sub.doc-section-nav__item--active button::before {
  left: calc(0.5rem + 0.5px - 0.09rem);
  height: 0.9rem;
  width: 0.18rem;
}

.doc-section-nav__empty {
  color: var(--m-color-text-muted);
  font-size: 0.75rem;
  line-height: 1.5;
  margin: 0;
}
</style>
