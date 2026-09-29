---
title: Page
category: 06 / LAYOUT
description: Composable page sections for spacing, borders, and headings with little or no custom CSS.
---

# Page

Page composition components. Use them with `MLayout` to encode filter bars, toolbars, form surfaces, KPI cards, and other admin-page blocks **without rewriting scoped CSS on every page**.

## When to use

- Composable page sections for spacing, borders, and headings with little or no custom CSS
- Prefer composing documented `M*` APIs; see [Common Props](/docs/common-props).

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
} from "morya-ui";
```

## List page stack

`MPageContent` owns content **padding** (default `--m-space-6`) and section **gap** (default `--m-space-4`). The bordered frame in previews simulates `MLayoutContent` only.

**List height (when it fits):** only for a **full-viewport admin main list** under `MLayout fillViewport`, use `MPageContent fill` + `MTable fill paginator`. Skip `fill` for embedded, short, or whole-page-scroll tables.

`MPageFilters` defaults to a borderless control row (`variant="plain"`); `variant="filled"` uses the same `--m-color-fill-light` as the Table header, with no radius. `MPageHeader` is page identity (`--m-font-size-xl`); `MPageToolbar` is a list action row (`--m-font-size-md`), not a second page title. `MPageStat` supports `trendDirection`, `trendLabel`, `loading`, and `shadow` (defaults to `always`).

```vue preview src="./demos/ListPageStack.en.vue"

```

Use `MPageFilters collapsible` + `#advanced` for secondary fields; put query/reset in `#actions` (trailing cluster with the chevron toggle); show active criteria with `MPageFilterChips` and closable `MTag`.

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

| Scenario                     | Use                           | Avoid                                |
| ---------------------------- | ----------------------------- | ------------------------------------ |
| Vertical page stack          | `MPageContent`                | Hand-written `gap` / `padding`       |
| Filters                      | `MPageFilters`                | Extra bordered `MCard` wrapper       |
| Page identity + page actions | `MPageHeader`                 | Raw `h1` with no hierarchy           |
| List action row              | `MPageToolbar`                | Using Toolbar as a second page title |
| Form surface                 | `MPageSection variant="form"` | Nested bordered cards                |
| Data table                   | `MTable` directly             | `MCard` around bordered table        |
| KPI metric                   | `MPageStat`                   | Custom stat CSS per page             |

Golden references: MCP `get_golden_page`. For local edits use MCP `get_page_snippet` (e.g. `filters`, `toolbar`, `form-actions`).

## API

### MPageContent

| Prop      | Type                                   | Default     | Description                                                                              |
| --------- | -------------------------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `density` | `'default' \| 'compact' \| 'spacious'` | `'default'` | Vertical spacing between child bands.                                                    |
| `width`   | `'full' \| 'narrow'`                   | `'full'`    | `narrow` ~42rem for form pages.                                                          |
| `bands`   | `'auto' \| 'uniform'`                  | `'auto'`    | `auto` tightens Header/filters/Toolbar vs table; `uniform` uses gap only.                |
| `fill`    | `boolean`                              | `false`     | Fill remaining `MLayoutContent` height; pair with `MTable fill` for full-viewport lists. |

Tune with `--m-page-content-body-lead` / `--m-page-content-tools-pull` when `bands="auto"`.

### MPageFilters

| Prop                            | Type                  | Default   | Description                                             |
| ------------------------------- | --------------------- | --------- | ------------------------------------------------------- |
| `ariaLabel`                     | `string`              | —         | Accessible name for the filter region.                  |
| `variant`                       | `'plain' \| 'filled'` | `'plain'` | Surface; `filled` matches Table header tint, no radius. |
| `collapsible`                   | `boolean`             | `false`   | Show expand/collapse when `#advanced` is provided.      |
| `expanded`                      | `boolean`             | `false`   | Advanced panel open state (`v-model:expanded`).         |
| `expandLabel` / `collapseLabel` | `string`              | —         | Override default expand/collapse copy.                  |

| Slot       | Description                                               |
| ---------- | --------------------------------------------------------- |
| `default`  | Primary filter controls.                                  |
| `actions`  | Query/reset cluster (trailing with chevron).              |
| `advanced` | Collapsible secondary fields.                             |
| `active`   | Optional active summary (often `MPageFilterChips` below). |

### MPageFilterChips

| Prop        | Type     | Default | Description                        |
| ----------- | -------- | ------- | ---------------------------------- |
| `label`     | `string` | —       | Weak prefix, e.g. “Selected”.      |
| `ariaLabel` | `string` | —       | Accessible name for the chip list. |

Default slot: closable `MTag`s or similar.

### MPageToolbar

| Prop           | Type     | Default | Description                                                      |
| -------------- | -------- | ------- | ---------------------------------------------------------------- |
| `title`        | `string` | —       | Action-row group label (`--m-font-size-md`), not the page title. |
| `headingLevel` | `1–6`    | `1`     | Heading level.                                                   |

| Slot      | Description                              |
| --------- | ---------------------------------------- |
| `default` | Leading content when `title` is omitted. |
| `actions` | Trailing actions.                        |

### MPageHeader

| Prop           | Type     | Default | Description                      |
| -------------- | -------- | ------- | -------------------------------- |
| `title`        | `string` | —       | Page title (`--m-font-size-xl`). |
| `description`  | `string` | —       | Subtitle / blurb.                |
| `headingLevel` | `1–6`    | `1`     | Heading level.                   |

| Slot         | Description                              |
| ------------ | ---------------------------------------- |
| `breadcrumb` | Trail above the title (`MBreadcrumb`).   |
| `tags`       | Status / category tags beside the title. |
| `actions`    | Trailing actions.                        |

### MPageSection

| Prop      | Type                                          | Default     | Description                                     |
| --------- | --------------------------------------------- | ----------- | ----------------------------------------------- |
| `variant` | `'default' \| 'muted' \| 'form' \| 'actions'` | `'default'` | Visual variant; `form` uses an `MCard` surface. |
| `title`   | `string`                                      | —           | Optional section title.                         |

| Slot      | Description               |
| --------- | ------------------------- |
| `actions` | Actions on the title row. |

### MPageStat

| Prop             | Type                                                          | Default     | Description                                              |
| ---------------- | ------------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `label`          | `string`                                                      | —           | Metric name.                                             |
| `value`          | `string \| number`                                            | —           | Primary value (tabular nums).                            |
| `trend`          | `string`                                                      | —           | Delta text colored like `MStatus`.                       |
| `trendSeverity`  | `'primary' \| 'success' \| 'warn' \| 'danger' \| 'secondary'` | `'primary'` | Trend color.                                             |
| `trendDirection` | `'up' \| 'down'`                                              | —           | Up/down arrow beside trend.                              |
| `trendLabel`     | `string`                                                      | —           | Weak note after trend.                                   |
| `icon`           | `string`                                                      | —           | Trailing muted icon name.                                |
| `loading`        | `boolean`                                                     | `false`     | Skeleton for value/trend.                                |
| `shadow`         | `'never' \| 'hover' \| 'always'`                              | `'always'`  | Passed to `MCard.shadow` (ignored for `layout="plain"`). |
| `layout`         | `'card' \| 'plain'`                                           | `'card'`    | `plain` drops the Card shell.                            |
| `density`        | `'default' \| 'compact'`                                      | `'default'` | Compact shrinks the value size.                          |
| `orientation`    | `'stacked' \| 'inline'`                                       | `'stacked'` | Inline puts label and value on one row.                  |

### MPagePlaceholder

Wraps `MEmpty`: illustration + copy by default; override with default / `#icon` / `#extra` slots.

| Prop          | Type               | Default         | Description       |
| ------------- | ------------------ | --------------- | ----------------- |
| `description` | `string`           | —               | Placeholder copy. |
| `ariaLabel`   | `string`           | `'Placeholder'` | Accessible label. |
| `minHeight`   | `number \| string` | `'12rem'`       | Minimum height.   |

| Slot      | Description                 |
| --------- | --------------------------- |
| `default` | Custom description.         |
| `icon`    | Custom icon / illustration. |
| `extra`   | Next-step actions.          |
