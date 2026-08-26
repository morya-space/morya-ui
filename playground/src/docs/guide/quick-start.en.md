---
title: Quick start
order: 2
description: Install the package, import styles, and render the first component.
---

# Quick start

## Install

**In an application (npm / pnpm / yarn):**

```bash
pnpm add @well-insight/ui
```

Vue 3.5+ is required. Theme tokens, color-mode switching, and motion APIs are all included in `@well-insight/ui`.

After cloning this repository, run `pnpm install`. The docs playground resolves source via Vite aliases (see `playground/vite.config.ts`).

To debug from another app, use `link:` / `pnpm link` plus Vite aliases. A plain npm install always resolves `dist/`.

## Choose an import mode

The library supports **full** and **on-demand** usage. Pick one per app (stay consistent within a project).

| | Full | On-demand |
| --- | --- | --- |
| Best for | Many components, fastest setup | Bundle size, few components |
| Components | `app.use(WellInsight)` or named imports from `@well-insight/ui` | `@well-insight/ui/button` subpaths, or Vite auto-resolver |
| Styles | Import `@well-insight/ui/styles.css` at entry | Bundled with subpath imports (theme + deps) |
| JS size | Full plugin bundles all components; named imports tree-shake | Only used components and their deps |

## Full usage

### 1. Plugin registration (recommended full mode)

Import the **full stylesheet** and register all components once:

```ts
import { createApp } from 'vue'
import WellInsight from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).use(WellInsight).mount('#app')
```

Templates can use `<WiButton>`, `<WiInput>`, etc. without per-file imports.

### 2. Named imports + full CSS

Skip the plugin; import components in SFCs. JS can tree-shake, but styles still need the full CSS file:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).mount('#app')
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiInput } from '@well-insight/ui'

const name = ref('')
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 20rem">
    <WiInput v-model="name" label="Name" placeholder="Enter a name" />
    <WiButton label="Submit" @click="() => undefined" />
  </div>
</template>
```

## On-demand usage

### 1. Subpath imports

Import from kebab-case subpaths (e.g. `button`, `input-password`, `tree-select`). Each entry bundles component JS, internal dependencies, and styles — **no** `@well-insight/ui/styles.css` required:

```ts
import { WiButton } from '@well-insight/ui/button'
import { WiInput } from '@well-insight/ui/input'
```

Styles only:

```ts
import '@well-insight/ui/button/style'
import '@well-insight/ui/button/style.css'
```

### 2. Auto on-demand (Vite)

With `unplugin-vue-components`, add the resolver so templates can use `<WiButton>` without manual imports:

```ts
import Components from 'unplugin-vue-components/vite'
import { WellInsightResolver } from '@well-insight/ui/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({ resolvers: [WellInsightResolver()] }),
  ],
})
```

In on-demand mode, `createWellInsight({ components: false })` still applies global config without registering components.

## Optional: app-level defaults

`createWellInsight` applies global defaults and registers all components by default:

```ts
import { createApp } from 'vue'
import { createWellInsight } from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App)
  .use(
    createWellInsight({
      appendTo: 'body',
      size: 'small',
      zIndex: 1100,
    }),
  )
  .mount('#app')
```

Use `components: false` for config-only install.

See [Configuration](/docs/config) for details.

## Theme API

Color-mode helpers come from the same package:

```ts
import { useTheme } from '@well-insight/ui'

const { toggleTheme } = useTheme()
```

See [Theme](/docs/theme).

## Run this docs site

```bash
pnpm --filter @well-insight/ui dev
# http://localhost:5182

# Build the static docs site
pnpm --filter @well-insight/ui build:docs
```
