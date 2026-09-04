<script setup lang="ts">
import { WiButton, WiScrollbar } from '@well-insight/ui'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  SITE_GITHUB_URL,
  SITE_INSTALL_CMD,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_NPM_URL,
} from '../config/site'
import { copyText } from '../utils/copyText'
import SiteFooter from '../components/SiteFooter.vue'
import { useDocsI18n } from '../i18n'

const { t } = useDocsI18n()
const copied = ref(false)

const pillars = computed(() => [
  {
    label: t.value.pillarCompleteLabel,
    title: t.value.pillarCompleteTitle,
    body: t.value.pillarCompleteBody,
  },
  {
    label: t.value.pillarThemeLabel,
    title: t.value.pillarThemeTitle,
    body: t.value.pillarThemeBody,
  },
  {
    label: t.value.pillarTypeScriptLabel,
    title: t.value.pillarTypeScriptTitle,
    body: t.value.pillarTypeScriptBody,
  },
  {
    label: t.value.pillarDocsLabel,
    title: t.value.pillarDocsTitle,
    body: t.value.pillarDocsBody,
  },
])

async function copyInstall() {
  const ok = await copyText(SITE_INSTALL_CMD)
  if (!ok) return
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <WiScrollbar class="home-scroll">
    <div class="home-page">
      <section class="home-hero">
        <img class="home-logo" :src="SITE_LOGO_URL" width="96" height="96" alt="" />
        <p class="home-kicker">
          {{ t.homeKicker }}
        </p>
        <h1 class="home-brand">
          {{ SITE_NAME }}
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
          <a :href="SITE_GITHUB_URL" target="_blank" rel="noopener noreferrer">
            <WiButton :label="t.viewGithub" outlined />
          </a>
        </div>
        <div class="home-meta" :aria-label="t.techTags">
          <span>Vue 3</span>
          <span>88 Components</span>
          <span>TypeScript</span>
          <span>MIT</span>
        </div>
      </section>

      <section class="home-install" :aria-label="t.installTitle">
        <div class="home-install__head">
          <h2>{{ t.installTitle }}</h2>
          <p>{{ t.installHint }}</p>
        </div>
        <div class="home-install__cmd">
          <code>{{ SITE_INSTALL_CMD }}</code>
          <button class="home-install__copy" type="button" @click="copyInstall">
            {{ copied ? t.copied : t.copy }}
          </button>
        </div>
        <a class="home-install__npm" :href="SITE_NPM_URL" target="_blank" rel="noopener noreferrer">
          {{ t.viewNpm }}
        </a>
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
          <RouterLink class="home-text-link" :to="{ name: 'changelog' }">
            {{ t.changelog }}
          </RouterLink>
        </div>
      </section>

      <SiteFooter />
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
  padding: clamp(2.5rem, 7vw, 5.5rem) clamp(1.25rem, 4vw, 3rem) 3rem;
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
  height: clamp(4.5rem, 12vw, 6rem);
  margin: 0 0 1.25rem;
  width: clamp(4.5rem, 12vw, 6rem);
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
  font-size: clamp(3rem, 8vw, 5.5rem);
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

.home-install {
  animation: home-rise 0.75s var(--wi-motion-ease) both;
  background: color-mix(in srgb, var(--wi-color-surface) 72%, transparent);
  border: 1px solid var(--docs-edge);
  border-radius: 1.1rem;
  margin-top: clamp(2.5rem, 6vw, 3.5rem);
  padding: 1.35rem 1.25rem 1.2rem;
}

.home-install__head h2 {
  font-family: var(--docs-display);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0 0 0.35rem;
}

.home-install__head p {
  color: var(--wi-color-text-muted);
  font-size: 0.9rem;
  line-height: 1.55;
  margin: 0 0 1rem;
}

.home-install__cmd {
  align-items: center;
  background: color-mix(in srgb, var(--wi-color-text) 4%, var(--wi-color-surface));
  border: 1px solid var(--docs-edge);
  border-radius: 0.75rem;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  padding: 0.75rem 0.85rem;
}

.home-install__cmd code {
  color: var(--wi-color-text);
  font-family: var(--docs-mono);
  font-size: 0.84rem;
}

.home-install__copy {
  background: color-mix(in srgb, var(--wi-color-primary) 12%, var(--wi-color-surface));
  border: 1px solid color-mix(in srgb, var(--wi-color-primary) 28%, transparent);
  border-radius: 0.55rem;
  color: var(--wi-color-primary);
  cursor: pointer;
  font-family: var(--docs-mono);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
}

.home-install__npm {
  color: var(--wi-color-primary);
  display: inline-block;
  font-size: 0.84rem;
  font-weight: 600;
  margin-top: 0.85rem;
  text-decoration: none;
}

.home-install__npm:hover {
  text-decoration: underline;
}

.home-pillars {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: clamp(2rem, 5vw, 3rem);
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
  animation-delay: 0.06s;
}

.home-pillar:nth-child(3) {
  animation-delay: 0.12s;
}

.home-pillar:nth-child(4) {
  animation-delay: 0.18s;
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
  font-size: 1.25rem;
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
  margin-top: 3rem;
  padding-top: 2rem;
  padding-bottom: 0.5rem;
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
  .home-install,
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
