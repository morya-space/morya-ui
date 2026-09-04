<script setup lang="ts">
import { WiButton, WiScrollbar } from '@well-insight/ui'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useDocsI18n } from '../i18n'

const { t } = useDocsI18n()

const pillars = computed(() => [
  {
    label: 'System',
    title: t.value.pillarSystemTitle,
    body: t.value.pillarSystemBody,
  },
  {
    label: 'Craft',
    title: t.value.pillarCraftTitle,
    body: t.value.pillarCraftBody,
  },
  {
    label: 'Control',
    title: t.value.pillarControlTitle,
    body: t.value.pillarControlBody,
  },
])
</script>

<template>
  <WiScrollbar class="home-scroll">
    <div class="home-page">
      <section class="home-hero">
        <img class="home-logo" :src="`${import.meta.env.BASE_URL}logo.svg`" width="88" height="88" alt="" />
        <p class="home-kicker">
          OPEN SOURCE · VUE 3 · DESIGN TOKENS
        </p>
        <h1 class="home-brand">
          Well Insight UI
        </h1>
        <p class="home-headline">
          {{ t.headline }}
        </p>
        <p class="home-lead">
          {{ t.lead }}
        </p>
        <div class="home-actions">
          <RouterLink :to="{ name: 'docs', params: { slug: 'quick-start' } }">
            <WiButton :label="t.start" />
          </RouterLink>
          <RouterLink :to="{ name: 'components' }">
            <WiButton :label="t.browse" outlined />
          </RouterLink>
          <RouterLink :to="{ name: 'changelog' }">
            <WiButton :label="t.changelog" text />
          </RouterLink>
        </div>
        <div class="home-meta" :aria-label="t.techTags">
          <span>Vue 3.5</span>
          <span>88 Components</span>
          <span>TypeScript</span>
          <span>MIT</span>
        </div>
      </section>

      <section class="home-pillars" :aria-label="t.capabilities">
        <article v-for="item in pillars" :key="item.title" class="home-pillar">
          <span class="home-pillar__label">{{ item.label }}</span>
          <h2>{{ item.title }}</h2>
          <p>{{ item.body }}</p>
        </article>
      </section>

      <section class="home-cta">
        <div>
          <h2>{{ t.next }}</h2>
          <p>{{ t.nextBody }}</p>
        </div>
        <div class="home-cta__links">
          <RouterLink class="home-text-link" :to="{ name: 'docs', params: { slug: 'theme' } }">
            {{ t.themeMotion }}
          </RouterLink>
          <RouterLink class="home-text-link" :to="{ name: 'docs', params: { slug: 'config' } }">
            {{ t.globalConfig }}
          </RouterLink>
          <RouterLink class="home-text-link" :to="{ name: 'components' }">
            {{ t.allComponents }}
          </RouterLink>
        </div>
      </section>
    </div>
  </WiScrollbar>
</template>

<style scoped>
.home-scroll {
  flex: 1;
  height: 100%;
  min-height: 0;
}

.home-page {
  margin: 0 auto;
  max-width: 68rem;
  padding: clamp(2.5rem, 7vw, 5.5rem) clamp(1.25rem, 4vw, 3rem) 4.5rem;
  width: 100%;
}

.home-hero {
  animation: home-rise 0.7s var(--wi-motion-ease) both;
  max-width: 46rem;
  position: relative;
}

.home-logo {
  animation: home-rise 0.7s var(--wi-motion-ease) both;
  display: block;
  height: clamp(4.5rem, 12vw, 5.5rem);
  margin: 0 0 1.25rem;
  width: clamp(4.5rem, 12vw, 5.5rem);
}

.home-kicker {
  color: var(--docs-glow);
  font-family: var(--docs-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  margin: 0 0 1.1rem;
}

.home-brand {
  background: linear-gradient(
    120deg,
    var(--wi-color-text) 10%,
    color-mix(in srgb, var(--wi-color-primary) 75%, #22d3ee) 55%,
    var(--wi-color-primary) 100%
  );
  background-clip: text;
  color: transparent;
  font-family: var(--docs-display);
  font-size: clamp(3.2rem, 9vw, 6.4rem);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.92;
  margin: 0 0 1rem;
}

.home-headline {
  color: var(--wi-color-text);
  font-family: var(--docs-display);
  font-size: clamp(1.35rem, 2.6vw, 1.85rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.25;
  margin: 0 0 1rem;
}

.home-lead {
  color: var(--wi-color-text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  margin: 0;
  max-width: 38rem;
}

.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2.1rem;
}

.home-actions a {
  text-decoration: none;
}

.home-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.75rem;
}

.home-meta span {
  background: color-mix(in srgb, var(--wi-color-surface) 65%, transparent);
  border: 1px solid var(--docs-edge);
  border-radius: 999px;
  color: var(--wi-color-text-muted);
  font-family: var(--docs-mono);
  font-size: 0.68rem;
  padding: 0.35rem 0.7rem;
}

.home-pillars {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: clamp(3rem, 8vw, 5rem);
}

.home-pillar {
  animation: home-rise 0.8s var(--wi-motion-ease) both;
  background: color-mix(in srgb, var(--wi-color-surface) 70%, transparent);
  border: 1px solid var(--docs-edge);
  border-radius: 1.1rem;
  padding: 1.35rem 1.25rem 1.45rem;
  position: relative;
  overflow: hidden;
}

.home-pillar:nth-child(2) {
  animation-delay: 0.08s;
}

.home-pillar:nth-child(3) {
  animation-delay: 0.16s;
}

.home-pillar::before {
  background: linear-gradient(120deg, transparent, color-mix(in srgb, var(--wi-color-primary) 35%, transparent));
  content: '';
  height: 1px;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.home-pillar__label {
  color: var(--docs-glow);
  font-family: var(--docs-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.home-pillar h2 {
  font-family: var(--docs-display);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0.7rem 0 0.55rem;
}

.home-pillar p {
  color: var(--wi-color-text-muted);
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0;
}

.home-cta {
  align-items: end;
  border-top: 1px solid var(--docs-edge);
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
  margin-top: 3.5rem;
  padding-top: 2rem;
}

.home-cta h2 {
  font-family: var(--docs-display);
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0 0 0.45rem;
}

.home-cta p {
  color: var(--wi-color-text-muted);
  margin: 0;
}

.home-cta__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.home-text-link {
  color: var(--wi-color-primary);
  font-family: var(--docs-display);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
}

.home-text-link:hover {
  text-decoration: underline;
}

@keyframes home-rise {
  from {
    opacity: 0;
    transform: translateY(0.8rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero,
  .home-pillar {
    animation: none;
  }
}

@media (max-width: 900px) {
  .home-pillars {
    grid-template-columns: 1fr;
  }
}
</style>
