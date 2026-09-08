---
title: Introduction
order: 1
description: What Wise Kit UI is, who it is for, and how to get started.
---

# Introduction

**Wise Kit UI** (`@wise-kit/ui`) is an **open-source** Vue 3 component library with design tokens, light/dark themes, i18n, and interactive documentation.

- **Docs**: [wise-kit.github.io/wise-kit-ui](https://wise-kit.github.io/wise-kit-ui/)
- **Source**: [GitHub](https://github.com/wise-kit/wise-kit-ui)
- **npm**: [`@wise-kit/ui`](https://www.npmjs.com/package/@wise-kit/ui)

## Why Wise Kit UI

| | |
| --- | --- |
| **88 components** | Basics, forms, navigation, data display, layout, and feedback |
| **Theme system** | `--wk-*` design tokens; `useTheme` / `useDensity` / `useMotion` in the same package |
| **TypeScript** | Built with Composition API; fully typed props, emits, and locale |
| **On-demand** | ESM subpaths + `WiseKitResolver` with tree-shaking |
| **Docs as preview** | Markdown + interactive `vue preview` for every component |

## Use cases

- Admin dashboards, ops consoles, SaaS back offices
- Medium-to-large Vue 3 apps that need a shared visual language
- Teams that want themes, overlays, and forms without reinventing primitives

## Packages

| Package | Role |
| --- | --- |
| `@wise-kit/ui` | Components, styles, theme APIs, docs site source |
| `@wise-kit/ui-mcp` | (Optional) MCP server for AI clients that support the protocol |

## Install

```bash
pnpm add @wise-kit/ui
```

Requires Vue 3 (3.5+ recommended). Works with [Nuxt, Astro, Vite SSR, and more](/docs/ssr). See [Quick start](/docs/quick-start).

## Next steps

- [Quick start](/docs/quick-start): install and a minimal example
- [Theme](/docs/theme): light/dark and motion
- [Configuration](/docs/config): `ConfigProvider` / `createWiseKit`
- [Accessibility](/docs/accessibility): forms, keyboard, overlays
- [Components](/components): browse all components and APIs
- [Contributing](https://github.com/wise-kit/wise-kit-ui/blob/main/CONTRIBUTING.md)
