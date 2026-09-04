<script setup lang="ts">
import type { ResolvedGuideDoc } from '../docs/guide/loadGuideDocs'
import { WdScrollbar } from '@wex-design/ui'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ComponentDocViewer from '../components/ComponentDocViewer.vue'
import MobileSidebarShell from '../components/MobileSidebarShell.vue'
import { guideDocExists, listGuideDocs, resolveGuideDoc } from '../docs/guide/loadGuideDocs'
import { SITE_LOGO_URL } from '../config/site'
import { useDocsI18n } from '../i18n'

const route = useRoute()
const router = useRouter()
const { lang, t } = useDocsI18n()
const guides = computed(() => listGuideDocs(lang.value))
const activeDoc = ref<ResolvedGuideDoc | null>(null)
const docLoading = ref(false)

const activeSlug = computed(() => {
  const slug = route.params.slug
  return typeof slug === 'string' && slug ? slug : 'introduction'
})

watch([activeSlug, lang], async () => {
  if (!guideDocExists(activeSlug.value, lang.value)) {
    if (guides.value[0]) {
      void router.replace({ name: 'docs', params: { slug: guides.value[0].slug } })
    }
    activeDoc.value = null
    return
  }
  docLoading.value = true
  activeDoc.value = await resolveGuideDoc(activeSlug.value, lang.value)
  docLoading.value = false
}, { immediate: true })
</script>

<template>
  <div class="docs-shell">
    <MobileSidebarShell
      class="docs-sidebar"
      :title="t.docsTitle"
      :toggle-label="t.openNav"
      scroll-class="docs-scroll"
      body-class="docs-sidebar__body"
    >
          <RouterLink class="docs-brand" :to="{ name: 'home' }" :aria-label="t.homeAria">
            <img
              class="docs-brand__logo"
              :src="SITE_LOGO_URL"
              width="24"
              height="24"
              alt=""
            />
            <span>Wex Design UI</span>
          </RouterLink>
          <p class="docs-kicker">
            DOCUMENTATION
          </p>
          <h1 class="docs-sidebar__title">
            {{ t.docsTitle }}
          </h1>
          <nav class="docs-nav">
            <RouterLink
              v-for="item in guides"
              :key="item.slug"
              class="docs-nav__item"
              :class="{ 'is-active': activeSlug === item.slug }"
              :to="{ name: 'docs', params: { slug: item.slug } }"
            >
              <span>{{ t.guideTitles[item.slug] ?? item.title }}</span>
            </RouterLink>
          </nav>
    </MobileSidebarShell>

    <main class="docs-main">
      <WdScrollbar class="docs-scroll">
        <div class="docs-main__body">
          <p v-if="docLoading" class="docs-loading" aria-live="polite">
            …
          </p>
          <ComponentDocViewer
            v-else-if="activeDoc"
            :key="`${activeDoc.slug}-${lang}`"
            :doc="{ name: activeDoc.slug, frontmatter: activeDoc.frontmatter, component: activeDoc.component }"
          />
          <section v-else class="docs-missing">
            <h2>{{ t.docsMissing }}</h2>
            <RouterLink :to="{ name: 'docs', params: { slug: 'introduction' } }">
              {{ t.backIntro }}
            </RouterLink>
          </section>
        </div>
      </WdScrollbar>
    </main>
  </div>
</template>

<style>
.docs-sidebar {
  background: color-mix(in srgb, var(--wd-color-surface) 62%, transparent);
  border-right: 1px solid var(--docs-edge);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.docs-scroll {
  flex: 1;
  height: 100%;
  min-height: 0;
}

.docs-sidebar__body {
  padding: 1.5rem 1rem 2rem;
}

@media (max-width: 700px) {
  .docs-sidebar:not([data-open]) {
    border: 0;
  }
}
</style>

<style scoped>
.docs-shell {
  display: grid;
  flex: 1;
  grid-template-columns: 15.5rem minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
}

.docs-kicker {
  color: var(--docs-glow);
  font-family: var(--docs-mono);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  margin: 0.85rem 0 0.55rem;
}

.docs-brand {
  align-items: center;
  color: var(--wd-color-text);
  display: inline-flex;
  font-family: var(--docs-display);
  font-size: 0.92rem;
  font-weight: 700;
  gap: 0.5rem;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.docs-brand__logo {
  border-radius: 0.4rem;
  display: block;
}

.docs-sidebar__title {
  font-family: var(--docs-display);
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  margin: 0 0 1.15rem;
}

.docs-nav {
  display: grid;
  gap: 0.2rem;
}

.docs-nav__item {
  border: 1px solid transparent;
  border-radius: 0.7rem;
  color: var(--wd-color-text-muted);
  font-size: 0.86rem;
  font-weight: 500;
  padding: 0.55rem 0.7rem;
  text-decoration: none;
  transition:
    color var(--wd-motion-fast) var(--wd-motion-ease),
    background var(--wd-motion-fast) var(--wd-motion-ease),
    border-color var(--wd-motion-fast) var(--wd-motion-ease);
}

.docs-nav__item:hover,
.docs-nav__item.is-active {
  background: color-mix(in srgb, var(--wd-color-primary) 10%, transparent);
  color: var(--wd-color-primary);
}

.docs-nav__item.is-active {
  border-color: color-mix(in srgb, var(--wd-color-primary) 28%, transparent);
  font-weight: 700;
}

.docs-main {
  min-height: 0;
  min-width: 0;
}

.docs-main__body {
  margin: 0 auto;
  max-width: 52rem;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1.25rem, 4vw, 3rem) 4rem;
}

.docs-loading,
.docs-missing {
  color: var(--wd-color-text-muted);
}

@media (max-width: 700px) {
  .docs-shell {
    display: block;
    overflow: visible;
  }

  .docs-main {
    overflow: visible;
  }

  .docs-scroll {
    height: auto;
  }
}
</style>
