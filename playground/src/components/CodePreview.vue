<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { WiIcon } from '@well-insight/ui'
import { useDocsI18n } from '../i18n'
import { copyText } from '../utils/copyText'

const props = defineProps<{
  lang?: string
  meta?: string
  code?: string
}>()

const highlightEl = ref<HTMLElement | null>(null)
const copied = ref(false)
const { t } = useDocsI18n()
let resetTimer = 0

const label = computed(() => (copied.value ? t.value.copied : t.value.copy))

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
      <slot />
    </div>
    <details class="code-preview__code">
      <summary>
        <span class="code-preview__summary-label">{{ t.viewCode }} <em>{{ lang || 'vue' }}</em></span>
        <button
          type="button"
          class="code-preview__copy"
          :data-copied="copied ? 'true' : 'false'"
          :aria-label="label"
          @click="onCopy"
        >
          <WiIcon :name="copied ? 'check' : 'copy'" size="sm" />
          <span>{{ label }}</span>
        </button>
      </summary>
      <div v-if="$slots.code" ref="highlightEl" class="code-preview__highlight">
        <slot name="code" />
      </div>
      <pre v-else class="code-preview__fallback"><code>{{ code }}</code></pre>
    </details>
  </section>
</template>

<style scoped>
.code-preview {
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-md);
  margin: 1.25rem 0 1.75rem;
  overflow: hidden;
}
.code-preview__demo {
  align-items: center;
  background: color-mix(in srgb, var(--wi-color-primary) 4%, var(--wi-color-surface));
  display: flex;
  flex-wrap: wrap;
  gap: var(--wi-space-3);
  min-height: 7rem;
  padding: var(--wi-space-4);
}
.code-preview__demo :deep(.wi-splitter) {
  align-self: stretch;
  flex: 1 1 100%;
  width: 100%;
}
.code-preview__code summary {
  align-items: center;
  border-top: 1px solid var(--wi-color-border);
  color: var(--wi-color-text);
  cursor: pointer;
  display: flex;
  font-size: 0.78rem;
  gap: 0.75rem;
  justify-content: space-between;
  list-style: none;
  padding: var(--wi-space-3) var(--wi-space-4);
}
.code-preview__code summary::-webkit-details-marker {
  display: none;
}
.code-preview__summary-label {
  align-items: center;
  display: inline-flex;
  gap: 0.55rem;
}
.code-preview__summary-label em {
  color: var(--wi-color-text-muted);
  font-family: ui-monospace, monospace;
  font-size: 0.65rem;
  font-style: normal;
  text-transform: uppercase;
}
.code-preview__copy {
  align-items: center;
  background: color-mix(in srgb, var(--wi-color-surface) 80%, transparent);
  border: 1px solid var(--wi-color-border);
  border-radius: var(--wi-radius-sm);
  color: var(--wi-color-text-muted);
  cursor: pointer;
  display: inline-flex;
  font-size: 0.72rem;
  gap: 0.3rem;
  padding: 0.28rem 0.55rem;
}
.code-preview__copy:hover {
  border-color: color-mix(in srgb, var(--wi-color-primary) 40%, var(--wi-color-border));
  color: var(--wi-color-primary);
}
.code-preview__copy[data-copied='true'] {
  border-color: color-mix(in srgb, var(--wi-color-success, #16a34a) 45%, var(--wi-color-border));
  color: var(--wi-color-success, #16a34a);
}
.code-preview__highlight,
.code-preview__fallback {
  background: color-mix(in srgb, var(--wi-color-text) 7%, var(--wi-color-surface));
  border-top: 1px solid var(--wi-color-border);
  margin: 0;
  overflow-x: auto;
  padding: var(--wi-space-4);
}
.code-preview__fallback {
  color: var(--wi-color-text);
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  line-height: 1.6;
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
  margin: 0;
  overflow-x: visible;
  padding: 0;
}
.code-preview__highlight :deep(code),
.code-preview__highlight :deep(.shiki code) {
  background: transparent;
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  line-height: 1.6;
  padding: 0;
  white-space: pre;
}
</style>
