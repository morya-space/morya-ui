---
title: Introduction
order: 1
description: What Well Insight is and who it is for.
---

# Introduction

**Well Insight** (`@well-insight/ui`) is a Vue 3 component library with design tokens, light/dark themes, and motion preferences.

Source: [GitHub](https://github.com/well-insight/well-insight-ui)

## Goals

- **Reusable**: apps import components and styles from the package entry; the publish output is ESM + types + CSS.
- **Consistent**: size, semantic color, and overlay behavior follow one set of conventions.
- **Theme-first**: color, radius, space, and motion use `--wi-*` CSS variables; `useTheme` / `useMotion` / `useDensity` ship in the same package.
- **Docs as preview**: each component’s `docs/index.md` (Chinese) and `docs/index.en.md` (English) support Markdown plus interactive `vue preview` blocks.

## Packages

| Package | Role |
| --- | --- |
| `@well-insight/ui` | Components, styles, theme APIs, and the docs site |
| `@well-insight/ui-mcp` | (Optional) MCP server for AI clients that support the protocol |

## Consumption

| Context | Resolved entry | Notes |
| --- | --- | --- |
| **npm / pnpm install** | `dist/` | ESM, `.d.ts`, `styles.css`, and on-demand subpaths |
| **Local link / monorepo** | Vite alias → `src/` in the consuming app | See [Development guide](https://github.com/well-insight/well-insight-ui/blob/main/docs/DEVELOPMENT.md) |
| **Production build** | `dist/` | Always uses build output |

## Next steps

- [Quick start](/docs/quick-start): install and a minimal example
- [Guide](/docs/guide): folder conventions and how to write docs
- [Theme](/docs/theme): light/dark and motion
- [Configuration](/docs/config): `ConfigProvider` / `createWellInsight`
- [MCP](/docs/mcp): optional AI documentation server
- [Components](/components): browse all components and APIs
