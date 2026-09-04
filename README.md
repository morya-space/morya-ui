<p align="center">
  <a href="https://wex-design.github.io/wex-design-ui/">
    <img src="./assets/logo.svg" alt="Wex Design UI" width="96" height="96" />
  </a>
</p>

<h1 align="center">Wex Design UI</h1>

<p align="center">
  A Vue 3 component library with design tokens, light/dark themes, and interactive docs.
</p>

<p align="center">
  English | <a href="./README.zh-CN.md">中文</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@wex-design/ui"><img src="https://img.shields.io/npm/v/@wex-design/ui?style=flat-square" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@wex-design/ui"><img src="https://img.shields.io/npm/dm/@wex-design/ui?style=flat-square" alt="npm downloads" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/wex-design/wex-design-ui?style=flat-square" alt="license" /></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vue.js&logoColor=white" alt="Vue 3" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
</p>

<p align="center">
  <a href="https://wex-design.github.io/wex-design-ui/"><b>Documentation</b></a>
  ·
  <a href="https://wex-design.github.io/wex-design-ui/components">Components</a>
  ·
  <a href="https://github.com/wex-design/wex-design-ui/issues">Issues</a>
  ·
  <a href="./CHANGELOG.md">Changelog</a>
</p>

---

## Introduction

**Wex Design UI** (`@wex-design/ui`) is an open-source Vue 3 component library for building modern web applications. It ships **88 components**, a token-based theme system, built-in i18n, and a documentation site with live previews.

Whether you are starting a new admin dashboard, SaaS product, or internal tool, you get consistent forms, overlays, data display, and feedback primitives out of the box.

## Features

### Complete

88 components covering basics, forms, navigation, data display, layout, and feedback — all tree-shakeable via ESM subpath imports.

### Theme-ready

Light and dark modes powered by `--wd-*` CSS variables. Switch themes with `useTheme`, tune density and motion with `useDensity` / `useMotion`, and override per subtree via `WdConfigProvider`.

### TypeScript-first

Written in Vue 3 Composition API + TypeScript. Props, emits, and locale messages are fully typed.

### Flexible consumption

Use full registration, named imports, on-demand subpaths, or `WexDesignResolver` with `unplugin-vue-components` — pick one style per app.

### Docs as preview

Every component includes Markdown docs with interactive `vue preview` blocks. Browse them online or run the docs site locally.

### SSR & meta-frameworks

Works with **Nuxt 3**, **Astro + Vue**, **Vite SSR**, and similar setups. Includes the [`@wex-design/nuxt`](./packages/nuxt) module — see the [SSR guide](https://wex-design.github.io/wex-design-ui/docs/ssr).

## Documentation

**https://wex-design.github.io/wex-design-ui/**

| Section | Link |
| --- | --- |
| Quick start | [Guide](https://wex-design.github.io/wex-design-ui/docs/quick-start) |
| Theme | [Theme](https://wex-design.github.io/wex-design-ui/docs/theme) |
| Configuration | [Config](https://wex-design.github.io/wex-design-ui/docs/config) |
| SSR | [Nuxt / Astro / Vite SSR](https://wex-design.github.io/wex-design-ui/docs/ssr) |
| Components | [Catalog](https://wex-design.github.io/wex-design-ui/components) |
| Changelog | [Releases](https://wex-design.github.io/wex-design-ui/changelog) |

## Install

Requires **Vue 3** (3.5+ recommended) and a bundler that resolves package `exports` (Vite, webpack 5+, etc.).

```bash
pnpm add @wex-design/ui
# npm i @wex-design/ui
# yarn add @wex-design/ui
```

## Quick start

Register all components and import the full stylesheet:

```ts
import WexDesign from '@wex-design/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@wex-design/ui/styles.css'

createApp(App).use(WexDesign).mount('#app')
```

On-demand import (styles included automatically):

```ts
import { WdButton } from '@wex-design/ui/button'
import { WdInput } from '@wex-design/ui/input'
```

For global defaults (locale, size, overlay mount point):

```ts
import { createWexDesign, enUS } from '@wex-design/ui'

createApp(App).use(createWexDesign({ locale: enUS })).mount('#app')
```

See the [Quick start guide](https://wex-design.github.io/wex-design-ui/docs/quick-start) for full import modes, Vite resolver setup, and theme APIs.

## Ecosystem

| Package | Description |
| --- | --- |
| [`@wex-design/ui`](https://www.npmjs.com/package/@wex-design/ui) | Components, styles, theme & locale helpers |
| [`@wex-design/nuxt`](./packages/nuxt) | Nuxt 3 module (styles, transpile, overlay context) |
| [`@wex-design/ui-mcp`](https://www.npmjs.com/package/@wex-design/ui-mcp) | Optional MCP server for AI-assisted doc lookup |

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

[MIT](./LICENSE) © Wex Design contributors
