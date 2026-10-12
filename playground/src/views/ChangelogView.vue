<script setup lang="ts">
import type { TimelineEvent } from 'morya-ui'
import { MScrollbar, MTimeline } from 'morya-ui'
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadChangelog } from '../docs/loadChangelog'
import { useDocsI18n } from '../i18n'

const route = useRoute()
const router = useRouter()
const { lang, t } = useDocsI18n()
const doc = computed(() => loadChangelog(lang.value))

const mainScroll = ref<InstanceType<typeof MScrollbar> | null>(null)

/** Timeline items: one per release, carrying the full release payload. */
const timelineEvents = computed(() =>
  doc.value.releases.map((release) => ({
    status: `v${release.version}`,
    release,
  })),
)

function isCurrent(version: string) {
  return version === doc.value.currentVersion
}

function anchorId(version: string) {
  return `release-${version.replace(/[^\da-z.-]/gi, '-')}`
}

async function selectVersion(version: string) {
  void router.replace({ name: 'changelog', query: { v: version } })
  await nextTick()
  const el = document.getElementById(anchorId(version))
  if (!el) return
  const wrap = (mainScroll.value?.$el as HTMLElement | undefined)?.querySelector?.('.m-scrollbar__wrap')
  if (wrap) {
    const wrapRect = wrap.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    wrap.scrollTo({ top: wrap.scrollTop + (elRect.top - wrapRect.top) - 12, behavior: 'smooth' })
  } else {
    el.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }
}

const activeVersion = ref(doc.value.currentVersion)
watch(
  () => route.query.v,
  (value) => {
    if (typeof value === 'string' && doc.value.releases.some((item) => item.version === value)) {
      activeVersion.value = value
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="changelog-shell">
    <aside class="changelog-sidebar" :aria-label="t.changelogNav">
      <MScrollbar class="changelog-scroll">
        <div class="changelog-sidebar__body">
          <h1 class="changelog-sidebar__title">
            {{ t.changelogTitle }}
          </h1>
          <p class="changelog-sidebar__meta">
            <span>{{ doc.packageName }}</span>
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
              <span v-if="isCurrent(release.version)" class="changelog-nav__badge">{{ t.current }}</span>
            </button>
          </nav>
        </div>
      </MScrollbar>
    </aside>

    <main class="changelog-main">
      <MScrollbar ref="mainScroll" class="changelog-scroll">
        <div class="changelog-main__body">
          <header class="changelog-hero">
            <p class="changelog-hero__kicker">
              {{ doc.packageName }}
            </p>
            <h2>{{ t.changelogTitle }}</h2>
          </header>

          <MTimeline
            v-if="doc.releases.length"
            :value="(timelineEvents as unknown as TimelineEvent[])"
            align="left"
            class="changelog-timeline"
          >
            <template #opposite="{ item }">
              <div
                class="changelog-release"
                :class="{ 'changelog-release--current': isCurrent((item as any).release.version) }"
              >
                <span class="changelog-release__version">v{{ (item as any).release.version }}</span>
                <span v-if="isCurrent((item as any).release.version)" class="changelog-release__badge">
                  {{ t.current }}
                </span>
              </div>
            </template>

            <template #content="{ item }">
              <article
                class="changelog-card"
                :class="{ 'changelog-card--current': isCurrent((item as any).release.version) }"
              >
                <span :id="anchorId((item as any).release.version)" class="changelog-card__anchor" aria-hidden="true" />
                <section
                  v-for="section in (item as any).release.sections"
                  :key="section.heading"
                  class="changelog-section"
                >
                  <h3>{{ section.heading }}</h3>
                  <ul>
                    <li v-for="(entry, index) in section.items" :key="`${section.heading}-${index}`">
                      {{ entry }}
                    </li>
                  </ul>
                </section>
                <p v-if="(item as any).release.sections.length === 0" class="changelog-empty">
                  {{ t.emptySection }}
                </p>
              </article>
            </template>
          </MTimeline>

          <section v-else class="changelog-empty">
            <h2>{{ t.noReleases }}</h2>
            <p>{{ t.noReleasesHint }}</p>
          </section>
        </div>
      </MScrollbar>
    </main>
  </div>
</template>

<style scoped>
.changelog-shell {
  display: grid;
  flex: 1;
  grid-template-columns: 14.5rem minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
}

.changelog-sidebar {
  background: color-mix(in srgb, var(--m-color-surface) 94%, transparent);
  border-right: 1px solid var(--docs-edge);
  min-height: 0;
}

.changelog-scroll {
  height: 100%;
  min-height: 0;
}

.changelog-sidebar__body {
  padding: 1.5rem 1rem 2rem;
}

.changelog-sidebar__title {
  font-family: var(--docs-display);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  margin: 0 0 0.5rem;
}

.changelog-sidebar__meta {
  align-items: center;
  background: var(--docs-surface-subtle);
  border: 1px solid var(--docs-edge);
  border-radius: 999px;
  color: var(--m-color-text-muted);
  display: inline-flex;
  flex-wrap: wrap;
  font-family: var(--docs-mono);
  font-size: 0.68rem;
  gap: 0.4rem;
  letter-spacing: 0.03em;
  margin: 0 0 1.25rem;
  padding: 0.25rem 0.7rem;
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
  color: var(--m-color-text-muted);
  cursor: pointer;
  display: flex;
  font-family: var(--docs-mono);
  font-size: 0.82rem;
  font-weight: 500;
  justify-content: space-between;
  padding: 0.5rem 0.7rem;
  text-align: left;
  transition:
    color var(--m-motion-fast) var(--m-motion-ease),
    background var(--m-motion-fast) var(--m-motion-ease),
    border-color var(--m-motion-fast) var(--m-motion-ease);
}

.changelog-nav__item:hover {
  background: var(--docs-primary-soft);
  color: var(--m-color-primary);
}

.changelog-nav__item.is-active {
  background: var(--docs-primary-soft);
  border-color: var(--docs-primary-edge);
  color: var(--m-color-primary);
  font-weight: 700;
}

.changelog-nav__badge {
  background: var(--m-color-primary);
  border-radius: 999px;
  color: var(--m-color-surface);
  font-family: var(--docs-mono);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1;
  padding: 0.24rem 0.5rem;
  text-transform: uppercase;
}

.changelog-main {
  min-height: 0;
  min-width: 0;
}

.changelog-main__body {
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1.5rem, 4vw, 3rem) 5rem;
}

/* --- hero --- */
.changelog-hero {
  margin-bottom: 2.25rem;
  padding-bottom: 1.5rem;
  position: relative;
}

.changelog-hero::after {
  background: linear-gradient(
    90deg,
    var(--m-color-primary),
    var(--docs-primary-edge) 45%,
    transparent
  );
  border-radius: 999px;
  bottom: 0;
  content: '';
  height: 2px;
  left: 0;
  position: absolute;
  width: 9rem;
}

.changelog-hero__kicker {
  color: var(--m-color-primary);
  font-family: var(--docs-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  margin: 0 0 0.6rem;
  text-transform: uppercase;
}

.changelog-hero h2 {
  background: linear-gradient(
    120deg,
    var(--m-color-text) 40%,
    var(--docs-glow)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-family: var(--docs-display);
  font-size: clamp(1.9rem, 3.4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  margin: 0;
}

/* --- timeline layout overrides --- */
/* Version column hugs its content; connector sits closer to the cards. */
.changelog-timeline :deep(.m-timeline__event) {
  gap: 1.5rem;
  grid-template-columns: minmax(7.5rem, auto) auto minmax(0, 1fr);
}

.changelog-timeline :deep(.m-timeline__event--left .m-timeline__opposite) {
  padding-top: 0.55rem;
  text-align: end;
}

.changelog-timeline :deep(.m-timeline__separator) {
  padding-top: 0.55rem;
}

.changelog-timeline :deep(.m-timeline__marker) {
  box-shadow: 0 0 0 4px var(--docs-primary-soft);
}

.changelog-timeline :deep(.m-timeline__connector) {
  background: linear-gradient(
    180deg,
    var(--docs-edge-strong),
    var(--docs-edge)
  );
  width: 2px;
}

/* --- release (opposite / left column) --- */
.changelog-release {
  align-items: center;
  display: inline-flex;
  flex-direction: column;
  gap: 0.45rem;
}

.changelog-release__version {
  font-family: var(--docs-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
  white-space: nowrap;
}

.changelog-release--current .changelog-release__version {
  color: var(--m-color-primary);
}

.changelog-release__badge {
  background: var(--m-color-primary);
  border-radius: 999px;
  color: var(--m-color-surface);
  font-family: var(--docs-mono);
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1;
  padding: 0.24rem 0.5rem;
  text-transform: uppercase;
}

/* --- release card (content / right column) --- */
.changelog-card {
  background: var(--docs-panel);
  border: 1px solid var(--docs-edge);
  border-radius: 1.05rem;
  box-shadow: var(--docs-shadow-card);
  margin-bottom: 1.4rem;
  overflow: hidden;
  padding: 1.15rem 1.25rem 1.25rem;
  position: relative;
  transition:
    border-color var(--m-motion-fast) var(--m-motion-ease),
    box-shadow var(--m-motion-fast) var(--m-motion-ease);
}

.changelog-card:hover {
  border-color: var(--docs-primary-edge);
  box-shadow: var(--docs-shadow-card-hover);
}

.changelog-card--current {
  border-color: var(--docs-primary-edge);
}

.changelog-card--current::before {
  background: linear-gradient(90deg, var(--m-color-primary), var(--docs-glow));
  border-radius: 999px;
  content: '';
  height: 2px;
  left: 1.25rem;
  position: absolute;
  right: 1.25rem;
  top: 0;
}

.changelog-card__anchor {
  display: block;
  height: 0;
  position: absolute;
  top: -0.5rem;
}

.changelog-section {
  margin: 0 0 1.15rem;
}

.changelog-section:last-child {
  margin-bottom: 0;
}

.changelog-section h3 {
  align-items: center;
  color: var(--m-color-text);
  display: flex;
  font-family: var(--docs-display);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 0.65rem;
}

.changelog-section h3::before {
  background: var(--docs-primary-mid);
  border: 1px solid var(--docs-primary-edge);
  border-radius: 0.35rem;
  content: '';
  height: 0.8rem;
  margin-right: 0.55rem;
  width: 0.32rem;
}

.changelog-section ul {
  display: grid;
  gap: 0.45rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.changelog-section li {
  color: var(--m-color-text);
  font-size: 0.88rem;
  line-height: 1.65;
  opacity: 0.9;
  padding-left: 1.15rem;
  position: relative;
}

.changelog-section li::before {
  background: var(--m-color-primary);
  border-radius: 50%;
  content: '';
  height: 0.32rem;
  left: 0.3rem;
  opacity: 0.7;
  position: absolute;
  top: 0.72em;
  width: 0.32rem;
}

.changelog-empty {
  color: var(--m-color-text-muted);
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

  /* Stack the timeline: version above the card, hide the opposite column. */
  .changelog-timeline :deep(.m-timeline__event) {
    gap: 0.9rem;
    grid-template-columns: auto minmax(0, 1fr);
  }

  .changelog-timeline :deep(.m-timeline__event--left .m-timeline__opposite) {
    grid-column: 2;
    grid-row: 1;
    padding-top: 0;
    text-align: start;
  }

  .changelog-timeline :deep(.m-timeline__event--left .m-timeline__content) {
    grid-column: 2;
  }

  .changelog-timeline :deep(.m-timeline__separator) {
    grid-column: 1;
    grid-row: 1 / 3;
    padding-top: 0.35rem;
  }

  .changelog-release {
    flex-direction: row;
  }
}
</style>
