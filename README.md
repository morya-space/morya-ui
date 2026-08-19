# @well-insight/ui

[English](./README.md) · [中文](./README.zh-CN.md)

Vue 3 component library for Well Insight — themed UI primitives for forms, overlays, data display, and feedback.

| | |
| --- | --- |
| **npm** | [`@well-insight/ui`](https://www.npmjs.com/package/@well-insight/ui) |
| **Source** | [GitHub](https://github.com/well-insight/well-insight-ui) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) · [English](./CHANGELOG.en.md) |

## Requirements

- Vue `^3.5`
- A bundler that resolves the package `exports` (Vite, webpack 5+, etc.)

## Install

```bash
pnpm add @well-insight/ui vue
# npm i @well-insight/ui vue
# yarn add @well-insight/ui vue
```

## Quick start

Import styles once at your app entry, then import components on demand:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).mount('#app')
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WdButton, WdInput } from '@well-insight/ui'

const name = ref('')
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 20rem">
    <WdInput v-model="name" label="Name" placeholder="Enter a name" />
    <WdButton label="Submit" />
  </div>
</template>
```

Tree-shaking friendly: import only what you use from `@well-insight/ui`. Styles are separate — always import `@well-insight/ui/styles.css`.

## App defaults (`createWellInsight`)

Optional Vue plugin for global defaults (overlay mount, size, density, locale, z-index):

```ts
import { createApp } from 'vue'
import { createWellInsight, enUS } from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App)
  .use(
    createWellInsight({
      appendTo: 'body',
      size: 'small',
      density: 'comfortable',
      zIndex: 1100,
      locale: enUS,
    }),
  )
  .mount('#app')
```

| Option | Role |
| --- | --- |
| `appendTo` | Default Teleport target for overlays (`'body'` by default) |
| `size` | Default control size |
| `density` | `compact` / `comfortable` / `spacious` |
| `inputVariant` | `outlined` / `filled` |
| `zIndex` | Overlay z-index base |
| `locale` | Built-in UI copy (`zhCN` default, or `enUS` / partial override) |

For subtree overrides, wrap with `<WdConfigProvider>`. Resolution order:

**component props → `WdConfigProvider` → `createWellInsight` → built-in defaults**

## Locale

Built-in copy defaults to **Chinese**. Switch to English or override keys:

```ts
import { createWellInsight, enUS, zhCN } from '@well-insight/ui'

createWellInsight({ locale: enUS })

createWellInsight({
  locale: {
    ...zhCN,
    accept: 'OK',
  },
})
```

## Theme

Light / dark tokens and helpers ship in the same package:

```ts
import { useTheme } from '@well-insight/ui'

const { theme, isDark, setTheme, toggleTheme } = useTheme()
```

`useTheme` persists the choice in `localStorage` and respects `prefers-color-scheme` when unset. Related APIs: `useDensity`, `useMotion`, `applyTheme`, `lightTokens`, `darkTokens`.

## Feedback APIs

Imperative feedback without mounting hosts yourself (hosts auto-mount when needed):

```ts
import { message, toast } from '@well-insight/ui'

message.success('Saved')
message.error('Something went wrong')

toast.add({ severity: 'info', summary: 'Notice', detail: 'Details here' })
```

You can still render `<WdMessage />` / `<WdToast />` when you need a controlled host.

## What you import

| Import | Purpose |
| --- | --- |
| `@well-insight/ui` | Components (`WdButton`, `WdTable`, …), `createWellInsight`, `WdConfigProvider`, theme & locale helpers, `message` / `toast` |
| `@well-insight/ui/styles.css` | Required stylesheet (tokens + component styles) |

TypeScript types are included via the package `exports`.

## Local development

```bash
pnpm install
pnpm dev          # docs playground → http://localhost:5182
pnpm build        # library build → dist/
pnpm test
pnpm typecheck
```

Maintainer notes (build, release, commits): [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) · [UI development](./docs/ui-development.md) · [release scripts](./scripts/README.md).

## License

MIT
