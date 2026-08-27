<script setup lang="ts">
import type { ResolvedComponentDoc } from '../docs/loadComponentDocs'
import { computed, ref } from 'vue'
import { useDocCodeCopy } from '../composables/useDocCodeCopy'

const props = defineProps<{
  doc: ResolvedComponentDoc
}>()

const bodyRef = ref<HTMLElement | null>(null)
const docSource = computed(() => props.doc)
useDocCodeCopy(bodyRef, docSource)
</script>

<template>
  <section class="component-doc-viewer">
    <div class="component-doc-viewer__intro">
      <span v-if="doc.frontmatter.category" class="component-doc-viewer__label">{{ doc.frontmatter.category }}</span>
      <h2>{{ doc.frontmatter.title || doc.name }}</h2>
      <p v-if="doc.frontmatter.description">
        {{ doc.frontmatter.description }}
      </p>
    </div>
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
.component-doc-viewer__intro p {
  color: var(--wi-color-text);
  font-size: 0.86rem;
  line-height: 1.55;
  margin: 0;
  max-width: 42rem;
  opacity: 0.82;
}
</style>

<style>
.wi-markdown-doc {
  color: var(--wi-color-text);
  font-size: 0.9rem;
  line-height: 1.7;
  width: 100%;
}
.wi-markdown-doc > h1:first-of-type {
  display: none;
}
.wi-markdown-doc h1,
.wi-markdown-doc h2,
.wi-markdown-doc h3 {
  color: var(--wi-color-text);
  font-family: var(--docs-display);
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 1.6rem 0 0.7rem;
}
.wi-markdown-doc h1 {
  font-size: 1.6rem;
}
.wi-markdown-doc h2 {
  font-size: 1.25rem;
}
.wi-markdown-doc h3 {
  font-size: 1.05rem;
}
.wi-markdown-doc p,
.wi-markdown-doc ul,
.wi-markdown-doc ol,
.wi-markdown-doc li,
.wi-markdown-doc blockquote {
  color: var(--wi-color-text);
  margin: 0.55rem 0;
}
.wi-markdown-doc a {
  color: var(--wi-color-primary);
}
.wi-markdown-doc code {
  background: color-mix(in srgb, var(--wi-color-primary) 10%, var(--wi-color-surface));
  border-radius: var(--wi-radius-sm);
  color: var(--wi-color-text);
  font-family: ui-monospace, monospace;
  font-size: 0.82em;
  padding: 0.12rem 0.35rem;
}
.wi-markdown-doc pre {
  background: color-mix(in srgb, var(--wi-color-text) 7%, var(--wi-color-surface));
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
  overflow-x: auto;
  padding: var(--wi-space-4);
}
.wi-markdown-doc .wi-code-block {
  margin: 1rem 0 1.5rem;
  position: relative;
}
.wi-markdown-doc .wi-code-block > pre {
  margin: 0;
  padding-right: 4.25rem;
}
.wi-markdown-doc .wi-code-block__copy {
  background: color-mix(in srgb, var(--wi-color-surface) 88%, transparent);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-sm);
  color: var(--wi-color-text-muted);
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
.wi-markdown-doc .wi-code-block__copy:hover {
  border-color: color-mix(in srgb, var(--wi-color-primary) 40%, var(--wi-color-border));
  color: var(--wi-color-primary);
}
.wi-markdown-doc .wi-code-block__copy[data-copied='true'] {
  border-color: color-mix(in srgb, var(--wi-color-success, #16a34a) 45%, var(--wi-color-border));
  color: var(--wi-color-success, #16a34a);
}
.wi-markdown-doc pre code {
  background: transparent;
  padding: 0;
}
.wi-markdown-doc table {
  border-collapse: collapse;
  font-size: 0.9rem;
  margin: 1rem 0 1.5rem;
  min-width: 100%;
  width: 100%;
}
.wi-markdown-doc th,
.wi-markdown-doc td {
  border-bottom: 1px solid var(--wi-color-border);
  color: var(--wi-color-text);
  line-height: 1.55;
  padding: 0.85rem 0.75rem;
  text-align: left;
  vertical-align: top;
}
.wi-markdown-doc thead th {
  background: color-mix(in srgb, var(--wi-color-text) 6%, var(--wi-color-surface));
  color: var(--wi-color-text);
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  opacity: 1;
  text-transform: uppercase;
}
.wi-markdown-doc tbody td {
  color: var(--wi-color-text);
  opacity: 1;
}
.wi-markdown-doc tbody td code {
  color: var(--wi-color-primary);
  font-weight: 600;
}

/* Shiki dual theme：跟随 documentElement[data-theme] */
.wi-markdown-doc .shiki,
.wi-markdown-doc .shiki span {
  background-color: transparent !important;
  color: var(--shiki-light);
  font-style: var(--shiki-light-font-style);
  font-weight: var(--shiki-light-font-weight);
  text-decoration: var(--shiki-light-text-decoration);
}
html[data-theme='dark'] .wi-markdown-doc .shiki,
html[data-theme='dark'] .wi-markdown-doc .shiki span {
  color: var(--shiki-dark);
  font-style: var(--shiki-dark-font-style);
  font-weight: var(--shiki-dark-font-weight);
  text-decoration: var(--shiki-dark-text-decoration);
}
.wi-markdown-doc pre.shiki {
  background: color-mix(in srgb, var(--wi-color-text) 7%, var(--wi-color-surface)) !important;
}
</style>
