---
title: Quick start
order: 2
description: Install the package, import styles, and render the first component.
---

# Quick start

> Live docs: [morya-ui.github.io/morya-ui](https://morya-ui.github.io/morya-ui/) · Source: [GitHub](https://github.com/morya-space/morya-ui) · npm: [`morya-ui`](https://www.npmjs.com/package/morya-ui)

## Install

**In an application (npm / pnpm / yarn):**

```bash
pnpm add morya-ui
```

Requires Vue 3 (3.5+ recommended). Theme tokens, color-mode switching, and motion APIs are all included in `morya-ui`.

After cloning this repository, run `pnpm install`. The docs playground resolves source via Vite aliases (see `playground/vite.config.ts`).

To debug from another app, use `link:` / `pnpm link` plus Vite aliases. A plain npm install always resolves `dist/`.

## Choose an import mode

The library supports **full** and **on-demand** usage. Pick one per app (stay consistent within a project).

| | Full | On-demand |
| --- | --- | --- |
| Best for | Many components, fastest setup | Bundle size, few components |
| Components | `app.use(MoryaUI)` or named imports from `morya-ui` | `morya-ui/button` subpaths, or Vite auto-resolver |
| Styles | Import `morya-ui/styles.css` at entry | Bundled with subpath imports (theme + deps) |
| JS size | Full plugin bundles all components; named imports tree-shake | Only used components and their deps |

## Full usage

### 1. Plugin registration (recommended full mode)

Import the **full stylesheet** and register all components once:

```ts
import MoryaUI from 'morya-ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'morya-ui/styles.css'

createApp(App).use(MoryaUI).mount('#app')
```

Templates can use `<MButton>`, `<MInput>`, etc. without per-file imports.

### 2. Named imports + full CSS

Skip the plugin; import components in SFCs. JS can tree-shake, but styles still need the full CSS file:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import 'morya-ui/styles.css'

createApp(App).mount('#app')
```

```vue
<script setup lang="ts">
import { MButton, MInput } from 'morya-ui'
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 20rem">
    <MInput v-model="name" label="Name" placeholder="Enter a name" />
    <MButton label="Submit" @click="() => undefined" />
  </div>
</template>
```

## On-demand usage

### 1. Subpath imports

Import from kebab-case subpaths (e.g. `button`, `input-password`, `tree-select`). Each entry bundles component JS, internal dependencies, and styles — **no** `morya-ui/styles.css` required:

```ts
import { MButton } from 'morya-ui/button'
import { MInput } from 'morya-ui/input'
```

Styles only:

```ts
import 'morya-ui/button/style'
import 'morya-ui/button/style.css'
```

### 2. Auto on-demand (Vite)

With `unplugin-vue-components`, add the resolver so templates can use `<MButton>` without manual imports:

```ts
import { MoryaUIResolver } from 'morya-ui/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({ resolvers: [MoryaUIResolver()] }),
  ],
})
```

In on-demand mode, `createMoryaUI({ components: false })` still applies global config without registering components.

## Optional: app-level defaults

`createMoryaUI` applies global defaults and registers all components by default:

```ts
import { createMoryaUI } from 'morya-ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'morya-ui/styles.css'

createApp(App)
  .use(
    createMoryaUI({
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
import { useTheme } from 'morya-ui'

const { toggleTheme } = useTheme()
```

See [Theme](/docs/theme).

## Run this docs site

```bash
pnpm --filter morya-ui dev
# http://localhost:5182

# Build the static docs site
pnpm --filter morya-ui build:docs
```
