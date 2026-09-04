---
title: Introduction
order: 1
description: What Wex Design UI is, who it is for, and how to get started.
---

# Introduction

**Wex Design UI** (`@wex-design/ui`) is an **open-source** Vue 3 component library with design tokens, light/dark themes, i18n, and interactive documentation.

- **Docs**: [wex-design.github.io/wex-design-ui](https://wex-design.github.io/wex-design-ui/)
- **Source**: [GitHub](https://github.com/wex-design/wex-design-ui)
- **npm**: [`@wex-design/ui`](https://www.npmjs.com/package/@wex-design/ui)

## Why Wex Design UI

| | |
| --- | --- |
| **88 components** | Basics, forms, navigation, data display, layout, and feedback |
| **Theme system** | `--wd-*` design tokens; `useTheme` / `useDensity` / `useMotion` in the same package |
| **TypeScript** | Built with Composition API; fully typed props, emits, and locale |
| **On-demand** | ESM subpaths + `WexDesignResolver` with tree-shaking |
| **Docs as preview** | Markdown + interactive `vue preview` for every component |

## Use cases

- Admin dashboards, ops consoles, SaaS back offices
- Medium-to-large Vue 3 apps that need a shared visual language
- Teams that want themes, overlays, and forms without reinventing primitives

## Packages

| Package | Role |
| --- | --- |
| `@wex-design/ui` | Components, styles, theme APIs, docs site source |
| `@wex-design/ui-mcp` | (Optional) MCP server for AI clients that support the protocol |

## Install

```bash
pnpm add @wex-design/ui
```

Requires Vue 3 (3.5+ recommended). Works with [Nuxt, Astro, Vite SSR, and more](/docs/ssr). See [Quick start](/docs/quick-start).

## Next steps

- [Quick start](/docs/quick-start): install and a minimal example
- [Theme](/docs/theme): light/dark and motion
- [Configuration](/docs/config): `ConfigProvider` / `createWexDesign`
- [Accessibility](/docs/accessibility): forms, keyboard, overlays
- [Components](/components): browse all components and APIs
- [Contributing](https://github.com/wex-design/wex-design-ui/blob/main/CONTRIBUTING.md)
