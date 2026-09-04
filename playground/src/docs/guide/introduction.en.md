---
title: Introduction
order: 1
description: What Well Insight UI is, who it is for, and how to get started.
---

# Introduction

**Well Insight UI** (`@well-insight/ui`) is an **open-source** Vue 3 component library with design tokens, light/dark themes, i18n, and interactive documentation.

- **Docs**: [well-insight.github.io/well-insight-ui](https://well-insight.github.io/well-insight-ui/)
- **Source**: [GitHub](https://github.com/well-insight/well-insight-ui)
- **npm**: [`@well-insight/ui`](https://www.npmjs.com/package/@well-insight/ui)

## Why Well Insight UI

| | |
| --- | --- |
| **88 components** | Basics, forms, navigation, data display, layout, and feedback |
| **Theme system** | `--wi-*` design tokens; `useTheme` / `useDensity` / `useMotion` in the same package |
| **TypeScript** | Built with Composition API; fully typed props, emits, and locale |
| **On-demand** | ESM subpaths + `WellInsightResolver` with tree-shaking |
| **Docs as preview** | Markdown + interactive `vue preview` for every component |

## Use cases

- Admin dashboards, ops consoles, SaaS back offices
- Medium-to-large Vue 3 apps that need a shared visual language
- Teams that want themes, overlays, and forms without reinventing primitives

## Packages

| Package | Role |
| --- | --- |
| `@well-insight/ui` | Components, styles, theme APIs, docs site source |
| `@well-insight/ui-mcp` | (Optional) MCP server for AI clients that support the protocol |

## Install

```bash
pnpm add @well-insight/ui
```

Requires Vue 3.5+. See [Quick start](/docs/quick-start).

## Next steps

- [Quick start](/docs/quick-start): install and a minimal example
- [Theme](/docs/theme): light/dark and motion
- [Configuration](/docs/config): `ConfigProvider` / `createWellInsight`
- [Accessibility](/docs/accessibility): forms, keyboard, overlays
- [Components](/components): browse all components and APIs
- [Contributing](https://github.com/well-insight/well-insight-ui/blob/main/CONTRIBUTING.md)
