---
title: SSR & meta-frameworks
order: 7
description: Use Roost Design UI with Nuxt, Astro, Vite SSR, and other server-rendered setups.
---

# SSR & meta-frameworks

Roost Design UI targets **Vue 3** SSR (3.5+ recommended): the server never touches `document` / `window`, instance ids stay stable across server and client, and imperative APIs (`toast` / `message` / `confirm`) no-op safely on the server.

All setups below are supported; choose **full SSR** or **client islands** based on your app.

## Shared checklist

| Topic | Recommendation |
| --- | --- |
| Styles | Import `@roost-design/ui/styles.css` in app entry or framework config |
| Theme | Prefer root **`RdConfigProvider`** for `theme` / `density` instead of calling `useTheme()` alone during SSR |
| Imperative APIs | `toast()`, `message()`, `confirm()` run in the browser only; SSR calls are safe no-ops |
| On-demand | Use `@roost-design/ui/resolver` with `unplugin-vue-components` |
| Overlays | Dialog / Select / Tooltip use Vue `Teleport`; SSR renders placeholders, interaction hydrates on the client |

## Nuxt 3

Use the **`@roost-design/nuxt`** module (`packages/nuxt` in this repo).

### Install

```bash
pnpm add @roost-design/ui @roost-design/nuxt
pnpm add -D unplugin-vue-components
```

### Config

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { RoostDesignResolver } from '@roost-design/ui/resolver'

export default defineNuxtConfig({
  modules: ['@roost-design/nuxt'],
  vite: {
    plugins: [
      Components({
        resolvers: [RoostDesignResolver()],
      }),
    ],
  },
})
```

The module by default:

- Adds `@roost-design/ui/styles.css`
- Transpiles `@roost-design/ui` for SSR
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

With on-demand imports you do not need `app.use(RoostDesign)`; for full registration, add a client plugin with `nuxtApp.vueApp.use(RoostDesign)`.

### Client-only islands

Wrap edge cases that need browser-only targets in `<ClientOnly>`.

## Astro + Vue

Best for **static sites + Vue islands** (admin shells embedded in marketing pages).

### Install

```bash
pnpm add @roost-design/ui
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
import { RdButton, RdConfigProvider } from '@roost-design/ui'
import '@roost-design/ui/styles.css'
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
import '@roost-design/ui/styles.css'

export function createApp() {
  return { app: createSSRApp(App) }
}
```

Client entry:

```ts
import { createRoostDesign } from '@roost-design/ui'

app.use(createRoostDesign({ components: false })).mount('#app')
```

Add `@roost-design/ui` to `ssr.noExternal` so `.vue` and CSS side effects resolve correctly.

## Other Vue SSR stacks

| Stack | Notes |
| --- | --- |
| **Quasar SSR** | Add `@roost-design/ui` to `build.transpileDependencies`; import styles in entry |
| **vike / vite-plugin-ssr** | Same as Vite SSR |
| **Inertia + Vue SSR** | Wrap with `RdConfigProvider`; call imperative APIs after mount |

## Limitations

- **Vue 2 is not supported** (Vue 3 SSR only).
- **IE** is out of scope.
- Theme `localStorage` persistence is client-only; sync theme via `RdConfigProvider` or cookies to avoid flash.
- Full SSR E2E coverage is evolving; please [open an issue](https://github.com/roost-design/roost-design-ui/issues) with a minimal repro if you see hydration warnings.

## Next

- [Quick start](/docs/quick-start)
- [Config](/docs/config)
- [Theme](/docs/theme)
