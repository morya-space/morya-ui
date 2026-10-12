<script setup lang="ts">
import { MIcon } from 'morya-ui'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useDocsI18n } from '../i18n'
import { copyText } from '../utils/copyText'

const props = defineProps<{
  lang?: string
  meta?: string
  code?: string
}>()

const highlightEl = ref<HTMLElement | null>(null)
const copied = ref(false)
const codeOpen = ref(false)
const { t } = useDocsI18n()
let resetTimer = 0

const copyLabel = computed(() => (copied.value ? t.value.copied : t.value.copy))
const codeLabel = computed(() => (codeOpen.value ? t.value.hideCode : t.value.viewCode))
const fileName = computed(() => `${props.lang || 'vue'}.${props.lang || 'vue'}`)

async function onCopy(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()

  const fromSlot = highlightEl.value?.textContent ?? ''
  const ok = await copyText(props.code || fromSlot)
  if (!ok) return

  copied.value = true
  window.clearTimeout(resetTimer)
  resetTimer = window.setTimeout(() => {
    copied.value = false
  }, 1600)
}

onBeforeUnmount(() => {
  window.clearTimeout(resetTimer)
})
</script>

<template>
  <section class="code-preview">
    <div class="code-preview__demo">
      <span class="code-preview__demo-tag" aria-hidden="true">Preview</span>
      <slot />
    </div>
    <div class="code-preview__bar">
      <span class="code-preview__file">
        <MIcon name="file" size="sm" aria-hidden="true" />
        <span class="code-preview__file-name">{{ fileName }}</span>
      </span>
      <div class="code-preview__tools">
        <button
          type="button"
          class="code-preview__copy"
          :data-copied="copied ? 'true' : 'false'"
          :aria-label="copyLabel"
          @click="onCopy"
        >
          <MIcon :name="copied ? 'check' : 'copy'" size="sm" />
          <span>{{ copyLabel }}</span>
        </button>
        <button
          type="button"
          class="code-preview__toggle"
          :aria-expanded="codeOpen"
          @click="codeOpen = !codeOpen"
        >
          <MIcon name="chevron-down" size="sm" class="code-preview__toggle-icon" :class="{ 'is-open': codeOpen }" />
          <span>{{ codeLabel }}</span>
        </button>
      </div>
    </div>
    <div v-show="codeOpen" class="code-preview__code">
      <div v-if="$slots.code" ref="highlightEl" class="code-preview__highlight">
        <slot name="code" />
      </div>
      <pre v-else class="code-preview__fallback"><code>{{ code }}</code></pre>
    </div>
  </section>
</template>

<style scoped>
.code-preview {
  background: var(--m-color-surface);
  border: 1px solid color-mix(in srgb, var(--m-color-border) 70%, transparent);
  border-radius: var(--m-radius-lg, 0.75rem);
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--m-color-text) 3%, transparent),
    0 4px 16px -4px color-mix(in srgb, var(--m-color-text) 4%, transparent);
  margin: 1.5rem 0 2rem;
  overflow: hidden;
  transition:
    border-color var(--m-motion-normal) var(--m-motion-ease),
    box-shadow var(--m-motion-normal) var(--m-motion-ease);
}

.code-preview:hover {
  border-color: color-mix(in srgb, var(--m-color-border) 90%, transparent);
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--m-color-text) 4%, transparent),
    0 8px 24px -6px color-mix(in srgb, var(--m-color-text) 6%, transparent);
}

.code-preview__demo {
  align-items: center;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--m-color-primary) 6%, transparent) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 0% 100%,
      color-mix(in srgb, var(--m-color-primary) 3%, transparent) 0%,
      transparent 45%
    ),
    var(--m-color-surface);
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-3);
  min-height: 9rem;
  padding: calc(var(--m-space-4) + 1.75rem) var(--m-space-4) var(--m-space-4);
  position: relative;
}

.code-preview__demo-tag {
  background: color-mix(in srgb, var(--m-color-surface) 85%, transparent);
  border: 1px solid color-mix(in srgb, var(--m-color-border) 75%, transparent);
  border-radius: 999px;
  color: var(--m-color-text-muted);
  font-family: var(--docs-mono);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1;
  padding: 0.28rem 0.6rem;
  position: absolute;
  right: var(--m-space-3);
  text-transform: uppercase;
  top: var(--m-space-3);
  z-index: 1;
}

.code-preview__demo :deep(.m-splitter),
.code-preview__demo :deep(.m-page-content),
.code-preview__demo :deep(.doc-demo-frame) {
  align-self: stretch;
  flex: 1 1 100%;
  width: 100%;
}

.code-preview__bar {
  align-items: center;
  background: color-mix(in srgb, var(--m-color-text) 2%, var(--m-color-surface));
  border-top: 1px solid color-mix(in srgb, var(--m-color-border) 65%, transparent);
  display: flex;
  justify-content: space-between;
  padding: var(--m-space-2, 0.5rem) var(--m-space-3);
}

.code-preview__file {
  align-items: center;
  color: var(--m-color-text-muted);
  display: inline-flex;
  font-family: var(--docs-mono);
  font-size: 0.72rem;
  gap: 0.45rem;
  min-width: 0;
}

.code-preview__file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.code-preview__tools {
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 0.35rem;
}

.code-preview__copy,
.code-preview__toggle {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--m-radius-sm);
  color: var(--m-color-text-muted);
  cursor: pointer;
  display: inline-flex;
  font-size: 0.72rem;
  gap: 0.3rem;
  line-height: 1;
  padding: 0.3rem 0.5rem;
  transition:
    background-color var(--m-motion-fast) var(--m-motion-ease),
    border-color var(--m-motion-fast) var(--m-motion-ease),
    color var(--m-motion-fast) var(--m-motion-ease);
}

.code-preview__copy:hover,
.code-preview__toggle:hover {
  background: color-mix(in srgb, var(--m-color-primary) 8%, transparent);
  border-color: color-mix(in srgb, var(--m-color-primary) 25%, transparent);
  color: var(--m-color-primary);
}

.code-preview__copy:active,
.code-preview__toggle:active {
  transform: scale(0.97);
}

.code-preview__copy[data-copied='true'] {
  background: color-mix(in srgb, var(--m-color-success, #16a34a) 10%, transparent);
  border-color: color-mix(in srgb, var(--m-color-success, #16a34a) 30%, transparent);
  color: var(--m-color-success, #16a34a);
}

.code-preview__toggle-icon {
  transition: transform var(--m-motion-fast) var(--m-motion-ease);
}

.code-preview__toggle-icon.is-open {
  transform: rotate(180deg);
}

.code-preview__code {
  border-top: 1px solid color-mix(in srgb, var(--m-color-border) 65%, transparent);
}

.code-preview__highlight,
.code-preview__fallback {
  background: color-mix(in srgb, var(--m-color-text) 3.5%, var(--m-color-surface));
  margin: 0;
  overflow-x: auto;
  padding: var(--m-space-4) var(--m-space-4) var(--m-space-4) 0;
}

.code-preview__fallback {
  color: var(--m-color-text);
  font-family: var(--docs-mono);
  font-size: 0.75rem;
  line-height: 1.6;
  padding-left: var(--m-space-4);
  white-space: pre;
}

.code-preview__fallback code {
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0;
}

.code-preview__highlight :deep(pre),
.code-preview__highlight :deep(.shiki) {
  background: transparent !important;
  counter-reset: code-line;
  margin: 0;
  overflow-x: visible;
  padding: 0;
}

.code-preview__highlight :deep(code),
.code-preview__highlight :deep(.shiki code) {
  background: transparent;
  font-family: var(--docs-mono);
  font-size: 0.75rem;
  line-height: 1.6;
  padding: 0;
  white-space: pre;
}

.code-preview__highlight :deep(.shiki .line::before) {
  background: color-mix(in srgb, var(--m-color-text) 3.5%, var(--m-color-surface));
  box-sizing: border-box;
  color: var(--m-color-text-muted);
  content: counter(code-line);
  counter-increment: code-line;
  display: inline-block;
  font-variant-numeric: tabular-nums;
  left: 0;
  margin-right: 0.85rem;
  opacity: 0.45;
  padding-left: var(--m-space-3);
  padding-right: 0.65rem;
  position: sticky;
  text-align: right;
  user-select: none;
  width: 2.75rem;
}

@media (max-width: 620px) {
  .code-preview__demo {
    padding: calc(var(--m-space-3) + 1.75rem) var(--m-space-3) var(--m-space-3);
  }

  .code-preview__file-name {
    max-width: 7rem;
  }
}
</style>
