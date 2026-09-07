---
title: Introduction
order: 1
description: What Roost Design UI is, who it is for, and how to get started.
---

# Introduction

**Roost Design UI** (`@roost-design/ui`) is an **open-source** Vue 3 component library with design tokens, light/dark themes, i18n, and interactive documentation.

- **Docs**: [roost-design.github.io/roost-design-ui](https://roost-design.github.io/roost-design-ui/)
- **Source**: [GitHub](https://github.com/roost-design/roost-design-ui)
- **npm**: [`@roost-design/ui`](https://www.npmjs.com/package/@roost-design/ui)

## Why Roost Design UI

| | |
| --- | --- |
| **88 components** | Basics, forms, navigation, data display, layout, and feedback |
| **Theme system** | `--rd-*` design tokens; `useTheme` / `useDensity` / `useMotion` in the same package |
| **TypeScript** | Built with Composition API; fully typed props, emits, and locale |
| **On-demand** | ESM subpaths + `RoostDesignResolver` with tree-shaking |
| **Docs as preview** | Markdown + interactive `vue preview` for every component |

## Use cases

- Admin dashboards, ops consoles, SaaS back offices
- Medium-to-large Vue 3 apps that need a shared visual language
- Teams that want themes, overlays, and forms without reinventing primitives

## Packages

| Package | Role |
| --- | --- |
| `@roost-design/ui` | Components, styles, theme APIs, docs site source |
| `@roost-design/ui-mcp` | (Optional) MCP server for AI clients that support the protocol |

## Install

```bash
pnpm add @roost-design/ui
```

Requires Vue 3 (3.5+ recommended). Works with [Nuxt, Astro, Vite SSR, and more](/docs/ssr). See [Quick start](/docs/quick-start).

## Next steps

- [Quick start](/docs/quick-start): install and a minimal example
- [Theme](/docs/theme): light/dark and motion
- [Configuration](/docs/config): `ConfigProvider` / `createRoostDesign`
- [Accessibility](/docs/accessibility): forms, keyboard, overlays
- [Components](/components): browse all components and APIs
- [Contributing](https://github.com/roost-design/roost-design-ui/blob/main/CONTRIBUTING.md)
