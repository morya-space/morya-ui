<script setup lang="ts">
import { useTheme } from '@well-insight/ui'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getUiPackageMeta } from '../docs/packageMeta'
import SiteSearch from './SiteSearch.vue'
import { useDocsI18n } from '../i18n'

const GITHUB_REPO = 'https://github.com/well-insight/well-insight-ui'
const uiMeta = getUiPackageMeta()

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const { lang, t, setLang } = useDocsI18n()

const activeSection = computed(() => {
  const name = String(route.name ?? '')
  if (name === 'home') return 'home'
  if (name.startsWith('docs')) return 'docs'
  if (name.startsWith('component')) return 'components'
  if (name === 'changelog') return 'changelog'
  return ''
})
</script>

<template>
  <header class="site-header">
    <RouterLink class="site-brand" :to="{ name: 'home' }" :aria-label="t.homeAria">
      <img class="site-brand__logo" :src="`${import.meta.env.BASE_URL}logo.svg`" width="32" height="32" alt="" />
      <span class="site-brand__text">
        <span class="site-brand__name">Well Insight</span>
        <span class="site-brand__version">UI · v{{ uiMeta.version }}</span>
      </span>
    </RouterLink>

    <nav class="site-nav" :aria-label="t.navAria">
      <RouterLink
        class="site-nav__link"
        :class="{ 'is-active': activeSection === 'home' }"
        :to="{ name: 'home' }"
      >
        {{ t.home }}
      </RouterLink>
      <RouterLink
        class="site-nav__link"
        :class="{ 'is-active': activeSection === 'docs' }"
        :to="{ name: 'docs', params: { slug: 'introduction' } }"
      >
        {{ t.docs }}
      </RouterLink>
      <RouterLink
        class="site-nav__link"
        :class="{ 'is-active': activeSection === 'components' }"
        :to="{ name: 'components' }"
      >
        {{ t.components }}
      </RouterLink>
      <RouterLink
        class="site-nav__link"
        :class="{ 'is-active': activeSection === 'changelog' }"
        :to="{ name: 'changelog' }"
      >
        {{ t.changelog }}
      </RouterLink>
    </nav>

    <div class="site-header__actions">
      <SiteSearch />
      <div class="site-lang" role="group" :aria-label="t.langSwitch">
        <button
          class="site-lang__btn"
          type="button"
          :class="{ 'is-active': lang === 'zh-CN' }"
          :aria-pressed="lang === 'zh-CN'"
          @click="setLang('zh-CN')"
        >
          中
        </button>
        <button
          class="site-lang__btn"
          type="button"
          :class="{ 'is-active': lang === 'en-US' }"
          :aria-pressed="lang === 'en-US'"
          @click="setLang('en-US')"
        >
          EN
        </button>
      </div>
      <button
        class="site-icon-btn"
        type="button"
        :aria-label="isDark ? t.switchToLight : t.switchToDark"
        :title="isDark ? t.lightMode : t.darkMode"
        @click="toggleTheme"
      >
        <span aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
      </button>
      <a
        class="site-icon-btn"
        :href="GITHUB_REPO"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="t.openGithub"
        :title="t.githubRepo"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
          <path
            d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
          />
        </svg>
      </a>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  align-items: center;
  background: color-mix(in srgb, var(--wi-color-surface) 72%, transparent);
  border-bottom: 1px solid var(--docs-edge);
  display: grid;
  flex: 0 0 auto;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  height: 4rem;
  padding: 0 clamp(1rem, 3vw, 2.5rem);
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 200;
  backdrop-filter: blur(16px) saturate(1.2);
}

.site-brand {
  align-items: center;
  color: var(--wi-color-text);
  display: inline-flex;
  gap: 0.75rem;
  text-decoration: none;
  width: max-content;
}

.site-brand__logo {
  border-radius: 0.55rem;
  box-shadow: 0 10px 28px color-mix(in srgb, var(--wi-color-primary) 28%, transparent);
  display: block;
  flex: 0 0 auto;
  height: 2rem;
  width: 2rem;
}

.site-brand__text {
  display: grid;
  gap: 0.05rem;
  line-height: 1.1;
}

.site-brand__name {
  font-family: var(--docs-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.site-brand__version {
  color: var(--wi-color-text-muted);
  font-family: var(--docs-mono);
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.site-nav {
  align-items: center;
  background: color-mix(in srgb, var(--wi-color-surface) 55%, transparent);
  border: 1px solid var(--docs-edge);
  border-radius: 999px;
  display: flex;
  gap: 0.15rem;
  justify-content: center;
  padding: 0.2rem;
}

.site-nav__link {
  border-radius: 999px;
  color: var(--wi-color-text-muted);
  font-size: 0.84rem;
  font-weight: 600;
  padding: 0.42rem 0.95rem;
  text-decoration: none;
  transition:
    color var(--wi-motion-fast) var(--wi-motion-ease),
    background var(--wi-motion-fast) var(--wi-motion-ease),
    box-shadow var(--wi-motion-fast) var(--wi-motion-ease);
}

.site-nav__link:hover {
  color: var(--wi-color-text);
}

.site-nav__link.is-active {
  background: color-mix(in srgb, var(--wi-color-primary) 16%, var(--wi-color-surface));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wi-color-primary) 30%, transparent);
  color: var(--wi-color-primary);
}

.site-header__actions {
  align-items: center;
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
}

.site-lang {
  background: color-mix(in srgb, var(--wi-color-surface) 70%, transparent);
  border: 1px solid var(--docs-edge);
  border-radius: 0.65rem;
  display: inline-flex;
  overflow: hidden;
  padding: 0.12rem;
}

.site-lang__btn {
  background: transparent;
  border: 0;
  border-radius: 0.5rem;
  color: var(--wi-color-text-muted);
  cursor: pointer;
  font-family: var(--docs-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  min-width: 1.85rem;
  padding: 0.28rem 0.4rem;
}

.site-lang__btn:hover {
  color: var(--wi-color-text);
}

.site-lang__btn.is-active {
  background: color-mix(in srgb, var(--wi-color-primary) 16%, var(--wi-color-surface));
  color: var(--wi-color-primary);
}

.site-icon-btn {
  align-items: center;
  background: color-mix(in srgb, var(--wi-color-surface) 70%, transparent);
  border: 1px solid var(--docs-edge);
  border-radius: 0.65rem;
  color: var(--wi-color-text);
  cursor: pointer;
  display: inline-flex;
  height: 2.2rem;
  justify-content: center;
  text-decoration: none;
  transition:
    border-color var(--wi-motion-fast) var(--wi-motion-ease),
    color var(--wi-motion-fast) var(--wi-motion-ease),
    transform var(--wi-motion-fast) var(--wi-motion-ease);
  width: 2.2rem;
}

.site-icon-btn:hover {
  border-color: color-mix(in srgb, var(--wi-color-primary) 45%, var(--wi-color-border));
  color: var(--wi-color-primary);
  transform: translateY(-1px);
}

@media (max-width: 700px) {
  .site-header {
    grid-template-columns: 1fr auto;
    height: auto;
    padding: 0.7rem 0.85rem;
    row-gap: 0.55rem;
  }

  .site-brand__version {
    display: none;
  }

  .site-nav {
    grid-column: 1 / -1;
    justify-content: flex-start;
    order: 3;
    overflow-x: auto;
    width: 100%;
  }

  .site-header__actions {
    grid-column: 2;
    grid-row: 1;
  }
}
</style>
