---
title: SSR & meta-frameworks
order: 7
description: Use Wex Design UI with Nuxt, Astro, Vite SSR, and other server-rendered setups.
---

# SSR & meta-frameworks

Wex Design UI targets **Vue 3** SSR (3.5+ recommended): the server never touches `document` / `window`, instance ids stay stable across server and client, and imperative APIs (`toast` / `message` / `confirm`) no-op safely on the server.

All setups below are supported; choose **full SSR** or **client islands** based on your app.

## Shared checklist

| Topic | Recommendation |
| --- | --- |
| Styles | Import `@wex-design/ui/styles.css` in app entry or framework config |
| Theme | Prefer root **`WdConfigProvider`** for `theme` / `density` instead of calling `useTheme()` alone during SSR |
| Imperative APIs | `toast()`, `message()`, `confirm()` run in the browser only; SSR calls are safe no-ops |
| On-demand | Use `@wex-design/ui/resolver` with `unplugin-vue-components` |
| Overlays | Dialog / Select / Tooltip use Vue `Teleport`; SSR renders placeholders, interaction hydrates on the client |

## Nuxt 3

Use the **`@wex-design/nuxt`** module (`packages/nuxt` in this repo).

### Install

```bash
pnpm add @wex-design/ui @wex-design/nuxt
pnpm add -D unplugin-vue-components
```

### Config

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { WexDesignResolver } from '@wex-design/ui/resolver'

export default defineNuxtConfig({
  modules: ['@wex-design/nuxt'],
  vite: {
    plugins: [
      Components({
        resolvers: [WexDesignResolver()],
      }),
    ],
  },
})
```

The module by default:

- Adds `@wex-design/ui/styles.css`
- Transpiles `@wex-design/ui` for SSR
- Registers overlay app context on the client (for `toast` / `message`)

### Root layout

```vue
<!-- app.vue -->
<template>
  <WdConfigProvider :theme="theme" density="comfortable">
    <NuxtPage />
  </WdConfigProvider>
</template>

<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')
</script>
```

With on-demand imports you do not need `app.use(WexDesign)`; for full registration, add a client plugin with `nuxtApp.vueApp.use(WexDesign)`.

### Client-only islands

Wrap edge cases that need browser-only targets in `<ClientOnly>`.

## Astro + Vue

Best for **static sites + Vue islands** (admin shells embedded in marketing pages).

### Install

```bash
pnpm add @wex-design/ui
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
import { WdButton, WdConfigProvider } from '@wex-design/ui'
import '@wex-design/ui/styles.css'
</script>

<template>
  <WdConfigProvider theme="light">
    <WdButton label="Hello" />
  </WdConfigProvider>
</template>
```

Use `client:load` or `client:only` for interactive admin UIs; `client:visible` for lazy hydration.

## Vite SSR

```ts
import { createSSRApp } from 'vue'
import App from './App.vue'
import '@wex-design/ui/styles.css'

export function createApp() {
  return { app: createSSRApp(App) }
}
```

Client entry:

```ts
import { createWexDesign } from '@wex-design/ui'

app.use(createWexDesign({ components: false })).mount('#app')
```

Add `@wex-design/ui` to `ssr.noExternal` so `.vue` and CSS side effects resolve correctly.

## Other Vue SSR stacks

| Stack | Notes |
| --- | --- |
| **Quasar SSR** | Add `@wex-design/ui` to `build.transpileDependencies`; import styles in entry |
| **vike / vite-plugin-ssr** | Same as Vite SSR |
| **Inertia + Vue SSR** | Wrap with `WdConfigProvider`; call imperative APIs after mount |

## Limitations

- **Vue 2 is not supported** (Vue 3 SSR only).
- **IE** is out of scope.
- Theme `localStorage` persistence is client-only; sync theme via `WdConfigProvider` or cookies to avoid flash.
- Full SSR E2E coverage is evolving; please [open an issue](https://github.com/wex-design/wex-design-ui/issues) with a minimal repro if you see hydration warnings.

## Next

- [Quick start](/docs/quick-start)
- [Config](/docs/config)
- [Theme](/docs/theme)
