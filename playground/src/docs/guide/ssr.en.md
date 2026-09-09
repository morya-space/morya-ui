---
title: SSR & meta-frameworks
order: 7
description: Use Morya UI with Nuxt, Astro, Vite SSR, and other server-rendered setups.
---

# SSR & meta-frameworks

Morya UI targets **Vue 3** SSR (3.5+ recommended): the server never touches `document` / `window`, instance ids stay stable across server and client, and imperative APIs (`toast` / `message` / `confirm`) no-op safely on the server.

All setups below are supported; choose **full SSR** or **client islands** based on your app.

## Shared checklist

| Topic | Recommendation |
| --- | --- |
| Styles | Import `morya-ui/styles.css` in app entry or framework config |
| Theme | Prefer root **`MConfigProvider`** for `theme` / `density` instead of calling `useTheme()` alone during SSR |
| Imperative APIs | `toast()`, `message()`, `confirm()` run in the browser only; SSR calls are safe no-ops |
| On-demand | Use `morya-ui/resolver` with `unplugin-vue-components` |
| Overlays | Dialog / Select / Tooltip use Vue `Teleport`; SSR renders placeholders, interaction hydrates on the client |

## Nuxt 3

Use the **`@morya-ui/nuxt`** module (`packages/nuxt` in this repo).

### Install

```bash
pnpm add morya-ui @morya-ui/nuxt
pnpm add -D unplugin-vue-components
```

### Config

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { MoryaUIResolver } from 'morya-ui/resolver'

export default defineNuxtConfig({
  modules: ['@morya-ui/nuxt'],
  vite: {
    plugins: [
      Components({
        resolvers: [MoryaUIResolver()],
      }),
    ],
  },
})
```

The module by default:

- Adds `morya-ui/styles.css`
- Transpiles `morya-ui` for SSR
- Registers overlay app context on the client (for `toast` / `message`)

### Root layout

```vue
<!-- app.vue -->
<template>
  <MConfigProvider :theme="theme" density="comfortable">
    <NuxtPage />
  </MConfigProvider>
</template>

<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')
</script>
```

With on-demand imports you do not need `app.use(MoryaUI)`; for full registration, add a client plugin with `nuxtApp.vueApp.use(MoryaUI)`.

### Client-only islands

Wrap edge cases that need browser-only targets in `<ClientOnly>`.

## Astro + Vue

Best for **static sites + Vue islands** (admin shells embedded in marketing pages).

### Install

```bash
pnpm add morya-ui
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
import { MButton, MConfigProvider } from 'morya-ui'
import 'morya-ui/styles.css'
</script>

<template>
  <MConfigProvider theme="light">
    <MButton label="Hello" />
  </MConfigProvider>
</template>
```

Use `client:load` or `client:only` for interactive admin UIs; `client:visible` for lazy hydration.

## Vite SSR

```ts
import { createSSRApp } from 'vue'
import App from './App.vue'
import 'morya-ui/styles.css'

export function createApp() {
  return { app: createSSRApp(App) }
}
```

Client entry:

```ts
import { createMoryaUI } from 'morya-ui'

app.use(createMoryaUI({ components: false })).mount('#app')
```

Add `morya-ui` to `ssr.noExternal` so `.vue` and CSS side effects resolve correctly.

## Other Vue SSR stacks

| Stack | Notes |
| --- | --- |
| **Quasar SSR** | Add `morya-ui` to `build.transpileDependencies`; import styles in entry |
| **vike / vite-plugin-ssr** | Same as Vite SSR |
| **Inertia + Vue SSR** | Wrap with `MConfigProvider`; call imperative APIs after mount |

## Limitations

- **Vue 2 is not supported** (Vue 3 SSR only).
- **IE** is out of scope.
- Theme `localStorage` persistence is client-only; sync theme via `MConfigProvider` or cookies to avoid flash.
- Full SSR E2E coverage is evolving; please [open an issue](https://github.com/morya-space/morya-ui/issues) with a minimal repro if you see hydration warnings.

## Next

- [Quick start](/docs/quick-start)
- [Config](/docs/config)
- [Theme](/docs/theme)
