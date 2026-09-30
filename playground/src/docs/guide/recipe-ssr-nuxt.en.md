---
title: Nuxt SSR
order: 25
description: Minimal end-to-end Morya UI setup with @morya-ui/nuxt.
---

# Nuxt SSR

Minimal Morya UI wiring for Nuxt 3: install the module, configure the on-demand resolver, wrap with `MConfigProvider`, then render one `MButton` page. The docs site cannot host a live Nuxt preview—this page is config + snippets. Astro / Vite SSR live in the [SSR overview](/docs/ssr).

## Goal

- Install `morya-ui` + `@morya-ui/nuxt`
- Let the module own styles, transpile, and client overlay context
- Wrap `app.vue` with `MConfigProvider` and render `MButton` on a page

## When to use

- Greenfield Nuxt 3 apps adopting the library
- Existing Nuxt apps that need stable SSR styles, transpile, and `toast` / `message` context

## Steps

### 1. Install

```bash
pnpm add morya-ui @morya-ui/nuxt
pnpm add -D unplugin-vue-components
```

### 2. `nuxt.config.ts`

```ts
import { MoryaUIResolver } from "morya-ui/resolver";
import Components from "unplugin-vue-components/vite";

export default defineNuxtConfig({
  modules: ["@morya-ui/nuxt"],
  // optional: moryaUI: { css: true, transpile: true }
  vite: {
    plugins: [
      Components({
        resolvers: [MoryaUIResolver()],
      }),
    ],
  },
});
```

By default the module: imports `morya-ui/styles.css`; adds `morya-ui` to `build.transpile`; registers overlay context on the **client** (`createMoryaUI({ components: false })` for `toast` / `message`).

### 3. `app.vue`

```vue
<script setup lang="ts">
const theme = ref<"light" | "dark">("light");
</script>

<template>
  <MConfigProvider :theme="theme" density="comfortable">
    <NuxtPage />
  </MConfigProvider>
</template>
```

On-demand imports do not need `app.use(MoryaUI)`. For full registration, add `plugins/morya-ui.client.ts`.

### 4. Sample page

```vue
<!-- pages/index.vue -->
<template>
  <main style="padding: 1.5rem">
    <MButton label="Hello Morya" />
  </main>
</template>
```

`MButton` can be auto-imported via `MoryaUIResolver`, or imported explicitly from `morya-ui`.

## Checklist

- [ ] Module `css: true` (default) or `morya-ui/styles.css` imported manually
- [ ] `transpile: true` so SSR does not ship uncompiled `.vue` / CSS side effects
- [ ] First-paint theme / density come from `MConfigProvider`; avoid solo `useTheme()` writes during SSR
- [ ] `toast` / `message` / `confirm` are browser-only; the module ships the client overlay plugin
- [ ] Wrap browser-only DOM cases (e.g. `appendTo` missing nodes) in `<ClientOnly>`

## Related

- [SSR & meta-frameworks](/docs/ssr) (Astro / Vite SSR)
- [Quick start](/docs/quick-start) · [Configuration](/docs/config) · [Theme](/docs/theme)
- [`@morya-ui/nuxt`](https://www.npmjs.com/package/@morya-ui/nuxt) (repo `packages/nuxt`)
