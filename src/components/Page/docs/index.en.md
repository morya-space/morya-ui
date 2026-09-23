---
title: Page
category: 06 / LAYOUT
description: Composable page sections for spacing, borders, and headings with little or no custom CSS.
---

# Page

Page composition components. Use them with `MLayout` to encode filter bars, toolbars, form surfaces, KPI cards, and other admin-page blocks **without rewriting scoped CSS on every page**.

## Import

```ts
import {
  MPageContent,
  MPageFilterChips,
  MPageFilters,
  MPageHeader,
  MPagePlaceholder,
  MPageSection,
  MPageStat,
  MPageToolbar,
} from 'morya-ui'
```

## List page stack

`MPageContent` owns content **padding** (default `--m-space-6`) and section **gap** (default `--m-space-4`). The bordered frame in previews simulates `MLayoutContent` only.

`MPageFilters` defaults to a borderless control row (`variant="plain"`); `variant="filled"` uses the same `--m-color-fill-light` as the Table header, with no radius. `MPageHeader` is page identity (`--m-font-size-xl`); `MPageToolbar` is a list action row (`--m-font-size-md`), not a second page title. `MPageStat` supports `trendDirection`, `trendLabel`, `loading`, and `shadow` (defaults to `always`).

```vue preview src="./demos/ListPageStack.en.vue"
```

Use `MPageFilters collapsible` + `#advanced` for secondary fields; show active criteria with `MPageFilterChips` and closable `MTag`.

```vue preview src="./demos/ListFiltersAdvanced.en.vue"
```

Put the route trail in `MLayoutHeader` (`MBreadcrumb`) **or** in `MPageHeader` `#breadcrumb` — not both with duplicate titles.

## Dashboard KPI

Default `MPageStat` uses a Card surface; dense strips can use `layout="plain"`, `orientation="inline"`, and `density="compact"`.

```vue preview src="./demos/StatVariants.en.vue"
```

## Form page stack

Use `MPageContent width="narrow"`, `MPageSection variant="form"`, and `variant="actions"` for the footer.

## Composition rules

| Scenario | Use | Avoid |
| --- | --- | --- |
| Vertical page stack | `MPageContent` | Hand-written `gap` / `padding` |
| Filters | `MPageFilters` | Extra bordered `MCard` wrapper |
| Page identity + page actions | `MPageHeader` | Raw `h1` with no hierarchy |
| List action row | `MPageToolbar` | Using Toolbar as a second page title |
| Form surface | `MPageSection variant="form"` | Nested bordered cards |
| Data table | `MTable` directly | `MCard` around bordered table |
| KPI metric | `MPageStat` | Custom stat CSS per page |

Golden references: MCP `get_golden_page`.
