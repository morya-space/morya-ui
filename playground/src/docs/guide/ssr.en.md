---
title: SSR & meta-frameworks
order: 7
description: Use Well Insight UI with Nuxt, Astro, Vite SSR, and other server-rendered setups.
---

# SSR & meta-frameworks

Well Insight UI targets **Vue 3** SSR (3.5+ recommended): the server never touches `document` / `window`, instance ids stay stable across server and client, and imperative APIs (`toast` / `message` / `confirm`) no-op safely on the server.

All setups below are supported; choose **full SSR** or **client islands** based on your app.

## Shared checklist

| Topic | Recommendation |
| --- | --- |
| Styles | Import `@well-insight/ui/styles.css` in app entry or framework config |
| Theme | Prefer root **`WiConfigProvider`** for `theme` / `density` instead of calling `useTheme()` alone during SSR |
| Imperative APIs | `toast()`, `message()`, `confirm()` run in the browser only; SSR calls are safe no-ops |
| On-demand | Use `@well-insight/ui/resolver` with `unplugin-vue-components` |
| Overlays | Dialog / Select / Tooltip use Vue `Teleport`; SSR renders placeholders, interaction hydrates on the client |

## Nuxt 3

Use the **`@well-insight/nuxt`** module (`packages/nuxt` in this repo).

### Install

```bash
pnpm add @well-insight/ui @well-insight/nuxt
pnpm add -D unplugin-vue-components
```

### Config

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { WellInsightResolver } from '@well-insight/ui/resolver'

export default defineNuxtConfig({
  modules: ['@well-insight/nuxt'],
  vite: {
    plugins: [
      Components({
        resolvers: [WellInsightResolver()],
      }),
    ],
  },
})
```

The module by default:

- Adds `@well-insight/ui/styles.css`
- Transpiles `@well-insight/ui` for SSR
- Registers overlay app context on the client (for `toast` / `message`)

### Root layout

```vue
<!-- app.vue -->
<template>
  <WiConfigProvider :theme="theme" density="comfortable">
    <NuxtPage />
  </WiConfigProvider>
</template>

<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')
</script>
```

With on-demand imports you do not need `app.use(WellInsight)`; for full registration, add a client plugin with `nuxtApp.vueApp.use(WellInsight)`.

### Client-only islands

Wrap edge cases that need browser-only targets in `<ClientOnly>`.

## Astro + Vue

Best for **static sites + Vue islands** (admin shells embedded in marketing pages).

### Install

```bash
pnpm add @well-insight/ui
npx astro add vue
```

### Vue island

```astro
---
import AdminShell from '../components/AdminShell.vue'
---
<AdminShell client:load />
```

```vue
<script setup lang="ts">
import { WiButton, WiConfigProvider } from '@well-insight/ui'
import '@well-insight/ui/styles.css'
</script>

<template>
  <WiConfigProvider theme="light">
    <WiButton label="Hello" />
  </WiConfigProvider>
</template>
```

Use `client:load` or `client:only` for interactive admin UIs; `client:visible` for lazy hydration.

## Vite SSR

```ts
import { createSSRApp } from 'vue'
import App from './App.vue'
import '@well-insight/ui/styles.css'

export function createApp() {
  return { app: createSSRApp(App) }
}
```

Client entry:

```ts
import { createWellInsight } from '@well-insight/ui'

app.use(createWellInsight({ components: false })).mount('#app')
```

Add `@well-insight/ui` to `ssr.noExternal` so `.vue` and CSS side effects resolve correctly.

## Other Vue SSR stacks

| Stack | Notes |
| --- | --- |
| **Quasar SSR** | Add `@well-insight/ui` to `build.transpileDependencies`; import styles in entry |
| **vike / vite-plugin-ssr** | Same as Vite SSR |
| **Inertia + Vue SSR** | Wrap with `WiConfigProvider`; call imperative APIs after mount |

## Limitations

- **Vue 2 is not supported** (Vue 3 SSR only).
- **IE** is out of scope.
- Theme `localStorage` persistence is client-only; sync theme via `WiConfigProvider` or cookies to avoid flash.
- Full SSR E2E coverage is evolving; please [open an issue](https://github.com/well-insight/well-insight-ui/issues) with a minimal repro if you see hydration warnings.

## Next

- [Quick start](/docs/quick-start)
- [Config](/docs/config)
- [Theme](/docs/theme)
