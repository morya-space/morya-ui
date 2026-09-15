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
    :respect-reduced-motion="true"
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
  filter: blur(64px);
  opacity: 0.22;
  position: absolute;
}

.site-atmosphere__glow--a {
  background: radial-gradient(circle, color-mix(in srgb, var(--m-color-primary) 40%, transparent) 0%, transparent 72%);
  height: 24rem;
  left: -10rem;
  top: -12rem;
  width: 24rem;
  animation: docs-drift 28s ease-in-out infinite alternate;
}

.site-atmosphere__glow--b {
  background: radial-gradient(circle, color-mix(in srgb, var(--m-color-primary) 22%, transparent) 0%, transparent 74%);
  bottom: -14rem;
  height: 28rem;
  opacity: 0.16;
  right: -12rem;
  width: 28rem;
  animation: docs-drift 34s ease-in-out infinite alternate-reverse;
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
