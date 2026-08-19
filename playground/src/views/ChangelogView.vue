<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { WdScrollbar, WdTag } from '@well-insight/ui'
import { loadChangelog } from '../docs/loadChangelog'
import { useDocsI18n } from '../i18n'

const route = useRoute()
const router = useRouter()
const { lang, t } = useDocsI18n()
const doc = computed(() => loadChangelog(lang.value))

const activeVersion = ref(doc.value.releases[0]?.version ?? doc.value.currentVersion)

const activeRelease = computed(
  () => doc.value.releases.find((item) => item.version === activeVersion.value) ?? doc.value.releases[0] ?? null,
)

watch(
  () => route.query.v,
  (value) => {
    if (typeof value === 'string' && doc.value.releases.some((item) => item.version === value)) {
      activeVersion.value = value
    }
  },
  { immediate: true },
)

function selectVersion(version: string) {
  activeVersion.value = version
  void router.replace({ name: 'changelog', query: { v: version } })
}
</script>

<template>
  <div class="changelog-shell">
    <aside class="changelog-sidebar" :aria-label="t.changelogNav">
      <WdScrollbar class="changelog-scroll">
        <div class="changelog-sidebar__body">
          <p class="changelog-kicker">RELEASES</p>
          <h1 class="changelog-sidebar__title">{{ t.changelogTitle }}</h1>
          <p class="changelog-sidebar__meta">
            <span>{{ doc.packageName }}</span>
            <WdTag :value="`v${doc.currentVersion}`" severity="info" />
          </p>
          <nav class="changelog-nav" :aria-label="t.changelogHistory">
            <button
              v-for="release in doc.releases"
              :key="release.version"
              type="button"
              class="changelog-nav__item"
              :class="{ 'is-active': activeVersion === release.version }"
              @click="selectVersion(release.version)"
            >
              <span>v{{ release.version }}</span>
              <span v-if="release.version === doc.currentVersion" class="changelog-nav__badge">{{ t.current }}</span>
            </button>
          </nav>
        </div>
      </WdScrollbar>
    </aside>

    <main class="changelog-main">
      <WdScrollbar class="changelog-scroll">
        <div class="changelog-main__body">
          <template v-if="activeRelease">
            <header class="changelog-hero">
              <p class="changelog-kicker">CHANGELOG</p>
              <h2>v{{ activeRelease.version }}</h2>
              <p v-if="activeRelease.version === doc.currentVersion" class="changelog-hero__hint">
                {{ t.currentHint }}
              </p>
            </header>

            <section
              v-for="section in activeRelease.sections"
              :key="section.heading"
              class="changelog-section"
            >
              <h3>{{ section.heading }}</h3>
              <ul>
                <li v-for="(item, index) in section.items" :key="`${section.heading}-${index}`">
                  {{ item }}
                </li>
              </ul>
            </section>

            <p v-if="activeRelease.sections.length === 0" class="changelog-empty">
              {{ t.emptySection }}
            </p>
          </template>

          <section v-else class="changelog-empty">
            <h2>{{ t.noReleases }}</h2>
            <p>{{ t.noReleasesHint }}</p>
          </section>
        </div>
      </WdScrollbar>
    </main>
  </div>
</template>

<style scoped>
.changelog-shell {
  display: grid;
  flex: 1;
  grid-template-columns: 15.5rem minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
}

.changelog-sidebar {
  background: color-mix(in srgb, var(--wd-color-surface) 62%, transparent);
  border-right: 1px solid var(--docs-edge);
  min-height: 0;
  backdrop-filter: blur(12px);
}

.changelog-scroll {
  height: 100%;
  min-height: 0;
}

.changelog-sidebar__body {
  padding: 1.5rem 1rem 2rem;
}

.changelog-kicker {
  color: var(--docs-glow);
  font-family: var(--docs-mono);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  margin: 0 0 0.55rem;
}

.changelog-sidebar__title {
  font-family: var(--docs-display);
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  margin: 0 0 0.85rem;
}

.changelog-sidebar__meta {
  align-items: center;
  color: var(--wd-color-text-muted);
  display: flex;
  flex-wrap: wrap;
  font-family: var(--docs-mono);
  font-size: 0.72rem;
  gap: 0.5rem;
  margin: 0 0 1.15rem;
}

.changelog-nav {
  display: grid;
  gap: 0.2rem;
}

.changelog-nav__item {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.7rem;
  color: var(--wd-color-text-muted);
  cursor: pointer;
  display: flex;
  font-size: 0.86rem;
  font-weight: 500;
  justify-content: space-between;
  padding: 0.55rem 0.7rem;
  text-align: left;
  transition:
    color var(--wd-motion-fast) var(--wd-motion-ease),
    background var(--wd-motion-fast) var(--wd-motion-ease),
    border-color var(--wd-motion-fast) var(--wd-motion-ease);
}

.changelog-nav__item:hover,
.changelog-nav__item.is-active {
  background: color-mix(in srgb, var(--wd-color-primary) 10%, transparent);
  color: var(--wd-color-primary);
}

.changelog-nav__item.is-active {
  border-color: color-mix(in srgb, var(--wd-color-primary) 28%, transparent);
  font-weight: 700;
}

.changelog-nav__badge {
  color: var(--wd-color-primary);
  font-family: var(--docs-mono);
  font-size: 0.62rem;
  letter-spacing: 0.04em;
}

.changelog-main {
  min-height: 0;
  min-width: 0;
}

.changelog-main__body {
  margin: 0 auto;
  max-width: 46rem;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1.25rem, 4vw, 3rem) 4rem;
}

.changelog-hero {
  border-bottom: 1px solid var(--docs-edge);
  margin-bottom: 1.5rem;
  padding-bottom: 1.15rem;
}

.changelog-hero h2 {
  font-family: var(--docs-display);
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  font-weight: 750;
  letter-spacing: -0.04em;
  margin: 0.2rem 0 0.55rem;
}

.changelog-hero__hint {
  color: var(--wd-color-text-muted);
  font-size: 0.88rem;
  line-height: 1.55;
  margin: 0;
  max-width: 36rem;
}

.changelog-section {
  margin: 0 0 1.5rem;
}

.changelog-section h3 {
  font-family: var(--docs-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.65rem;
}

.changelog-section ul {
  display: grid;
  gap: 0.55rem;
  margin: 0;
  padding-left: 1.15rem;
}

.changelog-section li {
  color: var(--wd-color-text);
  font-size: 0.92rem;
  line-height: 1.6;
  opacity: 0.92;
}

.changelog-empty {
  color: var(--wd-color-text-muted);
}

.changelog-empty code {
  font-family: var(--docs-mono);
  font-size: 0.85em;
}

@media (max-width: 700px) {
  .changelog-shell {
    display: block;
    overflow: visible;
  }

  .changelog-sidebar,
  .changelog-main {
    overflow: visible;
  }

  .changelog-scroll {
    height: auto;
  }

  .changelog-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
}
</style>
