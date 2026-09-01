---
title: Guide
order: 3
description: Component folder conventions, how to write docs, and shared overlay rules.
---

# Guide

## Component folder

Keep each public component in this shape:

```text
src/components/Button/
├── Button.vue
├── types.ts
├── index.ts
├── Button.test.ts
└── docs/
    ├── index.md
    └── index.en.md
```

- **Prefix**: components export as `Wi*`, CSS classes as `.wi-*`.
- **Types**: Props / Emits live in `types.ts` and are re-exported from the package entry.
- **Tests**: behavior-oriented Vitest + Vue Test Utils.

## Writing docs

Put frontmatter at the top of `docs/index.md` (Chinese) and `docs/index.en.md` (English):

```md
---
title: Button
category: 01 / PRIMITIVE
description: A button that triggers an action
---
```

Write the body in Markdown. Interactive examples use `vue preview` fences (the docs site renders a live preview and lets you inspect the code).

Keep `category` identical in both languages so sidebar grouping stays stable. The numeric prefix controls sort order:

| Prefix | Category |
| --- | --- |
| `00 / GUIDE` | Guides (for example ConfigProvider) |
| `01 / PRIMITIVE` | Primitive |
| `02 / FORM` | Form |
| `03 / OVERLAY` | Overlay |

The docs site language switcher loads `index.en.md` when English is selected, and falls back to `index.md` if the English file is missing.

## Overlay conventions

Overlays Teleport to `body` by default and support:

| Prop | Default | Description |
| --- | --- | --- |
| `teleport` | `true` | Whether to Teleport |
| `appendTo` | `'body'` | Mount target; `'self'` renders in place |

Shared motion names:

- Modal: `wi-fade`
- Anchored menus: `wi-scale-fade`
- Toast: `wi-slide-fade`
- Message: `wi-message-slide` (from top)

Set a global mount target with `appendTo` on [ConfigProvider](/docs/config).

## Icon conventions

- **System icons**: internal and generic actions use `WiIcon` + `name` (see the [Icon](/components/Icon) registry).
- **Product icons**: install Lucide (or similar) in the app and pass them through the `WiIcon` default slot or Button’s `icon` component. Do not dump a full SVG set into the library.
