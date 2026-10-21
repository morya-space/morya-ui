<script setup lang="ts">
import type { DocSection } from '../composables/useDocSections'
import type { ResolvedComponentDoc } from '../docs/loadComponentDocs'
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useDocCodeCopy } from '../composables/useDocCodeCopy'
import { useDocSections } from '../composables/useDocSections'
import { useDocTypeLinks } from '../composables/useDocTypeLinks'
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
useDocTypeLinks(bodyRef, docSource)

const categoryLabel = computed(() => {
  const raw = props.doc.frontmatter.category?.trim()
  if (!raw) return ''
  const idx = raw.indexOf('/')
  const key = (idx === -1 ? raw : raw.slice(idx + 1)).trim()
  return t.value.categories[key] ?? key
})

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
    <header class="component-doc-viewer__intro">
      <nav v-if="categoryLabel" class="component-doc-viewer__crumbs" :aria-label="t.breadcrumb">
        <RouterLink :to="{ name: 'components' }">
          {{ t.components }}
        </RouterLink>
        <span class="component-doc-viewer__crumb-sep" aria-hidden="true">/</span>
        <span>{{ categoryLabel }}</span>
        <span class="component-doc-viewer__crumb-sep" aria-hidden="true">/</span>
        <span class="component-doc-viewer__crumb-current">{{ doc.frontmatter.title || doc.name }}</span>
      </nav>
      <h1 class="component-doc-viewer__title">
        {{ doc.frontmatter.title || doc.name }}
      </h1>
      <p v-if="doc.frontmatter.description" class="component-doc-viewer__desc">
        {{ doc.frontmatter.description }}
      </p>
      <div class="component-doc-viewer__stats" aria-live="polite">
        <span>{{ t.examplesCount.replace('{count}', String(exampleCount)) }}</span>
        <span v-if="sections.length">{{ t.sectionsCount.replace('{count}', String(sections.length)) }}</span>
      </div>
    </header>
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
  border-bottom: 1px solid color-mix(in srgb, var(--m-color-border) 65%, transparent);
  margin-bottom: 0.5rem;
  padding-bottom: 1.75rem;
}

.component-doc-viewer__crumbs {
  align-items: center;
  color: var(--m-color-text-muted);
  display: flex;
  flex-wrap: wrap;
  font-family: var(--docs-mono);
  font-size: 0.7rem;
  gap: 0.45rem;
  letter-spacing: 0.02em;
  margin-bottom: 0.85rem;
}

.component-doc-viewer__crumbs a {
  color: inherit;
  text-decoration: none;
  transition: color var(--m-motion-fast) var(--m-motion-ease);
}

.component-doc-viewer__crumbs a:hover {
  color: var(--m-color-primary);
}

.component-doc-viewer__crumb-sep {
  opacity: 0.4;
}

.component-doc-viewer__crumb-current {
  color: var(--m-color-text);
  font-weight: 500;
}

.component-doc-viewer__title {
  font-family: var(--docs-display);
  font-size: clamp(1.9rem, 3.4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.05;
  margin: 0 0 0.9rem;
  text-wrap: balance;
}

.component-doc-viewer__desc {
  color: var(--m-color-text-muted);
  font-size: 1.05rem;
  line-height: 1.65;
  margin: 0;
}

.component-doc-viewer__stats {
  color: var(--m-color-text-muted);
  display: flex;
  flex-wrap: wrap;
  font-family: var(--docs-mono);
  font-size: 0.68rem;
  gap: 0.45rem 0.85rem;
  margin-top: 1rem;
}

.component-doc-viewer__stats span {
  align-items: center;
  background: var(--docs-surface-subtle);
  border: 1px solid var(--docs-edge);
  border-radius: 999px;
  display: inline-flex;
  line-height: 1;
  padding: 0.32rem 0.65rem;
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
  background: color-mix(in srgb, var(--m-color-primary) 7%, var(--m-color-surface));
  border: 1px solid var(--docs-edge);
  border-radius: 999px;
  color: var(--m-color-text-muted);
  cursor: pointer;
  font-size: 0.72rem;
  padding: 0.3rem 0.6rem;
  transition:
    background-color var(--m-motion-fast) var(--m-motion-ease),
    border-color var(--m-motion-fast) var(--m-motion-ease),
    color var(--m-motion-fast) var(--m-motion-ease);
}

.component-doc-viewer__toc button:hover {
  border-color: var(--m-color-primary);
  color: var(--m-color-primary);
}

.component-doc-viewer__toc-button--active,
.component-doc-viewer__toc button.component-doc-viewer__toc-button--active {
  background: color-mix(in srgb, var(--m-color-primary) 14%, var(--m-color-surface));
  border-color: color-mix(in srgb, var(--m-color-primary) 45%, var(--m-color-border));
  color: var(--m-color-primary);
  font-weight: 600;
}

@media (max-width: 1100px) {
  .component-doc-viewer__toc--inline {
    display: flex;
  }
}
</style>

<style>
/*
 * All rules use `>` direct-child selectors so they only apply to elements that
 * markdown-it renders as top-level blocks. Embedded demos (`.m-demo-preview`,
 * live components like MDialog/MTable) live deeper in the tree and must not be
 * styled by these document rules.
 */
.m-markdown-doc {
  color: var(--m-color-text);
  font-size: 0.9375rem;
  line-height: 1.75;
  width: 100%;
}
.m-markdown-doc > h1:first-of-type {
  display: none;
}
.m-markdown-doc > h1,
.m-markdown-doc > h2,
.m-markdown-doc > h3,
.m-markdown-doc > h4,
.m-markdown-doc > h5,
.m-markdown-doc > h6 {
  color: var(--m-color-text);
  font-family: var(--docs-display);
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 2.25rem 0 0.75rem;
  text-wrap: balance;
}
.m-markdown-doc > h1 {
  font-size: 1.5rem;
}
.m-markdown-doc > h2 {
  border-bottom: 1px solid color-mix(in srgb, var(--m-color-border) 60%, transparent);
  font-size: 1.25rem;
  padding-bottom: 0.45rem;
}
.m-markdown-doc > h3 {
  font-size: 1.05rem;
  font-weight: 600;
}
.m-markdown-doc > h4 {
  font-size: 0.95rem;
}
.m-markdown-doc > p,
.m-markdown-doc > ul,
.m-markdown-doc > ol,
.m-markdown-doc > blockquote {
  color: var(--m-color-text);
  margin: 0.75rem 0;
}
.m-markdown-doc > ul > li,
.m-markdown-doc > ol > li {
  color: var(--m-color-text);
  margin: 0.375rem 0;
}
.m-markdown-doc p > a,
.m-markdown-doc li > a,
.m-markdown-doc td > a,
.m-markdown-doc th > a {
  color: var(--m-color-primary);
  text-decoration: none;
  text-underline-offset: 0.15em;
  transition: color var(--m-motion-fast) var(--m-motion-ease);
}
.m-markdown-doc p > a:hover,
.m-markdown-doc li > a:hover,
.m-markdown-doc td > a:hover,
.m-markdown-doc th > a:hover {
  text-decoration: underline;
}
.m-markdown-doc p > code,
.m-markdown-doc li > code,
.m-markdown-doc td > code,
.m-markdown-doc th > code,
.m-markdown-doc h1 > code,
.m-markdown-doc h2 > code,
.m-markdown-doc h3 > code,
.m-markdown-doc h4 > code {
  background: color-mix(in srgb, var(--m-color-primary) 8%, var(--m-color-surface));
  border: 1px solid color-mix(in srgb, var(--m-color-primary) 14%, transparent);
  border-radius: 0.35rem;
  color: color-mix(in srgb, var(--m-color-primary) 78%, var(--m-color-text));
  font-family: var(--docs-mono);
  font-size: 0.82em;
  font-weight: 500;
  padding: 0.14rem 0.38rem;
}
.m-markdown-doc > pre {
  background: var(--docs-surface-raised);
  border: 1px solid color-mix(in srgb, var(--m-color-border) 70%, transparent);
  border-radius: var(--m-radius-lg, 0.75rem);
  overflow-x: auto;
  padding: var(--m-space-4);
}
.m-markdown-doc > .m-code-block {
  margin: 1.25rem 0 1.75rem;
  position: relative;
}
.m-markdown-doc > .m-code-block > pre {
  margin: 0;
  padding-right: 4.25rem;
}
.m-markdown-doc > .m-code-block > .m-code-block__copy {
  background: color-mix(in srgb, var(--m-color-surface) 88%, transparent);
  border: 1px solid color-mix(in srgb, var(--m-color-border) 75%, transparent);
  border-radius: var(--m-radius-sm);
  color: var(--m-color-text-muted);
  cursor: pointer;
  font-family: var(--docs-body);
  font-size: 0.72rem;
  line-height: 1;
  padding: 0.35rem 0.55rem;
  position: absolute;
  right: 0.55rem;
  top: 0.55rem;
  transition:
    border-color var(--m-motion-fast) var(--m-motion-ease),
    color var(--m-motion-fast) var(--m-motion-ease);
  z-index: 1;
}
.m-markdown-doc > .m-code-block > .m-code-block__copy:hover {
  border-color: color-mix(in srgb, var(--m-color-primary) 40%, var(--m-color-border));
  color: var(--m-color-primary);
}
.m-markdown-doc > .m-code-block > .m-code-block__copy[data-copied='true'] {
  border-color: color-mix(in srgb, var(--m-color-success, #16a34a) 45%, var(--m-color-border));
  color: var(--m-color-success, #16a34a);
}
.m-markdown-doc > pre > code {
  background: transparent;
  border: 0;
  padding: 0;
}
.m-markdown-doc > table {
  border-collapse: collapse;
  font-size: 0.875rem;
  margin: 1.25rem 0 1.75rem;
  min-width: 100%;
  width: 100%;
}
.m-markdown-doc > table > thead > tr > th,
.m-markdown-doc > table > tbody > tr > td {
  border-bottom: 1px solid color-mix(in srgb, var(--m-color-border) 70%, transparent);
  color: var(--m-color-text);
  line-height: 1.6;
  padding: 0.9rem 0.8rem;
  text-align: left;
  vertical-align: top;
}
.m-markdown-doc > h3[id],
.m-markdown-doc > h4[id] {
  scroll-margin-top: 4.5rem;
}
.m-markdown-doc > h4[id] {
  font-size: 0.95rem;
  margin-top: 1.5rem;
}
.m-markdown-doc > table > thead > tr > th {
  background: var(--docs-surface-sunken);
  color: var(--m-color-text-muted);
  font-family: var(--docs-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  opacity: 1;
  text-transform: none;
}
.m-markdown-doc > table > tbody > tr {
  transition: background-color var(--m-motion-fast) var(--m-motion-ease);
}
/* Subtle zebra so wide API tables stay scannable */
.m-markdown-doc > table > tbody > tr:nth-child(even) {
  background: color-mix(in srgb, var(--m-color-text) 1.5%, transparent);
}
.m-markdown-doc > table > tbody > tr:hover {
  background: color-mix(in srgb, var(--m-color-primary) 4%, transparent);
}
.m-markdown-doc > table > tbody > tr > td {
  color: var(--m-color-text);
  opacity: 1;
}
.m-markdown-doc > table > tbody > tr > td > code {
  color: var(--m-color-primary);
  font-weight: 600;
}
.m-markdown-doc a.m-doc-type-link {
  color: var(--m-color-primary);
  font-weight: 600;
  text-decoration: none;
}
.m-markdown-doc a.m-doc-type-link:hover {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.m-markdown-doc a.m-doc-type-link code {
  color: inherit;
  cursor: pointer;
  font-weight: inherit;
}

/* Shiki dual theme：跟随 documentElement[data-theme] */
.m-markdown-doc .shiki,
.m-markdown-doc .shiki span {
  background-color: transparent !important;
  color: var(--shiki-light);
  font-style: var(--shiki-light-font-style);
  font-weight: var(--shiki-light-font-weight);
  text-decoration: var(--shiki-light-text-decoration);
}
html[data-theme='dark'] .m-markdown-doc .shiki,
html[data-theme='dark'] .m-markdown-doc .shiki span {
  color: var(--shiki-dark);
  font-style: var(--shiki-dark-font-style);
  font-weight: var(--shiki-dark-font-weight);
  text-decoration: var(--shiki-dark-text-decoration);
}
.m-markdown-doc pre.shiki {
  background: var(--docs-surface-raised) !important;
}
</style>
