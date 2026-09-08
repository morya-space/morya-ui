---
title: SSR & meta-frameworks
order: 7
description: Use Wise Kit UI with Nuxt, Astro, Vite SSR, and other server-rendered setups.
---

# SSR & meta-frameworks

Wise Kit UI targets **Vue 3** SSR (3.5+ recommended): the server never touches `document` / `window`, instance ids stay stable across server and client, and imperative APIs (`toast` / `message` / `confirm`) no-op safely on the server.

All setups below are supported; choose **full SSR** or **client islands** based on your app.

## Shared checklist

| Topic | Recommendation |
| --- | --- |
| Styles | Import `@wise-kit/ui/styles.css` in app entry or framework config |
| Theme | Prefer root **`RdConfigProvider`** for `theme` / `density` instead of calling `useTheme()` alone during SSR |
| Imperative APIs | `toast()`, `message()`, `confirm()` run in the browser only; SSR calls are safe no-ops |
| On-demand | Use `@wise-kit/ui/resolver` with `unplugin-vue-components` |
| Overlays | Dialog / Select / Tooltip use Vue `Teleport`; SSR renders placeholders, interaction hydrates on the client |

## Nuxt 3

Use the **`@wise-kit/nuxt`** module (`packages/nuxt` in this repo).

### Install

```bash
pnpm add @wise-kit/ui @wise-kit/nuxt
pnpm add -D unplugin-vue-components
```

### Config

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { WiseKitResolver } from '@wise-kit/ui/resolver'

export default defineNuxtConfig({
  modules: ['@wise-kit/nuxt'],
  vite: {
    plugins: [
      Components({
        resolvers: [WiseKitResolver()],
      }),
    ],
  },
})
```

The module by default:

- Adds `@wise-kit/ui/styles.css`
- Transpiles `@wise-kit/ui` for SSR
- Registers overlay app context on the client (for `toast` / `message`)

### Root layout

```vue
<!-- app.vue -->
<template>
  <RdConfigProvider :theme="theme" density="comfortable">
    <NuxtPage />
  </RdConfigProvider>
</template>

<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')
</script>
```

With on-demand imports you do not need `app.use(WiseKit)`; for full registration, add a client plugin with `nuxtApp.vueApp.use(WiseKit)`.

### Client-only islands

Wrap edge cases that need browser-only targets in `<ClientOnly>`.

## Astro + Vue

Best for **static sites + Vue islands** (admin shells embedded in marketing pages).

### Install

```bash
pnpm add @wise-kit/ui
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
import { RdButton, RdConfigProvider } from '@wise-kit/ui'
import '@wise-kit/ui/styles.css'
</script>

<template>
  <RdConfigProvider theme="light">
    <RdButton label="Hello" />
  </RdConfigProvider>
</template>
```

Use `client:load` or `client:only` for interactive admin UIs; `client:visible` for lazy hydration.

## Vite SSR

```ts
import { createSSRApp } from 'vue'
import App from './App.vue'
import '@wise-kit/ui/styles.css'

export function createApp() {
  return { app: createSSRApp(App) }
}
```

Client entry:

```ts
import { createWiseKit } from '@wise-kit/ui'

app.use(createWiseKit({ components: false })).mount('#app')
```

Add `@wise-kit/ui` to `ssr.noExternal` so `.vue` and CSS side effects resolve correctly.

## Other Vue SSR stacks

| Stack | Notes |
| --- | --- |
| **Quasar SSR** | Add `@wise-kit/ui` to `build.transpileDependencies`; import styles in entry |
| **vike / vite-plugin-ssr** | Same as Vite SSR |
| **Inertia + Vue SSR** | Wrap with `RdConfigProvider`; call imperative APIs after mount |

## Limitations

- **Vue 2 is not supported** (Vue 3 SSR only).
- **IE** is out of scope.
- Theme `localStorage` persistence is client-only; sync theme via `RdConfigProvider` or cookies to avoid flash.
- Full SSR E2E coverage is evolving; please [open an issue](https://github.com/wise-kit/wise-kit-ui/issues) with a minimal repro if you see hydration warnings.

## Next

- [Quick start](/docs/quick-start)
- [Config](/docs/config)
- [Theme](/docs/theme)
