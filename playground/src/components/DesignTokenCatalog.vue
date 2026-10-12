<script setup lang="ts">
import { MInput, MSelect } from 'morya-ui'
import { computed, ref } from 'vue'
import catalog from '../data/design-tokens.json'
import { useDocsI18n } from '../i18n'

interface TokenRecord {
  name: string
  category: string
  source: string
  default: string
  dark?: string
  variants?: Record<string, string>
  description: Record<'zh-CN' | 'en-US', string>
}

interface CategoryRecord {
  id: string
  order: number
  title: Record<'zh-CN' | 'en-US', string>
  description: Record<'zh-CN' | 'en-US', string>
}

const { lang, t } = useDocsI18n()
const query = ref('')
const category = ref<string>('all')

const categories = computed(() =>
  (catalog.categories as CategoryRecord[]).slice().sort((a, b) => a.order - b.order),
)

const categoryOptions = computed(() => [
  { label: t.value.tokenCatalogAllCategories, value: 'all' },
  ...categories.value.map((item) => ({
    label: item.title[lang.value],
    value: item.id,
  })),
])

const filteredTokens = computed(() => {
  const q = query.value.trim().toLowerCase()
  return (catalog.tokens as TokenRecord[]).filter((token) => {
    if (category.value !== 'all' && token.category !== category.value) return false
    if (!q) return true
    const description = token.description[lang.value].toLowerCase()
    return token.name.toLowerCase().includes(q) || description.includes(q) || token.source.toLowerCase().includes(q)
  })
})

const groupedTokens = computed(() => {
  const groups = new Map<string, TokenRecord[]>()
  for (const token of filteredTokens.value) {
    const list = groups.get(token.category) ?? []
    list.push(token)
    groups.set(token.category, list)
  }
  return categories.value
    .filter((item) => groups.has(item.id))
    .map((item) => ({
      category: item,
      tokens: groups.get(item.id) ?? [],
    }))
})

function categoryTitle(id: string) {
  return categories.value.find((item) => item.id === id)?.title[lang.value] ?? id
}

function isColorToken(name: string, value: string) {
  if (!name.includes('color') && !name.includes('scrim') && !name.includes('fill')) return false
  if (value.startsWith('var(')) return false
  return /^(#|rgb|hsl|color-mix)/.test(value)
}

function previewStyle(name: string, value: string) {
  if (isColorToken(name, value)) {
    return { background: `var(${name})`, border: '1px solid var(--m-color-border)' }
  }
  if (name.includes('space-') || name.includes('height') || name.includes('width') || name.includes('size')) {
    const numeric = Number.parseFloat(value)
    if (!Number.isNaN(numeric)) {
      const px = value.endsWith('rem') ? numeric * 16 : numeric
      return { width: `${Math.min(Math.max(px, 8), 96)}px`, height: '12px', background: 'var(--m-color-primary)' }
    }
  }
  if (name.includes('radius')) {
    return {
      width: '28px',
      height: '28px',
      background: 'color-mix(in srgb, var(--m-color-primary) 18%, transparent)',
      border: '1px solid var(--m-color-primary)',
      borderRadius: value,
    }
  }
  return undefined
}

function formatVariants(variants?: Record<string, string>) {
  if (!variants) return ''
  return Object.entries(variants)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' · ')
}
</script>

<template>
  <section class="token-catalog">
    <div class="token-catalog__meta">
      <p>
        {{ t.tokenCatalogIntro.replace('{count}', String(catalog.tokenCount)) }}
      </p>
      <p class="token-catalog__hint">
        {{ t.tokenCatalogHint }}
      </p>
    </div>

    <div class="token-catalog__toolbar">
      <MInput
        v-model="query"
        clearable
        :placeholder="t.tokenCatalogSearch"
        style="flex: 1 1 16rem"
      />
      <MSelect
        v-model="category"
        :options="categoryOptions"
        style="flex: 0 1 12rem"
      />
    </div>

    <p class="token-catalog__count" aria-live="polite">
      {{ t.tokenCatalogResultCount.replace('{count}', String(filteredTokens.length)) }}
    </p>

    <div v-for="group in groupedTokens" :key="group.category.id" class="token-catalog__group">
      <div class="token-catalog__group-head">
        <h3>{{ group.category.title[lang] }}</h3>
        <p>{{ group.category.description[lang] }}</p>
      </div>

      <div class="token-catalog__table-wrap">
        <table class="token-catalog__table">
          <thead>
            <tr>
              <th scope="col">
                {{ t.tokenCatalogColumnToken }}
              </th>
              <th scope="col">
                {{ t.tokenCatalogColumnPreview }}
              </th>
              <th scope="col">
                {{ t.tokenCatalogColumnDefault }}
              </th>
              <th scope="col">
                {{ t.tokenCatalogColumnDark }}
              </th>
              <th scope="col">
                {{ t.tokenCatalogColumnUsage }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="token in group.tokens" :key="token.name">
              <td>
                <code>{{ token.name }}</code>
                <span class="token-catalog__source">{{ token.source }}</span>
              </td>
              <td>
                <span
                  v-if="previewStyle(token.name, token.default)"
                  class="token-catalog__preview"
                  :style="previewStyle(token.name, token.default)"
                  :aria-label="token.name"
                />
                <span v-else class="token-catalog__preview token-catalog__preview--empty">—</span>
              </td>
              <td><code>{{ token.default }}</code></td>
              <td>
                <code v-if="token.dark">{{ token.dark }}</code>
                <span v-else>—</span>
              </td>
              <td>
                <span>{{ token.description[lang] }}</span>
                <span v-if="token.variants" class="token-catalog__variants">
                  {{ formatVariants(token.variants) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="groupedTokens.length === 0" class="token-catalog__empty">
      {{ t.tokenCatalogEmpty }}
    </p>
  </section>
</template>

<style scoped>
.token-catalog {
  display: grid;
  gap: 1.1rem;
  margin-top: 1.1rem;
}

.token-catalog__meta {
  color: var(--m-color-text-muted);
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 0;
}

.token-catalog__hint {
  border-left: 3px solid var(--docs-primary-edge);
  color: var(--m-color-text-muted);
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
  padding-left: 0.8rem;
}

.token-catalog__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.token-catalog__count {
  background: var(--docs-primary-soft);
  border: 1px solid var(--docs-primary-edge);
  border-radius: 999px;
  color: var(--m-color-primary);
  font-family: var(--docs-mono);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  margin: 0;
  padding: 0.22rem 0.7rem;
  width: fit-content;
}

/* --- group card --- */
.token-catalog__group {
  background: var(--docs-panel);
  border: 1px solid var(--docs-edge);
  border-radius: 1.1rem;
  box-shadow: var(--docs-shadow-card);
  display: grid;
  gap: 0;
  overflow: hidden;
}

.token-catalog__group-head {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--m-color-primary) 4%, transparent),
    transparent 85%
  );
  border-bottom: 1px solid var(--docs-edge);
  padding: 1rem 1.1rem 0.85rem;
}

.token-catalog__group-head h3 {
  font-family: var(--docs-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 0 0 0.2rem;
}

.token-catalog__group-head p {
  color: var(--m-color-text-muted);
  font-size: 0.84rem;
  line-height: 1.6;
  margin: 0;
}

.token-catalog__table-wrap {
  overflow: auto;
}

.token-catalog__table {
  border-collapse: collapse;
  font-size: 0.84rem;
  min-width: 56rem;
  width: 100%;
}

.token-catalog__table th,
.token-catalog__table td {
  border-bottom: 1px solid var(--docs-edge);
  padding: 0.7rem 1.1rem;
  text-align: left;
  vertical-align: middle;
}

.token-catalog__table th {
  background: color-mix(in srgb, var(--m-color-text) 2.5%, var(--m-color-surface));
  color: var(--m-color-text-muted);
  font-family: var(--docs-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.token-catalog__table tbody tr {
  transition: background var(--m-motion-fast) var(--m-motion-ease);
}

.token-catalog__table tbody tr:hover {
  background: color-mix(in srgb, var(--m-color-primary) 3.5%, transparent);
}

.token-catalog__table tbody tr:last-child td {
  border-bottom: 0;
}

.token-catalog__table td > code,
.token-catalog__table td > span > code {
  background: var(--docs-primary-soft);
  border-radius: 0.35rem;
  color: var(--m-color-primary);
  font-family: var(--docs-mono);
  font-size: 0.78em;
  padding: 0.12em 0.45em;
}

.token-catalog__table td:last-child code {
  background: transparent;
  color: var(--m-color-text-muted);
  padding: 0;
}

.token-catalog__source {
  color: var(--m-color-text-muted);
  display: block;
  font-family: var(--docs-mono);
  font-size: 0.68rem;
  margin-top: 0.3rem;
  opacity: 0.75;
}

.token-catalog__preview {
  border-radius: var(--m-radius-sm);
  box-shadow: 0 0 0 1px var(--docs-edge);
  display: inline-block;
  min-height: 1.4rem;
  min-width: 1.4rem;
  vertical-align: middle;
}

.token-catalog__preview--empty {
  box-shadow: none;
  color: var(--m-color-text-muted);
  min-height: 0;
  min-width: 0;
}

.token-catalog__variants {
  color: var(--m-color-text-muted);
  display: block;
  font-family: var(--docs-mono);
  font-size: 0.7rem;
  line-height: 1.6;
  margin-top: 0.35rem;
}

.token-catalog__empty {
  color: var(--m-color-text-muted);
  margin: 0;
}
</style>
