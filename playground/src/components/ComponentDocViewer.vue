<script setup lang="ts">
import type { DocSection } from '../composables/useDocSections'
import type { ResolvedComponentDoc } from '../docs/loadComponentDocs'
import { computed, onMounted, ref, watch } from 'vue'
import { useDocCodeCopy } from '../composables/useDocCodeCopy'
import { useDocSections } from '../composables/useDocSections'
import { useDocsI18n } from '../i18n'

const props = defineProps<{
  doc: ResolvedComponentDoc
}>()

const emit = defineEmits<{
  (event: 'sections-change', sections: DocSection[]): void
  (event: 'active-section-change', id: string): void
}>()

const bodyRef = ref<HTMLElement | null>(null)
const docSource = computed(() => props.doc)
const docKey = computed(() => props.doc.name)
const { t } = useDocsI18n()
useDocCodeCopy(bodyRef, docSource)

const {
  sections,
  activeSectionId,
  exampleCount,
  refreshNavigation,
  scrollToSection,
} = useDocSections(bodyRef, docKey)

watch(sections, (value) => emit('sections-change', value), { deep: true, immediate: true })
watch(activeSectionId, (value) => emit('active-section-change', value), { immediate: true })

onMounted(() => refreshNavigation())

defineExpose({ scrollToSection })
</script>

<template>
  <section class="component-doc-viewer">
    <div class="component-doc-viewer__intro">
      <span v-if="doc.frontmatter.category" class="component-doc-viewer__label">{{ doc.frontmatter.category }}</span>
      <h2>{{ doc.frontmatter.title || doc.name }}</h2>
      <p v-if="doc.frontmatter.description">
        {{ doc.frontmatter.description }}
      </p>
      <div class="component-doc-viewer__stats" aria-live="polite">
        <span>{{ t.examplesCount.replace('{count}', String(exampleCount)) }}</span>
        <span v-if="sections.length">{{ t.sectionsCount.replace('{count}', String(sections.length)) }}</span>
      </div>
    </div>
    <nav v-if="sections.length" class="component-doc-viewer__toc component-doc-viewer__toc--inline" :aria-label="t.componentSection">
      <button
        v-for="section in sections"
        :key="section.id"
        type="button"
        :class="{ 'component-doc-viewer__toc-button--active': section.id === activeSectionId }"
        :aria-current="section.id === activeSectionId ? 'location' : undefined"
        @click="scrollToSection(section.id)"
      >
        {{ section.label }}
      </button>
    </nav>
    <div ref="bodyRef" class="component-doc-viewer__body">
      <component :is="doc.component" />
    </div>
  </section>
</template>

<style scoped>
.component-doc-viewer {
  width: 100%;
}
.component-doc-viewer__intro {
  border-bottom: 1px solid var(--docs-edge);
  margin-bottom: 0.35rem;
  padding-bottom: 1rem;
}
.component-doc-viewer__label {
  color: var(--docs-glow);
  font-family: var(--docs-mono);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}
.component-doc-viewer__intro h2 {
  font-family: var(--docs-display);
  font-size: clamp(1.45rem, 2.4vw, 1.85rem);
  font-weight: 750;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin: 0.35rem 0 0.45rem;
}
.component-doc-viewer__stats {
  color: var(--rd-color-text-muted);
  display: flex;
  flex-wrap: wrap;
  font-family: var(--docs-mono);
  font-size: 0.68rem;
  gap: 0.85rem;
  margin-top: 0.75rem;
}
.component-doc-viewer__toc {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.75rem 0 1.25rem;
}
.component-doc-viewer__toc--inline {
  display: none;
}
.component-doc-viewer__toc button {
  background: color-mix(in srgb, var(--rd-color-primary) 7%, var(--rd-color-surface));
  border: 1px solid var(--docs-edge);
  border-radius: 999px;
  color: var(--rd-color-text-muted);
  cursor: pointer;
  font-size: 0.72rem;
  padding: 0.3rem 0.6rem;
}
.component-doc-viewer__toc button:hover {
  border-color: var(--rd-color-primary);
  color: var(--rd-color-primary);
}
.component-doc-viewer__toc-button--active,
.component-doc-viewer__toc button.component-doc-viewer__toc-button--active {
  background: color-mix(in srgb, var(--rd-color-primary) 14%, var(--rd-color-surface));
  border-color: color-mix(in srgb, var(--rd-color-primary) 45%, var(--rd-color-border));
  color: var(--rd-color-primary);
  font-weight: 600;
}
.component-doc-viewer__intro p {
  color: var(--rd-color-text);
  font-size: 0.86rem;
  line-height: 1.55;
  margin: 0;
  max-width: 42rem;
  opacity: 0.82;
}

@media (max-width: 1100px) {
  .component-doc-viewer__toc--inline {
    display: flex;
  }
}
</style>

<style>
.rd-markdown-doc {
  color: var(--rd-color-text);
  font-size: 0.9rem;
  line-height: 1.7;
  width: 100%;
}
.rd-markdown-doc > h1:first-of-type {
  display: none;
}
.rd-markdown-doc h1,
.rd-markdown-doc h2,
.rd-markdown-doc h3 {
  color: var(--rd-color-text);
  font-family: var(--docs-display);
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 1.6rem 0 0.7rem;
}
.rd-markdown-doc h1 {
  font-size: 1.6rem;
}
.rd-markdown-doc h2 {
  font-size: 1.25rem;
}
.rd-markdown-doc h3 {
  font-size: 1.05rem;
}
.rd-markdown-doc p,
.rd-markdown-doc ul,
.rd-markdown-doc ol,
.rd-markdown-doc li,
.rd-markdown-doc blockquote {
  color: var(--rd-color-text);
  margin: 0.55rem 0;
}
.rd-markdown-doc a {
  color: var(--rd-color-primary);
}
.rd-markdown-doc code {
  background: color-mix(in srgb, var(--rd-color-primary) 10%, var(--rd-color-surface));
  border-radius: var(--rd-radius-sm);
  color: var(--rd-color-text);
  font-family: ui-monospace, monospace;
  font-size: 0.82em;
  padding: 0.12rem 0.35rem;
}
.rd-markdown-doc pre {
  background: color-mix(in srgb, var(--rd-color-text) 7%, var(--rd-color-surface));
  border: 1px solid var(--rd-color-border);
  border-radius: var(--rd-radius-md);
  overflow-x: auto;
  padding: var(--rd-space-4);
}
.rd-markdown-doc .rd-code-block {
  margin: 1rem 0 1.5rem;
  position: relative;
}
.rd-markdown-doc .rd-code-block > pre {
  margin: 0;
  padding-right: 4.25rem;
}
.rd-markdown-doc .rd-code-block__copy {
  background: color-mix(in srgb, var(--rd-color-surface) 88%, transparent);
  border: 1px solid var(--rd-color-border);
  border-radius: var(--rd-radius-sm);
  color: var(--rd-color-text-muted);
  cursor: pointer;
  font-family: var(--docs-body);
  font-size: 0.72rem;
  line-height: 1;
  padding: 0.35rem 0.55rem;
  position: absolute;
  right: 0.55rem;
  top: 0.55rem;
  z-index: 1;
}
.rd-markdown-doc .rd-code-block__copy:hover {
  border-color: color-mix(in srgb, var(--rd-color-primary) 40%, var(--rd-color-border));
  color: var(--rd-color-primary);
}
.rd-markdown-doc .rd-code-block__copy[data-copied='true'] {
  border-color: color-mix(in srgb, var(--rd-color-success, #16a34a) 45%, var(--rd-color-border));
  color: var(--rd-color-success, #16a34a);
}
.rd-markdown-doc pre code {
  background: transparent;
  padding: 0;
}
.rd-markdown-doc > table {
  border-collapse: collapse;
  font-size: 0.9rem;
  margin: 1rem 0 1.5rem;
  min-width: 100%;
  width: 100%;
}
.rd-markdown-doc th,
.rd-markdown-doc td {
  border-bottom: 1px solid var(--rd-color-border);
  color: var(--rd-color-text);
  line-height: 1.55;
  padding: 0.85rem 0.75rem;
  text-align: left;
  vertical-align: top;
}
.rd-markdown-doc thead th {
  background: color-mix(in srgb, var(--rd-color-text) 6%, var(--rd-color-surface));
  color: var(--rd-color-text);
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 1;
  text-transform: uppercase;
}
.rd-markdown-doc tbody td {
  color: var(--rd-color-text);
  opacity: 1;
}
.rd-markdown-doc tbody td code {
  color: var(--rd-color-primary);
  font-weight: 600;
}

/* Shiki dual theme：跟随 documentElement[data-theme] */
.rd-markdown-doc .shiki,
.rd-markdown-doc .shiki span {
  background-color: transparent !important;
  color: var(--shiki-light);
  font-style: var(--shiki-light-font-style);
  font-weight: var(--shiki-light-font-weight);
  text-decoration: var(--shiki-light-text-decoration);
}
html[data-theme='dark'] .rd-markdown-doc .shiki,
html[data-theme='dark'] .rd-markdown-doc .shiki span {
  color: var(--shiki-dark);
  font-style: var(--shiki-dark-font-style);
  font-weight: var(--shiki-dark-font-weight);
  text-decoration: var(--shiki-dark-text-decoration);
}
.rd-markdown-doc pre.shiki {
  background: color-mix(in srgb, var(--rd-color-text) 7%, var(--rd-color-surface)) !important;
}
</style>
