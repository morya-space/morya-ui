---
title: Introduction
order: 1
description: What Morya UI is, who it is for, and how to get started.
---

# Introduction

**Morya UI** (`morya-ui`) is an **open-source** Vue 3 component library with design tokens, light/dark themes, i18n, and interactive documentation.

- **Docs**: [morya-space.github.io/morya-ui](https://morya-space.github.io/morya-ui/)
- **Source**: [GitHub](https://github.com/morya-space/morya-ui)
- **npm**: [`morya-ui`](https://www.npmjs.com/package/morya-ui)

## Why Morya UI

| | |
| --- | --- |
| **88 components** | Basics, forms, navigation, data display, layout, and feedback |
| **Theme system** | `--m-*` design tokens; `useTheme` / `useDensity` / `useMotion` in the same package |
| **TypeScript** | Built with Composition API; fully typed props, emits, and locale |
| **On-demand** | ESM subpaths + `MoryaUIResolver` with tree-shaking |
| **Docs as preview** | Markdown + interactive `vue preview` for every component |

## Use cases

- Admin dashboards, ops consoles, SaaS back offices
- Medium-to-large Vue 3 apps that need a shared visual language
- Teams that want themes, overlays, and forms without reinventing primitives

## Packages

| Package | Role |
| --- | --- |
| `morya-ui` | Components, styles, theme APIs, docs site source |
| `@morya-ui/mcp` | (Optional) MCP server for AI clients that support the protocol |

## Install

```bash
pnpm add morya-ui
```

Requires Vue 3 (3.5+ recommended). Works with [Nuxt, Astro, Vite SSR, and more](/docs/ssr). See [Quick start](/docs/quick-start).

## Next steps

- [Quick start](/docs/quick-start): install and a minimal example
- [Design tokens](/docs/design-tokens): full `--m-*` reference
- [Theme](/docs/theme): light/dark and motion
- [Styling & attrs](/docs/attrs): fallthrough, `pt`, and event placement
- [API types](/docs/types): shapes behind names like `FieldPassThrough`, `SelectOption`
- [Configuration](/docs/config): `ConfigProvider` / `createMoryaUI`
- [SSR](/docs/ssr): Nuxt, Astro, and similar setups
- [Accessibility](/docs/accessibility): forms, keyboard, overlays
- [Components](/components): browse all components and APIs
- [Contributing](https://github.com/morya-space/morya-ui/blob/main/CONTRIBUTING.md)
