<script setup lang="ts">
import { RouterView } from 'vue-router'
import { WiConfigProvider } from '@well-insight/ui'
import SiteHeader from './components/SiteHeader.vue'
import { useDocsI18n } from './i18n'

const { componentLocale } = useDocsI18n()
</script>

<template>
  <WiConfigProvider class="site-config" :locale="componentLocale" :global-density="false">
    <div class="site-shell">
    <div class="site-atmosphere" aria-hidden="true">
      <div class="site-atmosphere__glow site-atmosphere__glow--a" />
      <div class="site-atmosphere__glow site-atmosphere__glow--b" />
      <div class="site-atmosphere__grid" />
    </div>
    <SiteHeader />
    <div class="site-shell__body">
      <RouterView />
    </div>
    </div>
  </WiConfigProvider>
</template>

<style>
:root {
  --docs-display: 'Syne', 'Segoe UI', sans-serif;
  --docs-body: 'IBM Plex Sans', 'Segoe UI', sans-serif;
  --docs-mono: 'IBM Plex Mono', ui-monospace, monospace;
  --docs-ink: color-mix(in srgb, var(--wi-color-text) 92%, #041018);
  --docs-glow: color-mix(in srgb, var(--wi-color-primary) 55%, #22d3ee);
  --docs-panel: color-mix(in srgb, var(--wi-color-surface) 78%, transparent);
  --docs-edge: color-mix(in srgb, var(--wi-color-border) 70%, transparent);

  color: var(--wi-color-text);
  background: var(--wi-color-surface);
  font-family: var(--docs-body);
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
  outline: 3px solid color-mix(in srgb, var(--wi-color-focus-ring) 40%, transparent);
  outline-offset: 3px;
}

.wi-autocomplete__input:focus-visible,
.wi-autocomplete__dropdown:focus-visible,
.wi-select:focus-visible,
.wi-icon-field input:focus-visible {
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
  background: var(--wi-color-surface);
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
  filter: blur(48px);
  opacity: 0.42;
  position: absolute;
}

.site-atmosphere__glow--a {
  background: radial-gradient(circle, var(--docs-glow) 0%, transparent 68%);
  height: 28rem;
  left: -8rem;
  top: -10rem;
  width: 28rem;
  animation: docs-drift 18s ease-in-out infinite alternate;
}

.site-atmosphere__glow--b {
  background: radial-gradient(circle, color-mix(in srgb, var(--wi-color-primary) 45%, #0ea5e9) 0%, transparent 70%);
  bottom: -12rem;
  height: 32rem;
  opacity: 0.28;
  right: -10rem;
  width: 32rem;
  animation: docs-drift 22s ease-in-out infinite alternate-reverse;
}

.site-atmosphere__grid {
  background-image:
    linear-gradient(var(--docs-edge) 1px, transparent 1px),
    linear-gradient(90deg, var(--docs-edge) 1px, transparent 1px);
  background-size: 48px 48px;
  inset: 0;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, #000 20%, transparent 75%);
  opacity: 0.35;
  position: absolute;
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
    transform: translate3d(2rem, 1.5rem, 0) scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-atmosphere__glow--a,
  .site-atmosphere__glow--b {
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
