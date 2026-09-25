---
title: Table
category: 03 / DATA
description: Data table with sorting, filtering, selection, pagination, frozen columns, and empty/loading states. Column width supports width / minWidth / fit.
---

# Table

`MTable` displays structured row data. Define columns with `columns`, pass data with `rows`, and use built-in client-side sort, filter, pagination, and row selection—or switch to server-driven pagination.

Column width rules:

- Columns with `width` use a fixed width
- Columns without `width` are flexible with a `minWidth` lower bound (default `80`); when `fit` is `true` (default), remaining width is distributed proportionally
- Horizontal scrolling appears when the total minimum width exceeds the container
- Prefer `maxHeight` / `tableHeight` when the table body should scroll on its own; when nested under `MLayout` root scroll, fix the table height to avoid stacked scrollbars
- **Full-viewport main lists (when it fits):** `MPageContent fill` + `MTable fill paginator` — body scrolls; pagination at the page bottom. Skip `fill` for embedded/short tables

## Import

```ts
import type { TableColumnDefinition, TableItem } from 'morya-ui'
import { MTable, MTag } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Selection

Use `selection-mode="multiple"` with `v-model:selection`, or `selection-mode="single"` with `v-model:selected-item`.

```vue preview src="./demos/Selection.en.vue"
```

## Filter and pagination

Use `search-value` / `filter-options` for client filtering. Enable `paginator` with `v-model:page` and `rows-per-page`.

```vue preview src="./demos/FilterAndPagination.en.vue"
```

## Expandable rows

Set `expandable` and provide the `expansion` slot. Column `render` works for custom cells; a `cell-{key}` slot overrides `render`.

```vue preview src="./demos/ExpandableRows.en.vue"
```

## Empty and loading

```vue preview src="./demos/EmptyAndLoading.en.vue"
```

## TableColumnDefinition

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | Field name bound to row data. |
| `label` | `string` | Column header text. |
| `width` | `number` | Fixed width in px. |
| `minWidth` | `number` | Flex column minimum width; default `80`. |
| `sortable` | `boolean` | Enable sorting. |
| `fixed` | `boolean \| 'left' \| 'right'` | Freeze column (left freeze supported). |
| `align` | `'start' \| 'center' \| 'end'` | Cell alignment. |
| `render` | `(row) => unknown` | Custom cell renderer. |
| `showOverflowTooltip` | `boolean` | Tooltip when cell text overflows. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumnDefinition[]` | — | Column definitions. |
| `rows` | `TableItem[]` | — | Row data. |
| `fit` | `boolean` | `true` | Flexible columns fill remaining width. |
| `selectionMode` | `'single' \| 'multiple' \| null` | `null` | Row selection mode. |
| `selection` | `TableItem[] \| null` | `null` | Multi-select (`v-model:selection`). |
| `paginator` | `boolean` | `false` | Built-in pagination footer. |
| `page` | `number` | `1` | Current page (`v-model:page`). |
| `rowsPerPage` | `number` | `25` | Page size. |
| `fill` | `boolean` | `false` | Fill remaining parent height (only for full-viewport main lists with `MPageContent fill`). Body scrolls; paginator stays at the bottom. Ignored when `maxHeight` / `tableHeight` is set. |
| `striped` / `bordered` | `boolean` | `false` | Striped rows / cell borders. |
| `highlightCurrent` | `boolean` | `false` | Highlight current row. |
| `loading` / `emptyText` / `emptyDescription` | — | — | Loading and empty states. |
| `maxHeight` | `number \| null` | `null` | Scrollable body max height. |
| `rowKey` | `string` | `'id'` | Stable row key field. |
| `size` | `'sm' \| 'md' \| 'lg'` | — | Table density. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `cell-{key}` | Cell for column `{key}`; scope `{ row, value, column }`. |
| `body-cell` | Any cell; scope `{ row, column, value }`. |
| `expansion` | Expanded row; scope `{ row }`. |
| `empty` / `loading` | Empty and loading placeholders. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `sort` | `{ sortField?, sortOrder? }` | Sort changed. |
| `page` | `number` | Page changed. |
| `row-click` | `{ row, index }` | Row clicked. |
| `current-change` | `row \| null, oldRow \| null` | Current row changed. |
| `update:selection` | `TableItem[]` | Selection v-model. |
| `update:page` | `number` | Page v-model. |

## Instance

Pagination and filter controls exposed via `ref`:

| Method / Property | Description |
| --- | --- |
| `currentPageFirstIndex` | Index of the first record on the current page (`-1` when empty). |
| `currentPageLastIndex` | Index of the last record on the current page. |
| `clientItemsLength` | Total item count (server total in server mode). |
| `maxPaginationNumber` | Last page number. |
| `currentPaginationNumber` | Current page number. |
| `isLastPage` / `isFirstPage` | Whether the current page is the last / first. |
| `nextPage()` / `prevPage()` | Go to the next / previous page. |
| `updatePage(page)` | Jump to a page. |
| `rowsPerPageOptions` | Rows-per-page options. |
| `rowsPerPageActiveOption` | Active rows-per-page value. |
| `updateRowsPerPageActiveOption(n)` | Change rows per page. |
| `setFilters(filters)` | Set filters programmatically. |

## Types

<h4 id="TableItem">TableItem</h4>

See source `types.ts` for the full definition.

```ts
type TableItem = Record<string, unknown>
```



<h4 id="TableColumnDefinition">TableColumnDefinition</h4>

Column definition passed to `columns`:

```ts
interface TableColumnDefinition {
  key: string
  label: string
  width?: number
  minWidth?: number
  sortable?: boolean
  fixed?: boolean | 'left' | 'right'
  align?: 'start' | 'center' | 'end' | 'left' | 'right'
  render?: (row: TableItem) => unknown
  filterable?: boolean
  filters?: { label: string; value: string | number }[]
  showOverflowTooltip?: boolean
}
```

<h4 id="TableServerOptions">TableServerOptions</h4>

Server-side paging/sorting payload for `serverOptions`, with `serverItemsLength`:

```ts
interface TableServerOptions {
  page: number
  rowsPerPage: number
  sortBy?: string | string[]
  sortType?: 'asc' | 'desc' | ('asc' | 'desc')[]
}
```

`TableItem` is `Record<string, unknown>`. See also [API types](/docs/types).
