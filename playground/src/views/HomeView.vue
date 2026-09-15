<script setup lang="ts">
import { MButton, MScrollbar } from 'morya-ui'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import {
  SITE_GITHUB_URL,
  SITE_INSTALL_CMD,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_NPM_URL,
} from '../config/site'
import { useDocsI18n } from '../i18n'
import { copyText } from '../utils/copyText'

const { t } = useDocsI18n()
const copied = ref(false)

const pillars = computed(() => [
  {
    title: t.value.pillarCompleteTitle,
    body: t.value.pillarCompleteBody,
  },
  {
    title: t.value.pillarThemeTitle,
    body: t.value.pillarThemeBody,
  },
  {
    title: t.value.pillarTypeScriptTitle,
    body: t.value.pillarTypeScriptBody,
  },
  {
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
  <MScrollbar class="home-scroll">
    <div class="home-page">
      <section class="home-hero">
        <img class="home-logo" :src="SITE_LOGO_URL" width="96" height="96" alt="">
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
            <MButton :label="t.start" />
          </RouterLink>
          <RouterLink :to="{ name: 'components' }">
            <MButton :label="t.browse" outlined />
          </RouterLink>
          <a :href="SITE_GITHUB_URL" target="_blank" rel="noopener noreferrer">
            <MButton :label="t.viewGithub" outlined />
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
  </MScrollbar>
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
  animation: home-rise 0.7s var(--m-motion-ease) both;
  max-width: 46rem;
  position: relative;
}

.home-logo {
  display: block;
  height: clamp(4rem, 10vw, 5.25rem);
  margin: 0 0 1.5rem;
  width: clamp(4rem, 10vw, 5.25rem);
}

.home-brand {
  color: var(--m-color-text);
  font-family: var(--docs-display);
  font-size: clamp(2.75rem, 7vw, 4.75rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.95;
  margin: 0 0 1rem;
  text-wrap: balance;
}

.home-headline {
  color: var(--m-color-text);
  font-family: var(--docs-display);
  font-size: clamp(1.2rem, 2.2vw, 1.55rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.35;
  margin: 0 0 0.85rem;
  max-width: 36rem;
  text-wrap: balance;
}

.home-lead {
  color: var(--m-color-text-muted);
  font-size: 1.05rem;
  line-height: 1.65;
  margin: 0;
  max-width: var(--docs-measure);
}

.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.home-actions a {
  text-decoration: none;
}

.home-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1.1rem;
  margin-top: 1.6rem;
}

.home-meta span {
  color: var(--m-color-text-muted);
  font-family: var(--docs-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.home-install {
  animation: home-rise 0.75s var(--m-motion-ease) both;
  border-top: 1px solid var(--docs-edge);
  margin-top: clamp(2.75rem, 6vw, 3.75rem);
  padding: 1.5rem 0 0;
}

.home-install__head h2 {
  font-family: var(--docs-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0 0 0.35rem;
}

.home-install__head p {
  color: var(--m-color-text-muted);
  font-size: 0.92rem;
  line-height: 1.55;
  margin: 0 0 1rem;
}

.home-install__cmd {
  align-items: center;
  background: color-mix(in srgb, var(--m-color-text) 3%, var(--m-color-surface));
  border: 1px solid var(--docs-edge);
  border-radius: var(--m-radius-md, 0.65rem);
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  padding: 0.7rem 0.8rem;
}

.home-install__cmd code {
  color: var(--m-color-text);
  font-family: var(--docs-mono);
  font-size: 0.84rem;
}

.home-install__copy {
  background: transparent;
  border: 1px solid var(--docs-edge);
  border-radius: var(--m-radius-sm, 0.45rem);
  color: var(--m-color-text-muted);
  cursor: pointer;
  font-family: var(--docs-mono);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  transition:
    border-color var(--m-motion-fast) var(--m-motion-ease),
    color var(--m-motion-fast) var(--m-motion-ease);
}

.home-install__copy:hover {
  border-color: color-mix(in srgb, var(--m-color-primary) 40%, var(--docs-edge));
  color: var(--m-color-primary);
}

.home-install__npm {
  color: var(--m-color-primary);
  display: inline-block;
  font-size: 0.84rem;
  font-weight: 600;
  margin-top: 0.85rem;
  text-decoration: none;
}

.home-install__npm:hover {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.home-pillars {
  display: grid;
  gap: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: clamp(2rem, 5vw, 3rem);
  border-top: 1px solid var(--docs-edge);
}

.home-pillar {
  animation: home-rise 0.8s var(--m-motion-ease) both;
  border-bottom: 1px solid var(--docs-edge);
  padding: 1.5rem 1.25rem 1.5rem 0;
}

.home-pillar:nth-child(even) {
  padding-left: 1.25rem;
  padding-right: 0;
  border-left: 1px solid var(--docs-edge);
}

.home-pillar:nth-child(2) {
  animation-delay: 0.05s;
}

.home-pillar:nth-child(3) {
  animation-delay: 0.1s;
}

.home-pillar:nth-child(4) {
  animation-delay: 0.15s;
}

.home-pillar h2 {
  font-family: var(--docs-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0 0 0.55rem;
}

.home-pillar p {
  color: var(--m-color-text-muted);
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0;
  max-width: 34rem;
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
  color: var(--m-color-text-muted);
  margin: 0;
}

.home-cta__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.home-text-link {
  color: var(--m-color-primary);
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
  html:not([data-m-ignore-reduced-motion]) .home-hero,
  html:not([data-m-ignore-reduced-motion]) .home-install,
  html:not([data-m-ignore-reduced-motion]) .home-pillar {
    animation: none;
  }
}

@media (max-width: 900px) {
  .home-pillars {
    grid-template-columns: 1fr;
  }

  .home-pillar:nth-child(even) {
    border-left: 0;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
