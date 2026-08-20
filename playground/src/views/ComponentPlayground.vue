<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ComponentDocViewer from '../components/ComponentDocViewer.vue'
import {
  listDocumentedComponents,
  resolveComponentDoc,
  type DocumentedComponentMeta,
} from '../docs/loadComponentDocs'
import { useDensity, useMotion, useTheme } from '@well-insight/ui'
import { WiCard, WiIcon, WiScrollbar } from '@well-insight/ui'
import { useDocsI18n } from '../i18n'

const OVERVIEW = '全部组件'
const { lang, t, interpolate } = useDocsI18n()

const route = useRoute()
const search = ref('')
const themeOpen = ref(false)
const accent = ref('blue')
const radius = ref('comfortable')
const { preference: density, setDensity } = useDensity()
const contentScroll = ref<{ setScrollTop: (value: number) => void } | null>(null)
const { preference: motionPreference, setMotion } = useMotion()
const { isDark, setTheme } = useTheme()

const motionOptions = computed(() => [
  { name: 'full', label: t.value.motionFull },
  { name: 'reduced', label: t.value.motionReduced },
  { name: 'none', label: t.value.motionNone },
] as const)

const accentOptions = [
  { name: 'blue', label: 'Ocean', color: '#2563eb', hover: '#1d4ed8' },
  { name: 'violet', label: 'Violet', color: '#7c3aed', hover: '#6d28d9' },
  { name: 'green', label: 'Meadow', color: '#159570', hover: '#0f766e' },
  { name: 'orange', label: 'Ember', color: '#ea580c', hover: '#c2410c' },
] as const

const radiusOptions = computed(() => [
  { name: 'sharp', label: t.value.sharp, values: ['0.125rem', '0.25rem', '0.5rem'] },
  { name: 'comfortable', label: t.value.comfortable, values: ['0.25rem', '0.5rem', '0.75rem'] },
  { name: 'soft', label: t.value.soft, values: ['0.5rem', '0.75rem', '1rem'] },
] as const)

const densityOptions = computed(() => [
  { name: 'compact' as const, label: t.value.compact },
  { name: 'comfortable' as const, label: t.value.comfortable },
  { name: 'spacious' as const, label: t.value.spacious },
])

const documented = computed(() => listDocumentedComponents(lang.value))
const documentedNames = computed(() => documented.value.map((item) => item.name))

const selectedComponent = computed(() => {
  const param = route.params.component
  if (typeof param !== 'string' || !param) return OVERVIEW
  return documentedNames.value.find((name) => name.toLowerCase() === param.toLowerCase()) ?? param
})

function componentRoute(name: string) {
  return name === OVERVIEW
    ? { name: 'components' as const }
    : { name: 'component-doc' as const, params: { component: name } }
}

function categoryTitle(label: string) {
  return t.value.categories[label] ?? label
}

function groupByCategory(items: DocumentedComponentMeta[]) {
  const groups = new Map<string, { order: number; label: string; title: string; items: DocumentedComponentMeta[] }>()

  for (const item of items) {
    const existing = groups.get(item.categoryLabel)
    if (existing) {
      existing.items.push(item)
      continue
    }
    groups.set(item.categoryLabel, {
      order: item.categoryOrder,
      label: item.categoryLabel,
      title: categoryTitle(item.categoryLabel),
      items: [item],
    })
  }

  return [...groups.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
}

function applyPlaygroundTheme() {
  const root = document.documentElement
  const selectedAccent = accentOptions.find((item) => item.name === accent.value) ?? accentOptions[0]
  const selectedRadius = radiusOptions.value.find((item) => item.name === radius.value) ?? radiusOptions.value[1]
  if (!selectedAccent || !selectedRadius) return

  root.style.setProperty('--wi-color-primary', selectedAccent.color)
  root.style.setProperty('--wi-color-primary-hover', selectedAccent.hover)
  root.style.setProperty('--wi-color-focus-ring', selectedAccent.color)
  root.style.setProperty('--wi-radius-sm', selectedRadius.values[0] ?? '0.25rem')
  root.style.setProperty('--wi-radius-md', selectedRadius.values[1] ?? '0.5rem')
  root.style.setProperty('--wi-radius-lg', selectedRadius.values[2] ?? '0.75rem')
  // Density comes from useDensity() → data-wi-density tokens; do not override spaces here.
  root.style.setProperty('--wi-motion-fast', motionPreference.value === 'full' ? '150ms' : motionPreference.value === 'reduced' ? '80ms' : '0ms')
  root.style.setProperty('--wi-motion-normal', motionPreference.value === 'full' ? '250ms' : motionPreference.value === 'reduced' ? '120ms' : '0ms')
}

watch([accent, radius, motionPreference], applyPlaygroundTheme, { immediate: true })

const themeSummary = computed(() => {
  const mode = isDark.value ? 'Dark' : 'Light'
  const accentLabel = accentOptions.find((item) => item.name === accent.value)?.label ?? 'Ocean'
  const densityLabel = densityOptions.value.find((item) => item.name === density.value)?.label ?? t.value.comfortable
  return `${mode} · ${accentLabel} · ${densityLabel}`
})

watch(selectedComponent, async () => {
  await nextTick()
  contentScroll.value?.setScrollTop(0)
})

const activePackageDoc = computed(() => {
  if (selectedComponent.value === OVERVIEW) return null
  return resolveComponentDoc(selectedComponent.value, lang.value)
})

const filteredDocumented = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return documented.value
  return documented.value.filter((component) => {
    const haystack = [
      component.name,
      component.categoryLabel,
      categoryTitle(component.categoryLabel),
      component.description ?? '',
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })
})

const navGroups = computed(() => groupByCategory(filteredDocumented.value))
const overviewGroups = computed(() => groupByCategory(documented.value))
</script>

<template>
  <div class="components-shell">
    <div class="workspace">
      <aside class="sidebar" :aria-label="t.componentNav">
        <WiScrollbar class="column-scroll">
          <div class="sidebar-body">
            <label class="search-box">
              <WiIcon name="search" size="sm" />
              <input v-model="search" type="search" :placeholder="t.filterComponents" :aria-label="t.filterComponents" />
            </label>

            <section class="theme-panel">
              <button
                type="button"
                class="theme-panel__toggle"
                :aria-expanded="themeOpen"
                @click="themeOpen = !themeOpen"
              >
                <span class="theme-panel__title">{{ t.theme }}</span>
                <span class="theme-panel__summary">{{ themeSummary }}</span>
                <span class="theme-panel__chevron" aria-hidden="true">{{ themeOpen ? '▾' : '▸' }}</span>
              </button>
              <div v-show="themeOpen" class="theme-panel__body" aria-labelledby="appearance-title">
                <h2 id="appearance-title" class="sr-only">{{ t.themeSettings }}</h2>
                <div class="setting-group">
                  <span class="setting-label">{{ t.themeMode }}</span>
                  <div class="segmented-control">
                    <button type="button" :class="{ 'is-selected': !isDark }" @click="setTheme('light')">{{ t.light }}</button>
                    <button type="button" :class="{ 'is-selected': isDark }" @click="setTheme('dark')">{{ t.dark }}</button>
                  </div>
                </div>
                <div class="setting-group">
                  <span class="setting-label">{{ t.brandColor }}</span>
                  <div class="accent-list">
                    <button
                      v-for="option in accentOptions"
                      :key="option.name"
                      type="button"
                      class="accent-swatch"
                      :class="{ 'is-selected': accent === option.name }"
                      :style="{ '--swatch-color': option.color }"
                      :aria-label="interpolate(t.useAccent, { label: option.label })"
                      @click="accent = option.name"
                    />
                  </div>
                </div>
                <div class="setting-group">
                  <span class="setting-label">{{ t.radius }}</span>
                  <div class="segmented-control segmented-control--triple" role="group" :aria-label="t.radius">
                    <button
                      v-for="option in radiusOptions"
                      :key="option.name"
                      type="button"
                      :class="{ 'is-selected': radius === option.name }"
                      @click="radius = option.name"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
                <div class="setting-group">
                  <span class="setting-label">{{ t.density }}</span>
                  <div class="segmented-control segmented-control--triple" role="group" :aria-label="t.density">
                    <button
                      v-for="option in densityOptions"
                      :key="option.name"
                      type="button"
                      :class="{ 'is-selected': density === option.name }"
                      @click="setDensity(option.name)"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
                <div class="setting-group motion-setting">
                  <span class="setting-label">{{ t.motion }}</span>
                  <div class="segmented-control segmented-control--triple" role="group" :aria-label="t.motion">
                    <button
                      v-for="option in motionOptions"
                      :key="option.name"
                      type="button"
                      :class="{ 'is-selected': motionPreference === option.name }"
                      @click="setMotion(option.name)"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <nav class="component-nav" :aria-label="t.componentCatalog">
              <RouterLink
                class="nav-item nav-item--overview"
                :class="{ 'nav-item--active': selectedComponent === OVERVIEW }"
                :to="componentRoute(OVERVIEW)"
              >
                <span>{{ t.overview }}</span>
                <span class="nav-count">{{ documented.length }}</span>
              </RouterLink>

              <section v-for="group in navGroups" :key="group.label" class="nav-group">
                <p class="nav-heading">
                  <span>{{ group.title }}</span>
                  <span class="nav-heading__count">{{ group.items.length }}</span>
                </p>
                <RouterLink
                  v-for="component in group.items"
                  :key="component.name"
                  class="nav-item"
                  :class="{ 'nav-item--active': selectedComponent === component.name }"
                  :to="componentRoute(component.name)"
                >
                  <span>{{ component.name }}</span>
                </RouterLink>
              </section>

              <p v-if="navGroups.length === 0" class="empty-search">{{ t.noComponent }}</p>
            </nav>
          </div>
        </WiScrollbar>
      </aside>

      <main class="content">
        <WiScrollbar ref="contentScroll" class="column-scroll">
          <div class="content-body" :class="{ 'content-body--doc': selectedComponent !== OVERVIEW }">
            <template v-if="selectedComponent === OVERVIEW">
              <section class="hero">
                <div>
                  <p class="eyebrow">COMPONENTS / OVERVIEW</p>
                  <h1>{{ t.labTitle }}</h1>
                  <p class="hero-copy">{{ t.labCopy }}</p>
                  <div class="doc-meta"><span>Vue 3</span><span>TypeScript</span><span>Live Preview</span></div>
                </div>
                <div class="hero-glyph" aria-hidden="true"><span>W</span></div>
              </section>

              <template v-for="group in overviewGroups" :key="group.label">
                <div class="section-heading">
                  <div>
                    <p class="eyebrow">{{ String(group.order).padStart(2, '0') }} / {{ group.label }}</p>
                    <h2>{{ group.title }}</h2>
                  </div>
                  <span class="section-rule" />
                </div>
                <section class="demo-grid overview-section" :aria-label="interpolate(t.groupAria, { title: group.title })">
                  <WiCard v-for="item in group.items" :key="item.name" class="overview-card">
                    <div class="overview-card__number">{{ group.label.slice(0, 2) }}</div>
                    <h2>{{ item.name }}</h2>
                    <p>{{ item.description ?? t.defaultDoc }}</p>
                    <RouterLink class="text-link" :to="componentRoute(item.name)">{{ t.viewDetails }} <span>→</span></RouterLink>
                  </WiCard>
                </section>
              </template>
            </template>

            <ComponentDocViewer v-else-if="activePackageDoc" :key="`${activePackageDoc.name}-${lang}`" :doc="activePackageDoc" />

            <section v-else class="missing-doc">
              <h2>{{ selectedComponent }}</h2>
              <p>{{ t.missingDoc }}</p>
              <RouterLink class="text-link" :to="{ name: 'components' }">{{ t.backAll }} <span>→</span></RouterLink>
            </section>
          </div>
        </WiScrollbar>
      </main>

      <aside class="token-panel" :aria-label="t.tokens">
        <WiScrollbar class="column-scroll">
          <div class="token-panel-body">
            <div class="token-heading"><span class="kicker">TOKENS</span><span class="token-index">/ 04</span></div>
            <p class="token-description">{{ t.tokenDesc }}</p>
            <div class="token-group"><h3>Color</h3><div class="swatch-row"><span class="swatch swatch--primary" /><span>primary</span><code>brand</code></div><div class="swatch-row"><span class="swatch swatch--surface" /><span>surface</span><code>canvas</code></div><div class="swatch-row"><span class="swatch swatch--border" /><span>border</span><code>line</code></div></div>
            <div class="token-group"><h3>Radius</h3><div class="radius-row"><span class="radius-sample radius-sample--sm" /><span>sm</span><span class="radius-sample radius-sample--md" /><span>md</span><span class="radius-sample radius-sample--lg" /><span>lg</span></div></div>
            <div class="token-group"><h3>Spacing</h3><div class="spacing-bars"><span style="--bar: 25%">1</span><span style="--bar: 50%">2</span><span style="--bar: 75%">3</span><span style="--bar: 100%">4</span></div></div>
            <div class="token-note"><WiIcon name="info" size="sm" /><span>{{ t.tokenNote }}</span></div>
          </div>
        </WiScrollbar>
      </aside>
    </div>
  </div>
</template>

<style>
.components-shell {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
.token-index { color: var(--wi-color-text-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: .68rem; letter-spacing: .04em; }
.workspace { display: grid; flex: 1; grid-template-columns: 15rem minmax(0, 1fr) 14rem; min-height: 0; overflow: hidden; }
.sidebar, .content, .token-panel { display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
.column-scroll { flex: 1; height: 100%; min-height: 0; }
.column-scroll :deep(.wi-scrollbar__wrap) { overscroll-behavior: contain; }
.sidebar, .token-panel { background: color-mix(in srgb, var(--wi-color-surface) 62%, transparent); border-right: 1px solid var(--docs-edge); backdrop-filter: blur(12px); }
.token-panel { border-left: 1px solid var(--docs-edge); border-right: 0; }
.sidebar-body { padding: 1.25rem 1rem 2rem; }
.content-body { padding: clamp(2rem, 5vw, 4.5rem) clamp(1.25rem, 4vw, 4rem); width: 100%; }
.content-body--doc { padding-top: 1.25rem; padding-bottom: 2.5rem; }
.token-panel-body { padding: 2.5rem 1.25rem; }
.kicker, .eyebrow { color: var(--docs-glow); font-family: var(--docs-mono); font-size: .63rem; font-weight: 600; letter-spacing: .14em; }
.search-box { align-items: center; background: color-mix(in srgb, var(--wi-color-border) 35%, transparent); border-radius: var(--wi-radius-sm); color: var(--wi-color-text-muted); display: flex; gap: .5rem; padding: .5rem .65rem; }
.search-box input { background: transparent; border: 0; color: var(--wi-color-text); min-width: 0; outline: 0; width: 100%; }
.theme-panel { border-bottom: 1px solid var(--wi-color-border); margin: 0.85rem 0 0.35rem; padding-bottom: 0.85rem; }
.theme-panel__toggle { align-items: center; background: transparent; border: 0; border-radius: var(--wi-radius-sm); color: var(--wi-color-text); cursor: pointer; display: grid; gap: 0.2rem 0.5rem; grid-template-columns: auto 1fr auto; padding: 0.45rem 0.35rem; text-align: left; width: 100%; }
.theme-panel__toggle:hover { background: color-mix(in srgb, var(--wi-color-primary) 8%, transparent); }
.theme-panel__title { font-size: 0.78rem; font-weight: 650; }
.theme-panel__summary { color: var(--wi-color-text-muted); font-family: ui-monospace, monospace; font-size: 0.58rem; grid-column: 1 / 3; letter-spacing: 0.02em; }
.theme-panel__chevron { color: var(--wi-color-text-muted); font-size: 0.7rem; grid-column: 3; grid-row: 1 / 3; }
.theme-panel__body { padding: 0.35rem 0.15rem 0.15rem; }
.sr-only { border: 0; clip: rect(0, 0, 0, 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
.setting-group { display: grid; gap: .5rem; margin: .75rem 0; }
.setting-label, .nav-heading { color: var(--wi-color-text-muted); font-family: ui-monospace, monospace; font-size: .59rem; letter-spacing: .08em; text-transform: uppercase; }
.segmented-control { background: color-mix(in srgb, var(--wi-color-border) 45%, transparent); border-radius: var(--wi-radius-sm); display: grid; grid-template-columns: 1fr 1fr; padding: .15rem; }
.segmented-control--triple { grid-template-columns: 1fr 1fr 1fr; }
.segmented-control button { background: transparent; border: 0; border-radius: var(--wi-radius-sm); color: var(--wi-color-text-muted); cursor: pointer; font-size: .68rem; padding: .38rem .25rem; }
.segmented-control button.is-selected { background: var(--wi-color-surface); box-shadow: var(--wi-shadow-sm); color: var(--wi-color-text); font-weight: 650; }
.accent-list { display: flex; gap: .55rem; }
.accent-swatch { background: var(--swatch-color); border: 2px solid transparent; border-radius: 50%; cursor: pointer; height: 1.25rem; outline: 0; padding: 0; width: 1.25rem; }
.accent-swatch.is-selected { box-shadow: 0 0 0 2px var(--wi-color-surface), 0 0 0 4px var(--swatch-color); }
.component-nav { display: grid; gap: .15rem; margin-top: 0.85rem; }
.nav-group { display: grid; gap: .1rem; margin-top: 0.85rem; }
.nav-heading { align-items: baseline; display: flex; gap: .45rem; justify-content: space-between; margin: 0 0 .3rem .55rem; }
.nav-heading__count { font-family: ui-monospace, monospace; opacity: .55; }
.nav-item { align-items: center; background: transparent; border: 0; border-radius: var(--wi-radius-sm); color: var(--wi-color-text-muted); cursor: pointer; display: flex; font-size: .8rem; justify-content: space-between; padding: .48rem .65rem; text-align: left; text-decoration: none; }
.nav-item--overview { margin-bottom: .2rem; }
.nav-item:hover, .nav-item--active { background: color-mix(in srgb, var(--wi-color-primary) 9%, transparent); color: var(--wi-color-primary); }
.nav-item--active { font-weight: 700; }
.nav-count { font-family: ui-monospace, monospace; font-size: .65rem; opacity: .7; }
.empty-search { color: var(--wi-color-text-muted); font-size: .75rem; padding: .5rem .75rem; }
.content { min-width: 0; width: 100%; }
.hero { align-items: end; display: flex; justify-content: space-between; margin-bottom: 3.5rem; }
.hero h1 { font-family: var(--docs-display); font-size: clamp(2.6rem, 5.5vw, 4.6rem); font-weight: 800; letter-spacing: -.06em; line-height: .95; margin: 1rem 0 1.3rem; }
.hero h1 span { color: var(--wi-color-primary); }
.hero-copy { color: var(--wi-color-text-muted); font-size: .9rem; line-height: 1.6; margin: 0; max-width: 36rem; }
.hero-copy code { font-family: ui-monospace, monospace; font-size: .8em; }
.doc-meta { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.5rem; }
.doc-meta span { border: 1px solid var(--wi-color-border); border-radius: var(--wi-radius-full); color: var(--wi-color-text-muted); font-family: ui-monospace, monospace; font-size: .6rem; padding: .3rem .55rem; }
.section-heading { align-items: end; display: flex; gap: 1rem; margin: 2.5rem 0 1rem; }
.section-heading:first-of-type { margin-top: 0; }
.section-heading h2 { font-family: var(--docs-display); font-size: 1.6rem; font-weight: 700; letter-spacing: -.04em; margin: .5rem 0 0; }
.section-rule { background: var(--wi-color-border); flex: 1; height: 1px; margin-bottom: .45rem; }
.hero-glyph { align-items: center; background: linear-gradient(145deg, color-mix(in srgb, var(--wi-color-primary) 18%, transparent), transparent); border: 1px solid var(--docs-edge); border-radius: 50%; box-shadow: 0 20px 50px color-mix(in srgb, var(--wi-color-primary) 22%, transparent); color: var(--wi-color-primary); display: flex; font-family: var(--docs-display); font-size: 4.5rem; font-weight: 800; height: 9rem; justify-content: center; opacity: .9; transform: rotate(-10deg); width: 9rem; }
.demo-grid { display: grid; gap: 1rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.overview-section { margin-bottom: 1rem; }
.overview-card { min-height: 13rem; position: relative; }
.overview-card__number { color: var(--wi-color-primary); font-family: ui-monospace, monospace; font-size: .65rem; }
.overview-card h2 { font-family: var(--docs-display); font-size: 1.65rem; font-weight: 700; letter-spacing: -.04em; margin: 2.5rem 0 .5rem; }
.overview-card p { color: var(--wi-color-text-muted); font-size: .78rem; line-height: 1.5; margin: 0; max-width: 15rem; }
.text-link { background: transparent; border: 0; color: var(--wi-color-primary); cursor: pointer; display: inline-flex; font-size: .75rem; margin-top: 1.4rem; padding: 0; text-decoration: none; }
.text-link span { display: inline-block; margin-left: .35rem; transition: transform var(--wi-motion-fast) var(--wi-motion-ease); }
.text-link:hover span { transform: translateX(.25rem); }
.missing-doc { color: var(--wi-color-text-muted); }
.missing-doc .text-link { margin-top: 1rem; }
.token-heading { display: flex; justify-content: space-between; }.token-description { color: var(--wi-color-text-muted); font-family: var(--docs-body); font-size: .8rem; line-height: 1.5; margin: 1.5rem 0 2.5rem; }.token-group { border-top: 1px solid var(--wi-color-border); padding: 1rem 0; }.token-group h3 { font-family: ui-monospace, monospace; font-size: .65rem; font-weight: 500; letter-spacing: .08em; margin: 0 0 1rem; text-transform: uppercase; }.swatch-row { align-items: center; color: var(--wi-color-text-muted); display: grid; font-size: .7rem; gap: .5rem; grid-template-columns: 1rem 1fr auto; margin: .6rem 0; }.swatch { border: 1px solid var(--wi-color-border); border-radius: 50%; height: .8rem; width: .8rem; }.swatch--primary { background: var(--wi-color-primary); }.swatch--surface { background: var(--wi-color-surface); }.swatch--border { background: var(--wi-color-border); }.swatch-row code { color: var(--wi-color-text-muted); font-family: ui-monospace, monospace; font-size: .6rem; }.radius-row { align-items: center; color: var(--wi-color-text-muted); display: flex; font-family: ui-monospace, monospace; font-size: .6rem; gap: .35rem; }.radius-sample { background: color-mix(in srgb, var(--wi-color-primary) 15%, transparent); border: 1px solid var(--wi-color-primary); height: 1.25rem; width: 1.25rem; }.radius-sample--sm { border-radius: var(--wi-radius-sm); }.radius-sample--md { border-radius: var(--wi-radius-md); }.radius-sample--lg { border-radius: var(--wi-radius-lg); }.spacing-bars { align-items: end; display: flex; gap: .35rem; height: 4rem; }.spacing-bars span { align-items: center; background: color-mix(in srgb, var(--wi-color-primary) 20%, transparent); color: var(--wi-color-primary); display: flex; font-family: ui-monospace, monospace; font-size: .6rem; height: var(--bar); justify-content: center; width: 1.45rem; }.token-note { align-items: start; border: 1px solid var(--wi-color-border); color: var(--wi-color-text-muted); display: flex; font-size: .68rem; gap: .5rem; line-height: 1.5; margin-top: 2rem; padding: .75rem; }.token-note .wi-icon { color: var(--wi-color-primary); flex: 0 0 auto; }
@media (max-width: 1100px) { .workspace { grid-template-columns: 13rem minmax(0, 1fr); }.token-panel { display: none; } }
@media (max-width: 700px) {
  .components-shell { height: auto; min-height: 0; overflow: visible; }
  .workspace { display: block; flex: none; overflow: visible; }
  .sidebar, .content, .token-panel { display: block; overflow: visible; }
  .column-scroll { height: auto; }
  .sidebar { border-bottom: 1px solid var(--wi-color-border); border-right: 0; }
  .sidebar-body { padding: 1.25rem; }
  .theme-panel { margin-top: 0.75rem; }
  .component-nav { display: flex; flex-wrap: wrap; }
  .nav-group { flex-basis: 100%; }
  .nav-heading { flex-basis: 100%; margin-top: .25rem; }
  .nav-item { padding: .5rem .7rem; }
  .content-body { padding: 2rem 1.25rem; }
  .hero { align-items: start; }
  .hero-glyph { display: none; }
  .demo-grid { grid-template-columns: 1fr; }
}
</style>
