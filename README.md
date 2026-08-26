# @well-insight/ui

[English](./README.md) · [中文](./README.zh-CN.md)

Open-source Vue 3 component library for Well Insight — themed UI primitives for forms, overlays, data display, and feedback.

| | |
| --- | --- |
| **npm** | [`@well-insight/ui`](https://www.npmjs.com/package/@well-insight/ui) |
| **Docs** | Local `pnpm dev` → http://localhost:5182 |
| **Source** | [GitHub](https://github.com/well-insight/well-insight-ui) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) · [English](./CHANGELOG.en.md) |

## Requirements

- Vue `^3.5`
- A bundler that resolves the package `exports` (Vite, webpack 5+, etc.)

## Install

```bash
pnpm add @well-insight/ui
# npm i @well-insight/ui
# yarn add @well-insight/ui
```

## Quick start

Both **full** and **on-demand** imports are supported — pick one per app.

| | Full | On-demand |
| --- | --- | --- |
| Styles | `@well-insight/ui/styles.css` | Bundled with subpath imports |
| Components | Plugin or named imports from `@well-insight/ui` | `@well-insight/ui/button` etc. |

### Full registration

```ts
import { createApp } from 'vue'
import WellInsight from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).use(WellInsight).mount('#app')
```

Templates can use `<WiButton>` / `<WiInput>` without importing.

### Named imports + full CSS

Tree-shakeable JS; still import full CSS at entry:

```vue
<script setup lang="ts">
import { WiButton, WiInput } from '@well-insight/ui'
</script>
```

Entry: `import '@well-insight/ui/styles.css'`

### On-demand subpaths

Kebab-case subpaths bundle JS, dependencies, and styles — no full CSS import:

```ts
import { WiButton } from '@well-insight/ui/button'
import { WiInput } from '@well-insight/ui/input'
```

### Auto on-demand (Vite)

```ts
import Components from 'unplugin-vue-components/vite'
import { WellInsightResolver } from '@well-insight/ui/resolver'

Components({ resolvers: [WellInsightResolver()] })
```

For a fuller walkthrough, see the docs site [Quick start](./playground/src/docs/guide/quick-start.en.md).

## App defaults

`createWellInsight` / `WellInsight` set global defaults and **register all components by default**:

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

Pass `components: false` for config-only install (no global components).

| Option | Role |
| --- | --- |
| `appendTo` | Default Teleport target for overlays (`'body'` by default) |
| `size` | Default control size |
| `density` | `compact` / `comfortable` / `spacious` |
| `inputVariant` | `outlined` / `filled` |
| `zIndex` | Overlay z-index base |
| `locale` | Built-in UI copy (`zhCN` default, or `enUS` / partial override) |

For subtree overrides, wrap with `<WiConfigProvider>`. Resolution order:

**component props → `WiConfigProvider` → `createWellInsight` → built-in defaults**

See the docs site [Configuration](./playground/src/docs/guide/config.en.md).

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

See the docs site [Theme](./playground/src/docs/guide/theme.en.md).

## Feedback APIs

Imperative feedback without mounting hosts yourself (hosts auto-mount when needed):

```ts
import { message, toast } from '@well-insight/ui'

message.success('Saved')
message.error('Something went wrong')

toast.add({ severity: 'info', summary: 'Notice', detail: 'Details here' })
```

You can still render `<WiMessage />` / `<WiToast />` when you need a controlled host.

## Exports

| Import | Purpose |
| --- | --- |
| `@well-insight/ui` | Components, `createWellInsight`, `WiConfigProvider`, theme & locale helpers, `message` / `toast` |
| `@well-insight/ui/styles.css` | Full stylesheet (tokens + all components) |
| `@well-insight/ui/button` etc. | On-demand subpath (JS + deps + styles; 88 kebab-case entries) |
| `@well-insight/ui/button/style` | Styles only (side-effect) for that component |
| `@well-insight/ui/resolver` | `unplugin-vue-components` resolver |

TypeScript types are included via the package `exports`.

## Local development

```bash
pnpm install
pnpm dev          # docs site → http://localhost:5182
pnpm build        # library → dist/
pnpm build:docs   # static docs site
pnpm test
pnpm typecheck
```

Maintainer docs: [Development guide](./docs/DEVELOPMENT.md) · [UI development](./docs/ui-development.md) · [Release scripts](./scripts/README.md)

## Optional: MCP

If you use an AI client that supports the [Model Context Protocol](https://modelcontextprotocol.io/), you can also install [`@well-insight/ui-mcp`](https://www.npmjs.com/package/@well-insight/ui-mcp) so assistants look up this library’s real docs. **This does not replace** `pnpm add @well-insight/ui`.

Details: docs site [MCP](./playground/src/docs/guide/mcp.en.md).

## License

MIT
