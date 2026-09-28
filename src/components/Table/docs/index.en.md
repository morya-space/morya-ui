---
title: Table
category: 03 / DATA
description: Data table with sorting, filtering, selection, pagination, frozen columns, and empty/loading states. Column width supports width / minWidth / fit.
---

# Table

`MTable` displays structured row data. Define columns with `columns`, pass data with `rows`, and use built-in client-side sort, filter, pagination, and row selection—or switch to server-driven pagination.

Header “select all” applies to the **current page** only. Enterprise capabilities (virtual scroll, column resize, header filters, inline edit, etc.) are optional props on the same `MTable`—no separate grid component.

### Capability matrix

| Capability | Prop / column field | Default |
| --- | --- | --- |
| Sort / multi-sort | `sortable` / `multiSort` | off |
| Programmatic filter | `filters` / `filterOptions` / `searchValue` | — |
| Header filter UI | column `filterable` (+ `filters`) | off |
| Pagination | `paginator` | off |
| Selection | `selectionMode` | off |
| Fixed columns | column `fixed` | — |
| Expandable rows | `expandable` | off |
| Column resize | column `resizable` / `v-model:column-widths` | off |
| Virtual scroll | `virtual` + height | off |
| Column hide / order | `hiddenColumns` / `columnOrder` | — |
| Grouped headers | column `children` | — |
| Footer summary | `showFooter` + `footerMethod` | off |
| Cell merge | `spanMethod` | — |
| Inline edit | `editConfig` + column `editable` | off |

Out of scope: Excel area-select/copy, pivot, embedded charts.

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

## Fixed columns

Set `fixed: 'left' | 'right'` on a column (or `fixed: true` for left).

```vue preview src="./demos/FixedColumns.en.vue"
```

## Column resize and header filters

Set `resizable` to drag column widths (`v-model:column-widths`). Set `filterable` for a header filter; optional `filters` for checkbox options, otherwise free-text contains.

```vue preview src="./demos/ResizeAndFilter.en.vue"
```

## Virtual scroll

Enable `virtual` with `maxHeight` / `tableHeight` / `fill`. Expandable tables skip virtualization.

```vue preview src="./demos/VirtualScroll.en.vue"
```

## Multi-header, footer, and editing

Use column `children` for grouped headers; `show-footer` + `footer-method` for summaries; `edit-config` + column `editable` for cell editing (`#edit-{key}` / `edit-change`); `span-method` for merges.

```vue preview src="./demos/GridFeatures.en.vue"
```

## Empty and loading

```vue preview src="./demos/EmptyAndLoading.en.vue"
```

## Server mode

Pass `server-options` with `server-total`, and sync page / page size / sort via `v-model:server-options`.

```vue preview src="./demos/Demo7.vue"
```

## Breaking changes

- `serverItemsLength` → `serverTotal`
- `rowsItems` → `pageSizes`
- Removed `hideHeader`; use `showHeader` (default `true`)
- Removed `hideRowsPerPage`; use `showRowsPerPage` (default `true`)
- Removed: `clickEventType`, `rowsPerPageMessage`, `rowsOfPageSeparatorMessage`, `preventContextMenuRow`, `tableNodeId`
- Events: `contextmenuRow` → `row-contextmenu`; `selectRow` / `deselectRow` / `selectAll` → `select-row` / `deselect-row` / `select-all`
- Removed events: `updatePageItems`, `updateTotalItems`, `page` (keep `update:page`)
- Row interaction: click and dblclick always emit (`row-click` / `row-dblclick`); context menu always `preventDefault`s and emits `row-contextmenu`

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
| `resizable` | `boolean` | Drag to resize column width. |
| `filterable` | `boolean` | Show header filter trigger. |
| `filters` | `TableColumnFilter[]` | Header filter options; omit for text filter. |
| `children` | `TableColumnDefinition[]` | Nested columns for multi-level headers. |
| `editable` | `boolean` | Editable when `editConfig` is set. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumnDefinition[]` | — | Column definitions. |
| `rows` | `TableItem[]` | — | Row data. |
| `fit` | `boolean` | `true` | Flexible columns fill remaining width. |
| `selectionMode` | `'single' \| 'multiple' \| null` | `null` | Row selection mode. |
| `selection` | `TableItem[] \| null` | `null` | Multi-select (`v-model:selection`). |
| `serverOptions` | `TableServerOptions \| null` | `null` | Server paging/sort options. |
| `serverTotal` | `number` | `0` | Total row count in server mode. |
| `paginator` | `boolean` | `false` | Built-in pagination footer. |
| `page` | `number` | `1` | Current page (`v-model:page`). |
| `rowsPerPage` | `number` | `25` | Page size. |
| `pageSizes` | `number[]` | `[25, 50, 100]` | Page size options. |
| `showHeader` | `boolean` | `true` | Show table header. |
| `showRowsPerPage` | `boolean` | `true` | Show page-size picker. |
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
| `header-{key}` | Header slot (exact key case). |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `sort` | `{ sortField?, sortOrder? }` | Sort changed. |
| `row-click` | `{ row, index }`, `Event` | Row clicked. |
| `row-dblclick` | `{ row, index }`, `Event` | Row double-clicked. |
| `row-contextmenu` | `item`, `MouseEvent` | Row context menu. |
| `select-row` / `deselect-row` | `TableItem` | Row selection toggled. |
| `select-all` | — | Select all on current page. |
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
  align?: 'start' | 'center' | 'end'
  render?: (row: TableItem) => unknown
  filterable?: boolean
  filters?: TableColumnFilter[]
  resizable?: boolean
  children?: TableColumnDefinition[]
  editable?: boolean
  showOverflowTooltip?: boolean
}
```

<h4 id="TableServerOptions">TableServerOptions</h4>

Server-side paging/sorting payload for `serverOptions`, with `serverTotal`:

```ts
interface TableServerOptions {
  page: number
  rowsPerPage: number
  sortBy?: string | string[]
  sortType?: 'asc' | 'desc' | ('asc' | 'desc')[]
}
```

`TableItem` is `Record<string, unknown>`. See also [API types](/docs/types).
