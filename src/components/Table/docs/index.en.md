---
title: Table
category: 03 / DATA
description: Data table with sorting, filtering, selection, pagination, frozen columns, and empty/loading states. Column width supports width / minWidth / fit.
---

# Table

`MTable` displays structured row data. Define columns with `columns`, pass data with `rows`, and use built-in client-side sort, filter, pagination, and row selection—or switch to server-driven pagination. Header “select all” applies to the current page only.

Column width rules:

- Columns with `width` use a fixed width
- Columns without `width` are flexible with a `minWidth` lower bound (default `80`); when `fit` is `true` (default), remaining width is distributed proportionally
- Horizontal scrolling appears when the total minimum width exceeds the container
- Prefer `maxHeight` / `tableHeight` when the table body should scroll on its own; when nested under `MLayout` root scroll, fix the table height to avoid stacked scrollbars
- For full-viewport main lists, use `MPageContent fill` + `MTable fill paginator` (body scrolls; pagination at the bottom). Skip `fill` for embedded or short tables.


## When to use

- Data table with sorting, filtering, selection, pagination, frozen columns, and empty/loading states. Column width supports width / minWidth / fit
- Prefer composing documented `M*` APIs; see [Common Props](/docs/common-props).

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

Customize cells with `render` or `#cell-{key}`. Set `expandable` (or `expandConfig`) and provide the `#expansion` slot. In tree mode, `expandedRowKeys` controls tree nodes and cannot be used for detail expansion at the same time.

```vue preview src="./demos/ExpandableRows.en.vue"
```

## Fixed columns

Set `fixed: 'left' | 'right'` on a column (or `fixed: true` for left).

```vue preview src="./demos/FixedColumns.en.vue"
```

## Column resize and header filters

Set `resizable` to drag column widths (`v-model:column-widths`). Set `filterable` for a header filter; optional `filters` for checkbox options, otherwise free-text contains. **Clear** resets the draft only; **Confirm** applies to `v-model:filters`.

```vue preview src="./demos/ResizeAndFilter.en.vue"
```

## Virtual scroll

Enable `virtual` with `maxHeight` / `tableHeight` / `fill` so the body scrolls; dev mode warns if height is missing. Expandable rows (`#expansion` / `expandConfig`) disable virtualization (dev warning when both are set).

```vue preview src="./demos/VirtualScroll.en.vue"
```

## Multi-header, footer, and merges

Use column `children` for grouped headers; `show-footer` + `footer-method` for summaries (`footerMethod({ columns, data })` matrix or `#footer` slot); `span-method` for merges.

```vue preview src="./demos/GridFeatures.en.vue"
```

## Empty and loading

```vue preview src="./demos/EmptyAndLoading.en.vue"
```

## Tree table

Pass `tree-config` for hierarchical rows: nested `children`, or flat `parentId` with `transform`. Bind expand state with `v-model:expanded-row-keys`. Supports `expandAll` / `expandRowKeys`, `accordion`, `trigger`, `toggleMethod`, and lazy `loadMethod`.

Instance methods: `setTreeExpand`, `setAllTreeExpand`, `toggleTreeExpand`, `isTreeExpandByRow`, `getTreeExpandRecords`, `clearTreeExpand`.

With multi-select, parent/child cascade and indeterminate are on by default (`checkbox-config.check-strictly=false`). Use `checkMethod` to disable specific rows.

```vue preview src="./demos/Tree.en.vue"
```

## Server mode

Pass `server-options` with `server-total`, and sync page / page size / sort via `v-model:server-options`.

```vue preview src="./demos/Demo7.vue"
```

## Breaking changes

- Removed built-in cell editing: `editConfig`, column `editable`, `edit-change`, `#edit-{key}`; use `#cell-{key}` / `render` instead
- Removed `MTreeTable` (including `morya-ui/tree-table`); use `MTable` + `treeConfig`
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

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumnDefinition[]` | — | Column definitions. |
| `rows` | `TableItem[]` | — | Row data. |
| `fit` | `boolean` | `true` | Flexible columns fill remaining width. |
| `selectionMode` | `'single' \| 'multiple' \| null` | `null` | Row selection mode. |
| `selection` | `TableItem[] \| null` | `null` | Multi-select (`v-model:selection`). |
| `selectedItem` | `TableItem \| null` | `null` | Single-select (`v-model:selected-item`). |
| `serverOptions` | `TableServerOptions \| null` | `null` | Server paging/sort options. |
| `serverTotal` | `number` | `0` | Total row count in server mode. |
| `paginator` | `boolean` | `false` | Built-in pagination footer. |
| `page` | `number` | `1` | Current page (`v-model:page`). |
| `rowsPerPage` | `number` | `25` | Page size. |
| `pageSizes` | `number[]` | `[25, 50, 100]` | Page size options. |
| `showHeader` | `boolean` | `true` | Show table header. |
| `showRowsPerPage` | `boolean` | `true` | Show page-size picker. |
| `fill` | `boolean` | `false` | Fill remaining parent height (only for full-viewport main lists with `MPageContent fill`). Body scrolls; paginator stays at the bottom. Ignored when `maxHeight` / `tableHeight` is set. |
| `treeConfig` | `TableTreeConfig \| null` | `null` | Tree rows. |
| `expandConfig` | `TableExpandConfig \| null` | `null` | Detail expand (mutually exclusive with tree). |
| `checkboxConfig` | `TableCheckboxConfig \| null` | `null` | Multi-select options. |
| `radioConfig` | `TableRadioConfig \| null` | `null` | Single-select options. |
| `striped` / `bordered` | `boolean` | `false` | Striped rows / cell borders. |
| `highlightCurrent` | `boolean` | `false` | Highlight current row. |
| `loading` / `emptyText` / `emptyDescription` | — | — | Loading and empty states. |
| `maxHeight` | `number \| null` | `null` | Scrollable body max height. |
| `rowKey` | `string` | `'id'` | Stable row key field. |
| `size` | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Table density (`large`/`small` also adjust cell padding). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `cell-{key}` | Cell for column `{key}`; scope `{ row, value, column }` (use this for custom editors). |
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

Pagination, filter, selection, scroll, and expand controls via `ref`:

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
| `setFilters(filters)` / `clearFilter()` | Set / clear filters. |
| `setColumnWidths(widths)` | Set column widths (same as `v-model:column-widths`). |
| `setHiddenColumns(keys)` | Set hidden column keys (same as `v-model:hidden-columns`). |
| `setColumnOrder(keys)` | Set leaf column order (same as `v-model:column-order`). |
| `clearSort()` | Clear sort. |
| `getCheckboxRecords()` / `setCheckboxRow` / `clearCheckboxRow` / `isCheckedByCheckboxRow` / `isAllCheckboxChecked` | Selection APIs. |
| `scrollTo(...)` / `scrollToRow(row)` | Scroll helpers. |
| `setRowExpand` / `toggleRowExpand` / `clearRowExpand` / … | Detail expand (non-tree). |
| `setTreeExpand` / `toggleTreeExpand` / `clearTreeExpand` / … | Tree expand. |

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
