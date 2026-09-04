<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  SITE_GITHUB_URL,
  SITE_LICENSE,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_NPM_URL,
  SITE_PACKAGE,
} from '../config/site'
import { getUiPackageMeta } from '../docs/packageMeta'
import { useDocsI18n } from '../i18n'

const uiMeta = getUiPackageMeta()
const { lang, t } = useDocsI18n()

const contributingUrl = computed(() =>
  lang.value === 'zh-CN'
    ? `${SITE_GITHUB_URL}/blob/main/CONTRIBUTING.zh-CN.md`
    : `${SITE_GITHUB_URL}/blob/main/CONTRIBUTING.md`,
)
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <RouterLink class="site-footer__brand" :to="{ name: 'home' }" :aria-label="t.homeAria">
        <img class="site-footer__logo" :src="SITE_LOGO_URL" width="20" height="20" alt="" />
        <span>{{ SITE_NAME }}</span>
        <span class="site-footer__version">v{{ uiMeta.version }}</span>
      </RouterLink>

      <nav class="site-footer__nav" :aria-label="t.footerNavAria">
        <RouterLink :to="{ name: 'docs', params: { slug: 'quick-start' } }">
          {{ t.docs }}
        </RouterLink>
        <RouterLink :to="{ name: 'components' }">
          {{ t.components }}
        </RouterLink>
        <a :href="SITE_GITHUB_URL" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a :href="SITE_NPM_URL" target="_blank" rel="noopener noreferrer">npm</a>
        <a :href="contributingUrl" target="_blank" rel="noopener noreferrer">
          {{ t.footerContributing }}
        </a>
      </nav>

      <p class="site-footer__meta">
        {{ SITE_PACKAGE }} · {{ SITE_LICENSE }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--docs-edge);
  margin-top: 2.5rem;
}

.site-footer__inner {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1.25rem;
  justify-content: space-between;
}

.site-footer__brand {
  align-items: center;
  color: var(--wd-color-text);
  display: inline-flex;
  font-family: var(--docs-display);
  font-size: 0.88rem;
  font-weight: 700;
  gap: 0.45rem;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.site-footer__logo {
  border-radius: 0.35rem;
  display: block;
}

.site-footer__version {
  color: var(--wd-color-text-muted);
  font-family: var(--docs-mono);
  font-size: 0.68rem;
  font-weight: 500;
}

.site-footer__nav {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.9rem;
}

.site-footer__nav a {
  color: var(--wd-color-text-muted);
  font-size: 0.78rem;
  font-weight: 500;
  text-decoration: none;
}

.site-footer__nav a:hover {
  color: var(--wd-color-primary);
}

.site-footer__meta {
  color: var(--wd-color-text-muted);
  font-family: var(--docs-mono);
  font-size: 0.64rem;
  letter-spacing: 0.03em;
  margin: 0;
  width: 100%;
}

@media (min-width: 900px) {
  .site-footer__meta {
    margin-left: auto;
    width: auto;
  }
}
</style>
