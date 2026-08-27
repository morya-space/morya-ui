<script setup lang="ts">
import { WiScrollbar } from '@well-insight/ui'
import { computed, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import ComponentDocViewer from '../components/ComponentDocViewer.vue'
import { listGuideDocs, resolveGuideDoc } from '../docs/guide/loadGuideDocs'
import { useDocsI18n } from '../i18n'

const route = useRoute()
const router = useRouter()
const { lang, t } = useDocsI18n()
const guides = computed(() => listGuideDocs(lang.value))

const activeSlug = computed(() => {
  const slug = route.params.slug
  return typeof slug === 'string' && slug ? slug : 'introduction'
})

const activeDoc = computed(() => resolveGuideDoc(activeSlug.value, lang.value))

watch(
  activeSlug,
  (slug) => {
    if (!resolveGuideDoc(slug, lang.value) && guides.value[0]) {
      void router.replace({ name: 'docs', params: { slug: guides.value[0].slug } })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="docs-shell">
    <aside class="docs-sidebar" :aria-label="t.docsNav">
      <WiScrollbar class="docs-scroll">
        <div class="docs-sidebar__body">
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
        </div>
      </WiScrollbar>
    </aside>

    <main class="docs-main">
      <WiScrollbar class="docs-scroll">
        <div class="docs-main__body">
          <ComponentDocViewer v-if="activeDoc" :key="`${activeDoc.slug}-${lang}`" :doc="{ name: activeDoc.slug, frontmatter: activeDoc.frontmatter, component: activeDoc.component }" />
          <section v-else class="docs-missing">
            <h2>{{ t.docsMissing }}</h2>
            <RouterLink :to="{ name: 'docs', params: { slug: 'introduction' } }">
              {{ t.backIntro }}
            </RouterLink>
          </section>
        </div>
      </WiScrollbar>
    </main>
  </div>
</template>

<style scoped>
.docs-shell {
  display: grid;
  flex: 1;
  grid-template-columns: 15.5rem minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
}

.docs-sidebar {
  background: color-mix(in srgb, var(--wi-color-surface) 62%, transparent);
  border-right: 1px solid var(--docs-edge);
  min-height: 0;
  backdrop-filter: blur(12px);
}

.docs-scroll {
  height: 100%;
  min-height: 0;
}

.docs-sidebar__body {
  padding: 1.5rem 1rem 2rem;
}

.docs-kicker {
  color: var(--docs-glow);
  font-family: var(--docs-mono);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  margin: 0 0 0.55rem;
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
  color: var(--wi-color-text-muted);
  font-size: 0.86rem;
  font-weight: 500;
  padding: 0.55rem 0.7rem;
  text-decoration: none;
  transition:
    color var(--wi-motion-fast) var(--wi-motion-ease),
    background var(--wi-motion-fast) var(--wi-motion-ease),
    border-color var(--wi-motion-fast) var(--wi-motion-ease);
}

.docs-nav__item:hover,
.docs-nav__item.is-active {
  background: color-mix(in srgb, var(--wi-color-primary) 10%, transparent);
  color: var(--wi-color-primary);
}

.docs-nav__item.is-active {
  border-color: color-mix(in srgb, var(--wi-color-primary) 28%, transparent);
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

.docs-missing {
  color: var(--wi-color-text-muted);
}

@media (max-width: 700px) {
  .docs-shell {
    display: block;
    overflow: visible;
  }

  .docs-sidebar,
  .docs-main {
    overflow: visible;
  }

  .docs-scroll {
    height: auto;
  }

  .docs-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
}
</style>
