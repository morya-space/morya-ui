---
title: Layout
order: 4.54
description: App chrome, spacing primitives, and common admin layouts.
---

# Layout

Think in three layers: **app chrome** (`MLayout*`), **page sections** (`MPage*`), and **local composition** (`MSpace` / `MFlex` / `MGrid`). Do not treat one admin sidebar recipe as the default for every surface—pick the shell for the job.

## Principles

- **Components first**: Prefer library chrome and grid primitives over hand-rolled equivalents.
- **Tokenized gaps**: Margins / gaps use `--m-space-*` or layout `gap` / `size` — see [Spacing](/docs/design-spacing).
- **Density once**: `data-m-density` also scales header / footer heights and nav rail widths (`--m-layout-*`, `--m-nav-rail-*`).
- **Overlays leave the flow**: Dialog / Drawer / Select menus Teleport; `appendTo` / `zIndex` live in [Configuration](/docs/config).

## App chrome

| Piece                            | Notes                                         |
| -------------------------------- | --------------------------------------------- |
| `MLayout` family                 | Header / sider / content / footer composition |
| `--m-layout-header-height`       | Top bar (tracks control height + density)     |
| `--m-layout-footer-height`       | Footer height                                 |
| `--m-nav-rail-width` / collapsed | Nav rail expanded / collapsed                 |

Under `compact`, header ≈ `3rem`; under `spacious` ≈ `4rem`. Login / marketing pages may use a dedicated shell—skip admin Layout when it does not fit.

## Page sections

Lists, filters, stats, and detail blocks lean on `MPage*` (see component docs and MCP `get_design_rules`):

- Align filter bars and table headers on one horizontal rhythm.
- Separate KPIs from the main table with `space-6` / `space-8`.
- Empty states use `MEmpty`; outcome pages use `MResult`—do not fake “loaded” with empty height.

## Local composition

| Component      | Role                                     |
| -------------- | ---------------------------------------- |
| `MSpace`       | Linear spacing (button rows, field rows) |
| `MFlex`        | Flex row / column                        |
| `MGrid`        | Responsive grid                          |
| `MButtonGroup` | Joined adjacent buttons                  |
| `fluid` prop   | Stretch a control to parent width        |

Layout `class` on field components lands on the **field root**, not the inner input — see [Attrs](/docs/attrs).

## Do / Don't

| Do                                           | Don't                                    |
| -------------------------------------------- | ---------------------------------------- |
| Choose chrome, then fill `MPage*` sections   | Copy-paste a sidebar per route           |
| Two-column forms via `MGrid` + field `class` | Absolute positioning for alignment       |
| Cap reading width for long prose             | Waste table real estate on empty padding |
| Raise overlays from Config `zIndex`          | Scatter `z-index: 9999` in product CSS   |

See also [Conventions](/docs/conventions) and [Common Props](/docs/common-props). Next: [Motion](/docs/motion).
