---
title: Quick start
order: 2
description: Install the package, import styles, and render the first component.
---

# Quick start

> Live docs: [roost-design.github.io/roost-design-ui](https://roost-design.github.io/roost-design-ui/) · Source: [GitHub](https://github.com/roost-design/roost-design-ui) · npm: [`@roost-design/ui`](https://www.npmjs.com/package/@roost-design/ui)

## Install

**In an application (npm / pnpm / yarn):**

```bash
pnpm add @roost-design/ui
```

Requires Vue 3 (3.5+ recommended). Theme tokens, color-mode switching, and motion APIs are all included in `@roost-design/ui`.

After cloning this repository, run `pnpm install`. The docs playground resolves source via Vite aliases (see `playground/vite.config.ts`).

To debug from another app, use `link:` / `pnpm link` plus Vite aliases. A plain npm install always resolves `dist/`.

## Choose an import mode

The library supports **full** and **on-demand** usage. Pick one per app (stay consistent within a project).

| | Full | On-demand |
| --- | --- | --- |
| Best for | Many components, fastest setup | Bundle size, few components |
| Components | `app.use(RoostDesign)` or named imports from `@roost-design/ui` | `@roost-design/ui/button` subpaths, or Vite auto-resolver |
| Styles | Import `@roost-design/ui/styles.css` at entry | Bundled with subpath imports (theme + deps) |
| JS size | Full plugin bundles all components; named imports tree-shake | Only used components and their deps |

## Full usage

### 1. Plugin registration (recommended full mode)

Import the **full stylesheet** and register all components once:

```ts
import RoostDesign from '@roost-design/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@roost-design/ui/styles.css'

createApp(App).use(RoostDesign).mount('#app')
```

Templates can use `<RdButton>`, `<RdInput>`, etc. without per-file imports.

### 2. Named imports + full CSS

Skip the plugin; import components in SFCs. JS can tree-shake, but styles still need the full CSS file:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import '@roost-design/ui/styles.css'

createApp(App).mount('#app')
```

```vue
<script setup lang="ts">
import { RdButton, RdInput } from '@roost-design/ui'
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 20rem">
    <RdInput v-model="name" label="Name" placeholder="Enter a name" />
    <RdButton label="Submit" @click="() => undefined" />
  </div>
</template>
```

## On-demand usage

### 1. Subpath imports

Import from kebab-case subpaths (e.g. `button`, `input-password`, `tree-select`). Each entry bundles component JS, internal dependencies, and styles — **no** `@roost-design/ui/styles.css` required:

```ts
import { RdButton } from '@roost-design/ui/button'
import { RdInput } from '@roost-design/ui/input'
```

Styles only:

```ts
import '@roost-design/ui/button/style'
import '@roost-design/ui/button/style.css'
```

### 2. Auto on-demand (Vite)

With `unplugin-vue-components`, add the resolver so templates can use `<RdButton>` without manual imports:

```ts
import { RoostDesignResolver } from '@roost-design/ui/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({ resolvers: [RoostDesignResolver()] }),
  ],
})
```

In on-demand mode, `createRoostDesign({ components: false })` still applies global config without registering components.

## Optional: app-level defaults

`createRoostDesign` applies global defaults and registers all components by default:

```ts
import { createRoostDesign } from '@roost-design/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@roost-design/ui/styles.css'

createApp(App)
  .use(
    createRoostDesign({
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
import { useTheme } from '@roost-design/ui'

const { toggleTheme } = useTheme()
```

See [Theme](/docs/theme).

## Run this docs site

```bash
pnpm --filter @roost-design/ui dev
# http://localhost:5182

# Build the static docs site
pnpm --filter @roost-design/ui build:docs
```
