---
title: Quick start
order: 2
description: Install the package, import styles, and render the first component.
---

# Quick start

> Live docs: [wex-design.github.io/wex-design-ui](https://wex-design.github.io/wex-design-ui/) · Source: [GitHub](https://github.com/wex-design/wex-design-ui) · npm: [`@wex-design/ui`](https://www.npmjs.com/package/@wex-design/ui)

## Install

**In an application (npm / pnpm / yarn):**

```bash
pnpm add @wex-design/ui
```

Requires Vue 3 (3.5+ recommended). Theme tokens, color-mode switching, and motion APIs are all included in `@wex-design/ui`.

After cloning this repository, run `pnpm install`. The docs playground resolves source via Vite aliases (see `playground/vite.config.ts`).

To debug from another app, use `link:` / `pnpm link` plus Vite aliases. A plain npm install always resolves `dist/`.

## Choose an import mode

The library supports **full** and **on-demand** usage. Pick one per app (stay consistent within a project).

| | Full | On-demand |
| --- | --- | --- |
| Best for | Many components, fastest setup | Bundle size, few components |
| Components | `app.use(WexDesign)` or named imports from `@wex-design/ui` | `@wex-design/ui/button` subpaths, or Vite auto-resolver |
| Styles | Import `@wex-design/ui/styles.css` at entry | Bundled with subpath imports (theme + deps) |
| JS size | Full plugin bundles all components; named imports tree-shake | Only used components and their deps |

## Full usage

### 1. Plugin registration (recommended full mode)

Import the **full stylesheet** and register all components once:

```ts
import WexDesign from '@wex-design/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@wex-design/ui/styles.css'

createApp(App).use(WexDesign).mount('#app')
```

Templates can use `<WdButton>`, `<WdInput>`, etc. without per-file imports.

### 2. Named imports + full CSS

Skip the plugin; import components in SFCs. JS can tree-shake, but styles still need the full CSS file:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import '@wex-design/ui/styles.css'

createApp(App).mount('#app')
```

```vue
<script setup lang="ts">
import { WdButton, WdInput } from '@wex-design/ui'
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 20rem">
    <WdInput v-model="name" label="Name" placeholder="Enter a name" />
    <WdButton label="Submit" @click="() => undefined" />
  </div>
</template>
```

## On-demand usage

### 1. Subpath imports

Import from kebab-case subpaths (e.g. `button`, `input-password`, `tree-select`). Each entry bundles component JS, internal dependencies, and styles — **no** `@wex-design/ui/styles.css` required:

```ts
import { WdButton } from '@wex-design/ui/button'
import { WdInput } from '@wex-design/ui/input'
```

Styles only:

```ts
import '@wex-design/ui/button/style'
import '@wex-design/ui/button/style.css'
```

### 2. Auto on-demand (Vite)

With `unplugin-vue-components`, add the resolver so templates can use `<WdButton>` without manual imports:

```ts
import { WexDesignResolver } from '@wex-design/ui/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({ resolvers: [WexDesignResolver()] }),
  ],
})
```

In on-demand mode, `createWexDesign({ components: false })` still applies global config without registering components.

## Optional: app-level defaults

`createWexDesign` applies global defaults and registers all components by default:

```ts
import { createWexDesign } from '@wex-design/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@wex-design/ui/styles.css'

createApp(App)
  .use(
    createWexDesign({
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
import { useTheme } from '@wex-design/ui'

const { toggleTheme } = useTheme()
```

See [Theme](/docs/theme).

## Run this docs site

```bash
pnpm --filter @wex-design/ui dev
# http://localhost:5182

# Build the static docs site
pnpm --filter @wex-design/ui build:docs
```
