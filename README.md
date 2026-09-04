<p align="center">
  <a href="https://well-insight.github.io/well-insight-ui/">
    <img src="./assets/logo.svg" alt="Well Insight UI" width="96" height="96" />
  </a>
</p>

<h1 align="center">Well Insight UI</h1>

<p align="center">
  A Vue 3 component library with design tokens, light/dark themes, and interactive docs.
</p>

<p align="center">
  English | <a href="./README.zh-CN.md">中文</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@well-insight/ui"><img src="https://img.shields.io/npm/v/@well-insight/ui?style=flat-square" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@well-insight/ui"><img src="https://img.shields.io/npm/dm/@well-insight/ui?style=flat-square" alt="npm downloads" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/well-insight/well-insight-ui?style=flat-square" alt="license" /></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5-42b883?style=flat-square&logo=vue.js&logoColor=white" alt="Vue 3.5" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
</p>

<p align="center">
  <a href="https://well-insight.github.io/well-insight-ui/"><b>Documentation</b></a>
  ·
  <a href="https://well-insight.github.io/well-insight-ui/components">Components</a>
  ·
  <a href="https://github.com/well-insight/well-insight-ui/issues">Issues</a>
  ·
  <a href="./CHANGELOG.md">Changelog</a>
</p>

---

## Introduction

**Well Insight UI** (`@well-insight/ui`) is an open-source Vue 3 component library for building modern web applications. It ships **88 components**, a token-based theme system, built-in i18n, and a documentation site with live previews.

Whether you are starting a new admin dashboard, SaaS product, or internal tool, you get consistent forms, overlays, data display, and feedback primitives out of the box.

## Features

### Complete

88 components covering basics, forms, navigation, data display, layout, and feedback — all tree-shakeable via ESM subpath imports.

### Theme-ready

Light and dark modes powered by `--wi-*` CSS variables. Switch themes with `useTheme`, tune density and motion with `useDensity` / `useMotion`, and override per subtree via `WiConfigProvider`.

### TypeScript-first

Written in Vue 3 Composition API + TypeScript. Props, emits, and locale messages are fully typed.

### Flexible consumption

Use full registration, named imports, on-demand subpaths, or `WellInsightResolver` with `unplugin-vue-components` — pick one style per app.

### Docs as preview

Every component includes Markdown docs with interactive `vue preview` blocks. Browse them online or run the docs site locally.

## Documentation

**https://well-insight.github.io/well-insight-ui/**

| Section | Link |
| --- | --- |
| Quick start | [Guide](https://well-insight.github.io/well-insight-ui/docs/quick-start) |
| Theme | [Theme](https://well-insight.github.io/well-insight-ui/docs/theme) |
| Configuration | [Config](https://well-insight.github.io/well-insight-ui/docs/config) |
| Components | [Catalog](https://well-insight.github.io/well-insight-ui/components) |
| Changelog | [Releases](https://well-insight.github.io/well-insight-ui/changelog) |

## Install

Requires **Vue ^3.5** and a bundler that resolves package `exports` (Vite, webpack 5+, etc.).

```bash
pnpm add @well-insight/ui
# npm i @well-insight/ui
# yarn add @well-insight/ui
```

## Quick start

Register all components and import the full stylesheet:

```ts
import WellInsight from '@well-insight/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).use(WellInsight).mount('#app')
```

On-demand import (styles included automatically):

```ts
import { WiButton } from '@well-insight/ui/button'
import { WiInput } from '@well-insight/ui/input'
```

For global defaults (locale, size, overlay mount point):

```ts
import { createWellInsight, enUS } from '@well-insight/ui'

createApp(App).use(createWellInsight({ locale: enUS })).mount('#app')
```

See the [Quick start guide](https://well-insight.github.io/well-insight-ui/docs/quick-start) for full import modes, Vite resolver setup, and theme APIs.

## Ecosystem

| Package | Description |
| --- | --- |
| [`@well-insight/ui`](https://www.npmjs.com/package/@well-insight/ui) | Components, styles, theme & locale helpers |
| [`@well-insight/ui-mcp`](https://www.npmjs.com/package/@well-insight/ui-mcp) | Optional MCP server for AI-assisted doc lookup |

## Contributing

We welcome issues and pull requests. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting changes.

For maintainers: [Development guide](./docs/DEVELOPMENT.md) · [Release scripts](./scripts/README.md)

## Local development

```bash
pnpm install
pnpm dev              # docs site → http://localhost:5182
pnpm build            # library → dist/
pnpm build:docs:pages # GitHub Pages build
pnpm test
pnpm typecheck
```

## License

[MIT](./LICENSE) © Well Insight contributors
