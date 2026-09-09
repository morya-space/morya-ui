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
              <th scope="col">{{ t.tokenCatalogColumnToken }}</th>
              <th scope="col">{{ t.tokenCatalogColumnPreview }}</th>
              <th scope="col">{{ t.tokenCatalogColumnDefault }}</th>
              <th scope="col">{{ t.tokenCatalogColumnDark }}</th>
              <th scope="col">{{ t.tokenCatalogColumnUsage }}</th>
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
  gap: 1rem;
  margin-top: 1rem;
}

.token-catalog__meta,
.token-catalog__hint {
  color: var(--m-color-text-muted);
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0;
}

.token-catalog__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.token-catalog__count {
  color: var(--m-color-text-muted);
  font-size: 0.82rem;
  margin: 0;
}

.token-catalog__group {
  display: grid;
  gap: 0.75rem;
}

.token-catalog__group-head h3 {
  font-size: 1.05rem;
  margin: 0 0 0.25rem;
}

.token-catalog__group-head p {
  color: var(--m-color-text-muted);
  font-size: 0.88rem;
  line-height: 1.55;
  margin: 0;
}

.token-catalog__table-wrap {
  border: 1px solid var(--m-color-border);
  border-radius: var(--m-radius-md);
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
  border-bottom: 1px solid color-mix(in srgb, var(--m-color-border) 80%, transparent);
  padding: 0.65rem 0.75rem;
  text-align: left;
  vertical-align: top;
}

.token-catalog__table th {
  background: color-mix(in srgb, var(--m-color-text) 4%, var(--m-color-surface));
  color: var(--m-color-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.token-catalog__table tbody tr:last-child td {
  border-bottom: 0;
}

.token-catalog__source {
  color: var(--m-color-text-muted);
  display: block;
  font-size: 0.72rem;
  margin-top: 0.2rem;
}

.token-catalog__preview {
  border-radius: var(--m-radius-sm);
  display: inline-block;
}

.token-catalog__preview--empty {
  color: var(--m-color-text-muted);
}

.token-catalog__variants {
  color: var(--m-color-text-muted);
  display: block;
  font-size: 0.76rem;
  margin-top: 0.35rem;
}

.token-catalog__empty {
  color: var(--m-color-text-muted);
  margin: 0;
}
</style>
