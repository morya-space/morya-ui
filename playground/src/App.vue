<script setup lang="ts">
import { MConfigProvider, useDensity, useMotion } from 'morya-ui'
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import { useDocsI18n } from './i18n'

const { componentLocale } = useDocsI18n()
useMotion()
useDensity()
</script>

<template>
  <MConfigProvider
    class="site-config"
    :locale="componentLocale"
    :global-density="false"
    :respect-reduced-motion="false"
  >
    <div class="site-shell">
      <div class="site-atmosphere" aria-hidden="true">
        <div class="site-atmosphere__glow site-atmosphere__glow--a" />
        <div class="site-atmosphere__glow site-atmosphere__glow--b" />
      </div>
      <SiteHeader />
      <div class="site-shell__body">
        <RouterView />
      </div>
    </div>
  </MConfigProvider>
</template>

<style>
:root {
  --docs-display: 'Syne', 'Segoe UI', sans-serif;
  --docs-body: 'IBM Plex Sans', 'Segoe UI', sans-serif;
  --docs-mono: 'JetBrains Mono', ui-monospace, monospace;
  --docs-ink: var(--m-color-text);
  --docs-glow: color-mix(in srgb, var(--m-color-primary) 72%, var(--m-color-text-muted));
  --docs-panel: color-mix(in srgb, var(--m-color-surface) 88%, transparent);
  --docs-edge: color-mix(in srgb, var(--m-color-border) 82%, transparent);
  --docs-measure: 68ch;
  /* Shared surfaces & tints so views don't repeat magic color-mix values */
  --docs-surface-subtle: color-mix(in srgb, var(--m-color-text) 2.5%, var(--m-color-surface));
  --docs-surface-sunken: color-mix(in srgb, var(--m-color-text) 3.5%, var(--m-color-surface));
  --docs-surface-raised: color-mix(in srgb, var(--m-color-text) 5%, var(--m-color-surface));
  --docs-edge-strong: color-mix(in srgb, var(--m-color-border) 90%, transparent);
  --docs-primary-soft: color-mix(in srgb, var(--m-color-primary) 8%, transparent);
  --docs-primary-mid: color-mix(in srgb, var(--m-color-primary) 14%, transparent);
  --docs-primary-edge: color-mix(in srgb, var(--m-color-primary) 32%, var(--docs-edge));
  --docs-shadow-card:
    0 1px 2px color-mix(in srgb, var(--m-color-text) 3%, transparent),
    0 4px 16px -4px color-mix(in srgb, var(--m-color-text) 4%, transparent);
  --docs-shadow-card-hover:
    0 1px 2px color-mix(in srgb, var(--m-color-text) 4%, transparent),
    0 10px 28px -6px color-mix(in srgb, var(--m-color-text) 7%, transparent);

  color: var(--m-color-text);
  background: var(--m-color-surface);
  font-family: var(--docs-body);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection {
  background: color-mix(in srgb, var(--m-color-primary) 28%, transparent);
  color: var(--m-color-text);
}

/* Slim, theme-aware scrollbars for native scroll areas (MScrollbar covers the rest) */
::-webkit-scrollbar {
  height: 0.55rem;
  width: 0.55rem;
}

::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--m-color-text) 14%, transparent);
  background-clip: padding-box;
  border: 0.14rem solid transparent;
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--m-color-text) 24%, transparent);
  background-clip: padding-box;
  border: 0.14rem solid transparent;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background: transparent;
}

html,
body,
#app {
  height: 100%;
}

body {
  margin: 0;
  min-width: 320px;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}

button,
input {
  font: inherit;
}

button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid var(--m-color-focus-ring);
  outline-offset: 2px;
}

.m-autocomplete__input:focus-visible,
.m-autocomplete__dropdown:focus-visible,
.m-select:focus-visible,
.m-icon-field input:focus-visible {
  outline: none;
  outline-offset: 0;
}

.site-config {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.site-shell {
  background: var(--m-color-surface);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.site-atmosphere {
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  z-index: 0;
}

.site-atmosphere__glow {
  border-radius: 50%;
  filter: blur(72px);
  opacity: 0.14;
  position: absolute;
  will-change: transform;
}

.site-atmosphere__glow--a {
  background: radial-gradient(circle, color-mix(in srgb, var(--m-color-primary) 46%, transparent) 0%, transparent 72%);
  height: 26rem;
  left: -10rem;
  top: -13rem;
  width: 26rem;
  animation: docs-drift 28s ease-in-out infinite alternate;
}

.site-atmosphere__glow--b {
  background: radial-gradient(circle, color-mix(in srgb, var(--m-color-primary) 24%, transparent) 0%, transparent 74%);
  bottom: -15rem;
  height: 30rem;
  opacity: 0.1;
  right: -13rem;
  width: 30rem;
  animation: docs-drift 34s ease-in-out infinite alternate-reverse;
}

/* Dark mode: richer ambient glow since surfaces are deeper */
html[data-theme='dark'] .site-atmosphere__glow--a {
  opacity: 0.22;
}

html[data-theme='dark'] .site-atmosphere__glow--b {
  opacity: 0.15;
}

.site-shell__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

@keyframes docs-drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(1.25rem, 1rem, 0) scale(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  html:not([data-m-ignore-reduced-motion]) .site-atmosphere__glow--a,
  html:not([data-m-ignore-reduced-motion]) .site-atmosphere__glow--b {
    animation: none;
  }
}

@media (max-width: 700px) {
  body {
    overflow: auto;
  }

  .site-shell {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .site-config {
    height: auto;
    min-height: 100vh;
  }

  .site-shell__body {
    overflow: visible;
  }
}
</style>
