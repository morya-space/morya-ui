---
title: Table
category: 03 / DATA
description: Data table with sorting, filtering, selection, pagination, fixed columns, column drag, column settings, skeleton loading and virtual scrolling. Column widths support width / minWidth / fit.
---

# Table

`MTable` renders structured row data. Pass `columns` for column definitions and `rows` for data; built-in client-side sorting, filtering, pagination and row selection are included, with a server-side mode for remote sources. The header "select all" only applies to the current page.

Column width rules:

- Columns with `width` are fixed.
- Columns without `width` flex from `minWidth` (default `80`); when `fit` is `true` (default), remaining space is distributed proportionally.
- Total minimum width beyond the container triggers horizontal scrolling.
- Use `maxHeight` / `tableHeight` for body scrolling; with `MLayout` root scrolling prefer a fixed table height to avoid double scrollbars.
- Full-viewport lists: `MPageContent fill` + `MTable fill paginator` (body scrolls, paginator pinned). Embedded tables and short pages don't need `fill`.

## Import

```ts
import type { TableColumnDefinition, TableItem, TableSortConfig, TablePassThrough } from 'morya-ui'
import { MTable, MTag } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Row Selection

Multiple selection uses `selection-mode="multiple"` with `v-model:selection`; single selection uses `selection-mode="single"` with `v-model:selected-item`. Header "select all" only applies to the current page.

```vue preview src="./demos/Selection.en.vue"
```

## Filtering & Pagination

Client-side filtering via `search-value` / `filter-options`; enable `paginator` with `v-model:page` and `rows-per-page` (controlled).

```vue preview src="./demos/FilterAndPagination.en.vue"
```

## Fixed Columns

Set `fixed: 'left' | 'right'` in the column definition (`fixed: true` equals left).

```vue preview src="./demos/FixedColumns.en.vue"
```

## Expandable Rows & Cell Rendering

Customize cells via `render` or `#cell-{key}`. Enable row details with `expandable` (or `expandConfig`) and provide content via `#expansion`. In tree mode `expandedRowKeys` is reserved for tree nodes and cannot also drive detail expansion.

```vue preview src="./demos/ExpandableRows.en.vue"
```

## Sorting (sortConfig)

Use `sort-config` to configure sorting in one place: `{ field, order, multiple, must, mode }`. With `mode: 'client'` (default) the table sorts the current page itself; with `mode: 'emit'` only the `sort-change` event is emitted and the data is owned by the caller (useful for server-side sorting). Set `multiple: true` for multi-column sort and `must: true` to prevent clearing.

```vue preview src="./demos/Sorting.en.vue"
```

## Column Resizing & Header Filters

Set `resizable` to drag column widths (`v-model:column-widths`); `filterable` adds a header filter — column `filters` becomes a multi-select, otherwise a text-contains filter. **Clear** resets the draft, **OK** commits to `v-model:filter-model` (legacy `v-model:filters` still supported).

```vue preview src="./demos/ResizeAndFilter.en.vue"
```

## Column Settings Panel

Enable `column-setting` to show a settings button in the header corner. The popover lets users toggle column visibility, synced via `v-model:hidden-columns`. Panel copy follows `MLocale`.

```vue preview src="./demos/ColumnSetting.en.vue"
```

## Column Drag

Enable `column-drag` to reorder leaf columns by dragging header cells. Order is synced through `v-model:column-order`. Drag-and-drop stays within a single header level and never breaks multi-level headers.

```vue preview src="./demos/ColumnDrag.en.vue"
```

## Skeleton Loading

Enable `skeleton` for a skeleton loading state instead of a full-overlay spinner. `skeleton-rows` controls the number of placeholder rows (default `5`). Skeleton previews preserve the layout and feel much faster.

```vue preview src="./demos/Skeleton.en.vue"
```

## Virtual Scrolling

Enable `virtual` and provide one of `maxHeight` / `tableHeight` / `fill` to form a scroll viewport; without one, the dev build warns. Expandable rows / `#expansion` / `expandConfig` are mutually exclusive with virtualization and fall back to plain rendering (with a dev warning).

```vue preview src="./demos/VirtualScroll.en.vue"
```

## Dynamic Row Height Virtual Scrolling

By default virtual scrolling assumes all rows have equal height (estimated by `virtual-row-height`). If your rows vary in height due to content, enable `virtual-dynamic-row-height`: the table measures each row with `ResizeObserver`, caches the result, and uses prefix sums + binary search for O(log n) positioning, keeping long lists smooth.

```vue preview src="./demos/DynamicRowHeight.en.vue"
```

## Multi-level Headers, Footer & Span

Columns support `children` for multi-level headers; `show-footer` + `footer-method` renders totals (`footerMethod({ columns, data })` returns a row matrix, or use `#footer` for full customization); `span-method` merges cells.

```vue preview src="./demos/GridFeatures.en.vue"
```

## Empty & Loading

```vue preview src="./demos/EmptyAndLoading.en.vue"
```

## Tree Table

Pass `tree-config` to enable tree mode: nested `children`, or `transform` + `parentId` for flat data. Expansion state is bound with `v-model:expanded-row-keys`. Supports `expandAll` / `expandRowKeys`, `accordion`, `trigger`, `toggleMethod`, and lazy loading via `lazy` + `loadMethod`.

Instance methods: `setTreeExpand`, `setAllTreeExpand`, `toggleTreeExpand`, `isTreeExpandByRow`, `getTreeExpandRecords`, `clearTreeExpand`.

With multiple selection, parent-child cascading with half-check is enabled by default (`checkbox-config.check-strictly=false`); use `checkMethod` to disable a row's checkbox.

```vue preview src="./demos/Tree.en.vue"
```

## Server Mode

Pass `server-options` and `server-total`, syncing page, rows-per-page and sort fields via `v-model:server-options`.

```vue preview src="./demos/Demo7.vue"
```

## Breaking changes

- Built-in cell editing removed: `editConfig`, column `editable`, `edit-change`, `#edit-{key}`; use `#cell-{key}` / `render` instead.
- `MTreeTable` removed (including `morya-ui/tree-table`); use `MTable` + `treeConfig`.
- `serverItemsLength` → `serverTotal`; `rowsItems` → `pageSizes`.
- `hideHeader` removed; use `showHeader` (default `true`).
- `hideRowsPerPage` removed; use `showRowsPerPage` (default `true`).
- Removed: `clickEventType`, `rowsPerPageMessage`, `rowsOfPageSeparatorMessage`, `preventContextMenuRow`, `tableNodeId`.
- Events: `sortChange` → `sort-change`; `expandRow` → `expand-change`; `contextmenuRow` → `row-contextmenu`; `selectRow` / `deselectRow` / `selectAll` → `select-row` / `deselect-row` / `select-all`.
- New event: `filter-change` (header filter commit).
- Removed events: `updatePageItems`, `updateTotalItems`, `page` (`update:page` kept).
- Row interactions: always support single / double click (`row-click` / `row-dblclick`); right-click always `preventDefault` and emits `row-contextmenu`.
- Sorting props merged: `sortField` / `sortOrder` / `multiSort` / `mustSort` / `sortMode` still work, but new code should use `sortConfig: TableSortConfig`.
- Filter v-model: `v-model:filters` still works; new code should use `v-model:filter-model`.

## TableColumnDefinition

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string` | Field name on the row. |
| `label` | `string` | Header text. |
| `width` | `number` | Fixed column width (px). |
| `minWidth` | `number` | Flex column minimum width, default `80`. |
| `sortable` | `boolean` | Sortable. |
| `fixed` | `boolean \| 'left' \| 'right'` | Fixed column; `true` equals `'left'`. |
| `align` | `'start' \| 'center' \| 'end'` | Cell alignment. |
| `render` | `(row) => unknown` | Custom cell renderer. |
| `showOverflowTooltip` | `boolean` | Show tooltip on overflow. |
| `resizable` | `boolean` | Allow drag resizing. |
| `filterable` | `boolean` | Show header filter. |
| `filters` | `TableColumnFilter[]` | Header filter options; omit for text filter. |
| `children` | `TableColumnDefinition[]` | Multi-level sub-columns. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `TableColumnDefinition[]` | — | Column definitions. |
| `rows` | `TableItem[]` | — | Row data. |
| `fit` | `boolean` | `true` | Stretch flex columns to fill width. |
| `selectionMode` | `'single' \| 'multiple' \| null` | `null` | Selection mode. |
| `selection` | `TableItem[] \| null` | `null` | Multiple selection (`v-model:selection`). |
| `selectedItem` | `TableItem \| null` | `null` | Single selection (`v-model:selected-item`). |
| `serverOptions` | `TableServerOptions \| null` | `null` | Server pagination/sort options. |
| `serverTotal` | `number` | `0` | Server total count. |
| `paginator` | `boolean` | `false` | Show built-in paginator. |
| `page` | `number` | `1` | Current page (`v-model:page`). |
| `rowsPerPage` | `number` | `25` | Rows per page. |
| `pageSizes` | `number[]` | `[25, 50, 100]` | Page size options. |
| `showHeader` | `boolean` | `true` | Show header. |
| `showRowsPerPage` | `boolean` | `true` | Show rows-per-page selector. |
| `fill` | `boolean` | `false` | Fill parent height (with `MPageContent fill`); body scrolls, paginator pinned. Ignored when `maxHeight` / `tableHeight` is set. |
| `columnWidths` | `Record<string, number> \| null` | `null` | Column widths (`v-model:column-widths`). |
| `virtual` | `boolean` | `false` | Row virtualization (requires a height; skipped with expand rows). |
| `virtualRowHeight` | `number` | `40` | Estimated virtual row height. |
| `virtualDynamicRowHeight` | `boolean` | `false` | Dynamic row-height virtualization (measured & cached via `ResizeObserver`). |
| `virtualOverscan` | `number` | `4` | Extra rows rendered above/below the viewport to avoid flicker. |
| `hiddenColumns` | `string[] \| null` | `null` | Hidden column keys (`v-model:hidden-columns`). |
| `columnOrder` | `string[] \| null` | `null` | Leaf column order (`v-model:column-order`). |
| `columnSetting` | `boolean` | `false` | Show column settings button (visibility toggle). |
| `columnDrag` | `boolean` | `false` | Header drag reordering. |
| `skeleton` | `boolean` | `false` | Skeleton loading state. |
| `skeletonRows` | `number` | `5` | Skeleton row count. |
| `showFooter` | `boolean` | `false` | Show footer. |
| `footerMethod` | `TableFooterMethod \| null` | `null` | Footer data. |
| `spanMethod` | `TableSpanMethod \| null` | `null` | Cell span. |
| `treeConfig` | `TableTreeConfig \| null` | `null` | Tree rows. |
| `expandConfig` | `TableExpandConfig \| null` | `null` | Detail expansion (mutually exclusive with tree). |
| `checkboxConfig` | `TableCheckboxConfig \| null` | `null` | Multiple selection: cascade / `checkMethod` / `checkRowKeys` / `trigger` / `reserve`. |
| `radioConfig` | `TableRadioConfig \| null` | `null` | Single selection: `strict` / `checkMethod` / `trigger`. |
| `expandable` | `boolean` | `false` | Show expand column (also enabled by `#expansion` or `expandConfig`). |
| `striped` | `boolean` | `false` | Zebra rows. |
| `bordered` | `boolean` | `false` | Cell borders. |
| `highlightCurrent` | `boolean` | `false` | Highlight current row; pair with `v-model:current-row-key`. |
| `rowHover` | `boolean` | `true` | Row hover highlight. |
| `sortConfig` | `TableSortConfig \| null` | `null` | Unified sorting config `{ field, order, multiple, must, mode }`. |
| `sortField` | `string \| null` | `null` | (legacy) Single-field sort. Prefer `sortConfig`. |
| `sortOrder` | `'asc' \| 'desc' \| null` | `null` | (legacy) Sort direction. Prefer `sortConfig`. |
| `multiSort` | `boolean` | `false` | (legacy) Multi-column sort. Prefer `sortConfig.multiple`. |
| `mustSort` | `boolean` | `false` | (legacy) Disallow clearing sort. Prefer `sortConfig.must`. |
| `sortMode` | `'client' \| 'emit'` | `'client'` | (legacy) Sort mode. Prefer `sortConfig.mode`. |
| `searchField` / `searchValue` | — | — | Client-side search. |
| `filterOptions` | `TableFilterOption[]` | `null` | Structured filter criteria. |
| `filterModel` | `Record<string, unknown> \| null` | `null` | Header filter v-model (`update:filter-model`). |
| `filters` | `Record<string, unknown> \| null` | `null` | (legacy) Old filter v-model name. |
| `loading` | `boolean` | `false` | Loading state. |
| `emptyText` | `string` | — | Empty text. |
| `emptyDescription` | `string` | — | Empty description. |
| `maxHeight` | `number \| null` | `null` | Max height, scrolls beyond. |
| `showOverflowTooltip` | `boolean` | `false` | Global overflow tooltip. |
| `rowKey` | `string` | `'id'` | Row unique key field. |
| `size` | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Density (`large`/`small` adjust cell padding). |
| `ariaLabel` | `string` | — | — |
| `bodyExpandRowClassName` | `TableBodyRowClassName` | — | — |
| `bodyItemClassName` | `TableBodyItemClassName` | — | — |
| `bodyRowClassName` | `TableBodyRowClassName` | — | — |
| `bodyTextDirection` | `TableTextDirection` | — | — |
| `checkboxColumnWidth` | `number \| null` | — | — |
| `clickRowToExpand` | `boolean` | — | — |
| `currentRowKey` | `string \| number \| null` | — | — |
| `expandColumnWidth` | `number` | — | — |
| `expandedRowKeys` | `Array<string \| number>` | — | — |
| `fixedCheckbox` | `boolean` | — | — |
| `fixedExpand` | `boolean` | — | — |
| `fixedHeader` | `boolean` | — | — |
| `fixedIndex` | `boolean` | — | — |
| `headerClassName` | `string` | — | — |
| `headerItemClassName` | `TableHeaderItemClassName` | — | — |
| `headerTextDirection` | `TableTextDirection` | — | — |
| `indexColumnWidth` | `number` | — | — |
| `showIndex` | `boolean` | — | — |
| `showIndexSymbol` | `string` | — | — |
| `tableClassName` | `string` | — | — |
| `tableHeight` | `number \| null` | — | — |
| `tableMinHeight` | `number` | — | — |
| `pt` | `TablePassThrough` | — | Multi-part DOM pass-through: `{ root, scrollbar, thead, tbody, tfoot, pagination, emptyMessage }`. |

## Slots

| Slot | Description |
| --- | --- |
| `cell-{key}` | Cell of column `{key}`, scope `{ row, value, column }` (use it to build editors). |
| `footer` | Custom footer. |
| `body-cell` | Any cell, scope `{ row, column, value }`. |
| `expansion` | Expanded row content, scope `{ row }`. |
| `empty` | Custom empty state. |
| `loading` | Custom loading state (ignored when `skeleton` is true). |
| `pagination` | Custom pagination area. |
| `body` | Custom `body` content. |
| `body-append` | Custom `body-append` content. |
| `body-prepend` | Custom `body-prepend` content. |
| `customize-headers` | Custom `customize-headers` content. |
| `header` | Custom `header` content. |
| `header-{key}` | Header slot (case matches `columns[].key`). |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `sort-change` | `{ sortField?, sortOrder? }` | Sort changed. |
| `filter-change` | `Record<string, unknown> \| null` | Header filter committed (mirrors `update:filter-model`). |
| `expand-change` | `{ row, expanded }` | Row expansion changed (detail or tree). |
| `row-click` | `{ row, index }`, `Event` | Row click. |
| `row-dblclick` | `{ row, index }`, `Event` | Row double click. |
| `row-contextmenu` | `item`, `MouseEvent` | Row right click. |
| `select-row` | `TableItem` | Row selected. |
| `deselect-row` | `TableItem` | Row deselected. |
| `select-all` | — | All rows of current page selected. |
| `current-change` | `row \| null, oldRow \| null` | Current row changed. |
| `update:selection` | `TableItem[]` | Multiple selection v-model. |
| `update:page` | `number` | Page v-model. |
| `update:server-options` | `TableServerOptions` | Server options v-model. |
| `update:current-row-key` | `string \| number \| null` | Current row key v-model. |
| `update:expanded-row-keys` | `Array<string \| number>` | Expanded row keys v-model. |
| `update:filter-model` | `Record<string, unknown> \| null` | Header filter v-model. |
| `update:column-widths` | `Record<string, number>` | Column widths v-model. |
| `update:hidden-columns` | `string[]` | Hidden columns v-model. |
| `update:column-order` | `string[]` | Column order v-model. |
| `update:selected-item` | `TableItem \| null` | Single selection v-model. |

## Instance API

Access via `ref`:

| Method / Property | Description |
| --- | --- |
| `currentPageFirstIndex` | Index of the first record on the current page (`-1` if empty). |
| `currentPageLastIndex` | Index of the last record on the current page. |
| `clientItemsLength` | Total row count (server total in server mode). |
| `maxPaginationNumber` | Maximum page number. |
| `currentPaginationNumber` | Current page number. |
| `isLastPage` / `isFirstPage` | Whether on the last / first page. |
| `nextPage()` / `prevPage()` | Go to next / previous page. |
| `updatePage(page)` | Go to a specific page. |
| `rowsPerPageOptions` | Rows-per-page options. |
| `rowsPerPageActiveOption` | Current rows-per-page value. |
| `updateRowsPerPageActiveOption(n)` | Update rows-per-page. |
| `setFilters(filters)` / `clearFilter()` | Set / clear filters. |
| `setColumnWidths(widths)` | Set column widths (same as `v-model:column-widths`). |
| `setHiddenColumns(keys)` | Set hidden column keys (same as `v-model:hidden-columns`). |
| `setColumnOrder(keys)` | Set leaf column order (same as `v-model:column-order`). |
| `clearSort()` | Clear sorting. |
| `getCheckboxRecords()` | Currently checked rows. |
| `setCheckboxRow(rows, checked)` | Set row checked state. |
| `clearCheckboxRow()` | Clear all checked rows. |
| `isCheckedByCheckboxRow(row)` | Whether a row is checked. |
| `isAllCheckboxChecked()` | Whether all rows on the current page are checked. |
| `getCheckboxIndeterminateRecords()` | Indeterminate (half-checked) rows in tree cascade. |
| `scrollTo(...)` / `scrollToRow(row)` | Scroll positioning. |
| `setRowExpand` / `setAllRowExpand` / `toggleRowExpand` / `clearRowExpand` / `isRowExpandByRow` / `getRowExpandRecords` | Detail expansion (non-tree). |
| `setTreeExpand` / `setAllTreeExpand` / `toggleTreeExpand` / `clearTreeExpand` / `isTreeExpandByRow` / `getTreeExpandRecords` | Tree node expansion. |

## Types

<h4 id="TableItem">TableItem</h4>

```ts
type TableItem = Record<string, unknown>
```

<h4 id="TableSortConfig">TableSortConfig</h4>

Unified sort config; `field` / `order` describe the current single-column sort, `mode` chooses between internal and external sorting:

```ts
interface TableSortConfig {
  field?: string | null
  order?: 'asc' | 'desc' | null
  multiple?: boolean
  must?: boolean
  mode?: 'client' | 'emit'
}
```

<h4 id="TablePassThrough">TablePassThrough</h4>

Multi-part DOM pass-through; supports class / style / any attrs:

```ts
interface TablePassThrough {
  root?: Record<string, unknown>
  scrollbar?: Record<string, unknown>
  thead?: Record<string, unknown>
  tbody?: Record<string, unknown>
  tfoot?: Record<string, unknown>
  pagination?: Record<string, unknown>
  emptyMessage?: Record<string, unknown>
}
```

<h4 id="TableTextDirection">TableTextDirection</h4>

```ts
type TableTextDirection = 'left' | 'center' | 'right'
```

<h4 id="TableFilterOption">TableFilterOption</h4>

```ts
type TableFilterOption =
  | { field: string; comparison: 'between'; criteria: [number, number] }
  | { field: string; comparison: '=' | '!='; criteria: number | string }
  | { field: string; comparison: '>' | '>=' | '<' | '<='; criteria: number }
  | { field: number | string; comparison: 'in'; criteria: number[] | string[] }
  | { field: string; comparison: (value: unknown, criteria: string) => boolean; criteria: string }
```

<h4 id="TableHeaderItemClassName">TableHeaderItemClassName</h4>

```ts
type TableHeaderItemClassName = string | ((header: TableHeader, columnNumber: number) => string)
```

<h4 id="TableBodyRowClassName">TableBodyRowClassName</h4>

```ts
type TableBodyRowClassName = string | ((item: TableItem, rowNumber: number) => string)
```

<h4 id="TableBodyItemClassName">TableBodyItemClassName</h4>

```ts
type TableBodyItemClassName = string | ((column: string, rowNumber: number) => string)
```

<h4 id="TableTreeConfig">TableTreeConfig</h4>

```ts
interface TableTreeConfig {
  childrenField?: string // default 'children'
  indent?: number // default 16
  expandAll?: boolean
  accordion?: boolean
  trigger?: 'default' | 'row'
  lazy?: boolean
  hasChildField?: string // default 'hasChild'
  loadMethod?: (row: TableItem) => Promise<TableItem[]> | TableItem[]
  transform?: boolean // flat parentId → tree
  rowField?: string
  parentField?: string // default 'parentId'
  treeNode?: string // column key for toggler; default first column
  showLine?: boolean
}
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
  showOverflowTooltip?: boolean
  resizable?: boolean
  filterable?: boolean
  filters?: TableColumnFilter[]
  children?: TableColumnDefinition[]
}
```

<h4 id="TableServerOptions">TableServerOptions</h4>

Server pagination/sort options passed to `serverOptions`, paired with `serverTotal`:

```ts
interface TableServerOptions {
  page: number
  rowsPerPage: number
  sortBy?: string | string[]
  sortType?: 'asc' | 'desc' | ('asc' | 'desc')[]
}
```

See more at [API Types](/docs/types).
