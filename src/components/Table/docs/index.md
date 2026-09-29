---
title: Table
category: 03 / DATA
description: 数据表格。支持排序、筛选、选择、分页、固定列与空/加载态。列宽支持 width / minWidth / fit。
---

# Table

`MTable` 用于展示结构化行数据。通过 `columns` 定义列、`rows` 传入数据；内置客户端排序、筛选、分页与行选择，也支持服务端分页模式。多选表头「全选」仅作用于当前页。

列宽规则：

- 设置了 `width` 的列为固定宽度
- 未设 `width` 的列以 `minWidth`（默认 `80`）为弹性下限；`fit` 为 `true`（默认）时，剩余宽度按比例分配给弹性列
- 总最小宽度超出容器时出现横向滚动
- 需要表体自己滚动时用 `maxHeight` / `tableHeight`；与 `MLayout` 根滚动叠用时优先固定表高，避免双层滚动条
- 全视口主列表可用 `MPageContent fill` + `MTable fill paginator`（表体滚动、分页贴底）；嵌入表或短页不必使用 `fill`

## 引入

```ts
import type { TableColumnDefinition, TableItem } from 'morya-ui'
import { MTable, MTag } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## 行选择

多选配合 `selection-mode="multiple"` 与 `v-model:selection`；单选使用 `selection-mode="single"` 与 `v-model:selected-item`。表头全选仅选中当前页。

```vue preview src="./demos/Selection.zh.vue"
```

## 筛选与分页

客户端筛选可通过 `search-value` / `filter-options`；分页开启 `paginator` 并配合 `v-model:page` 与 `rows-per-page`（受控同步）。

```vue preview src="./demos/FilterAndPagination.zh.vue"
```

## 固定列

列定义中设置 `fixed: 'left' | 'right'`（或 `fixed: true` 视为左固定）。

```vue preview src="./demos/FixedColumns.zh.vue"
```

## 展开行与列渲染

列可通过 `render` 或 `#cell-{key}` 自定义单元格。展开行设置 `expandable`（或 `expandConfig`），详情由 `#expansion` 提供。树模式下 `expandedRowKeys` 用于树节点展开，不可同时用于详情展开。

```vue preview src="./demos/ExpandableRows.zh.vue"
```

## 列宽拖拽与表头筛选

列设置 `resizable` 可拖拽改宽（`v-model:column-widths`）；`filterable` 显示表头筛选，可选 `filters` 为多选选项，否则为文本包含筛选。

```vue preview src="./demos/ResizeAndFilter.zh.vue"
```

## 虚拟滚动

开启 `virtual`，并提供 `maxHeight` / `tableHeight` / `fill` 之一。展开行场景会自动降级为普通渲染。

```vue preview src="./demos/VirtualScroll.zh.vue"
```

## 多级表头、表尾与合并

列支持 `children` 多级表头；`show-footer` + `footer-method` 渲染合计；`span-method` 合并单元格。

```vue preview src="./demos/GridFeatures.zh.vue"
```

## 空态与加载

```vue preview src="./demos/EmptyAndLoading.zh.vue"
```

## 树形表格

传入 `tree-config` 启用树模式：嵌套 `children`，或 `transform` + `parentId` 扁平数据。展开状态用 `v-model:expanded-row-keys`。支持 `expandAll` / `expandRowKeys`、`accordion`、`trigger`、`toggleMethod`、懒加载 `lazy` + `loadMethod`。

实例方法：`setTreeExpand`、`setAllTreeExpand`、`toggleTreeExpand`、`isTreeExpandByRow`、`getTreeExpandRecords`、`clearTreeExpand`。

树 + 多选时默认父子级联与半选（`checkbox-config.check-strictly=false`）；`checkMethod` 可禁用单行勾选。

```vue preview src="./demos/Tree.zh.vue"
```

## 服务端模式

传入 `server-options` 与 `server-total`，通过 `v-model:server-options` 同步页码、每页条数与排序字段。

```vue preview src="./demos/Demo7.vue"
```

## Breaking changes

- 移除内置单元格编辑：`editConfig`、列 `editable`、`edit-change`、`#edit-{key}`；请用 `#cell-{key}` / `render` 自定义
- 移除 `MTreeTable`（含 `morya-ui/tree-table`）；树表改用 `MTable` + `treeConfig`
- `serverItemsLength` → `serverTotal`；`rowsItems` → `pageSizes`
- `hideHeader` 移除；改用 `showHeader`（默认 `true`）
- `hideRowsPerPage` 移除；改用 `showRowsPerPage`（默认 `true`）
- 移除：`clickEventType`、`rowsPerPageMessage`、`rowsOfPageSeparatorMessage`、`preventContextMenuRow`、`tableNodeId`
- 事件：`contextmenuRow` → `row-contextmenu`；`selectRow` / `deselectRow` / `selectAll` → `select-row` / `deselect-row` / `select-all`
- 移除事件：`updatePageItems`、`updateTotalItems`、`page`（保留 `update:page`）
- 行交互：始终同时支持单击 / 双击（`row-click` / `row-dblclick`）；右键始终 `preventDefault` 并抛出 `row-contextmenu`

## TableColumnDefinition

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 列字段名（绑定行数据的键）。 |
| `label` | `string` | 列头文案。 |
| `width` | `number` | 固定列宽（px）。 |
| `minWidth` | `number` | 弹性列最小宽度，默认 `80`。 |
| `sortable` | `boolean` | 是否可排序。 |
| `fixed` | `boolean \| 'left' \| 'right'` | 固定列；`true` 等同 `'left'`。 |
| `align` | `'start' \| 'center' \| 'end'` | 单元格对齐。 |
| `render` | `(row) => unknown` | 自定义单元格渲染。 |
| `showOverflowTooltip` | `boolean` | 该列文本溢出时显示 Tooltip。 |
| `resizable` | `boolean` | 可拖拽调整列宽。 |
| `filterable` | `boolean` | 显示表头筛选。 |
| `filters` | `TableColumnFilter[]` | 表头筛选选项；省略则为文本筛选。 |
| `children` | `TableColumnDefinition[]` | 多级表头子列。 |

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `TableColumnDefinition[]` | — | 列定义。 |
| `rows` | `TableItem[]` | — | 行数据。 |
| `fit` | `boolean` | `true` | 弹性列是否撑满表格宽度。 |
| `selectionMode` | `'single' \| 'multiple' \| null` | `null` | 行选择模式。 |
| `selection` | `TableItem[] \| null` | `null` | 多选绑定（`v-model:selection`）。 |
| `selectedItem` | `TableItem \| null` | `null` | 单选绑定（`v-model:selected-item`）。 |
| `serverOptions` | `TableServerOptions \| null` | `null` | 服务端分页/排序选项。 |
| `serverTotal` | `number` | `0` | 服务端总条数。 |
| `paginator` | `boolean` | `false` | 显示内置分页页脚。 |
| `page` | `number` | `1` | 当前页（`v-model:page`）。 |
| `rowsPerPage` | `number` | `25` | 每页条数。 |
| `pageSizes` | `number[]` | `[25, 50, 100]` | 分页每页条数选项。 |
| `showHeader` | `boolean` | `true` | 是否显示表头。 |
| `showRowsPerPage` | `boolean` | `true` | 是否显示每页条数选择器。 |
| `fill` | `boolean` | `false` | 撑满父级剩余高度（仅全视口主列表配 `MPageContent fill`）；表体滚动，分页贴底。设置 `maxHeight` / `tableHeight` 时忽略。 |
| `columnWidths` | `Record<string, number> \| null` | `null` | 列宽（`v-model:column-widths`）。 |
| `virtual` | `boolean` | `false` | 行虚拟滚动（需高度；展开行时跳过）。 |
| `virtualRowHeight` | `number` | `40` | 虚拟行高估算。 |
| `hiddenColumns` | `string[] \| null` | `null` | 隐藏列键（`v-model:hidden-columns`）。 |
| `columnOrder` | `string[] \| null` | `null` | 叶列顺序（`v-model:column-order`）。 |
| `showFooter` | `boolean` | `false` | 显示表尾。 |
| `footerMethod` | `TableFooterMethod \| null` | `null` | 表尾数据。 |
| `spanMethod` | `TableSpanMethod \| null` | `null` | 单元格合并。 |
| `treeConfig` | `TableTreeConfig \| null` | `null` | 树形行。 |
| `expandConfig` | `TableExpandConfig \| null` | `null` | 详情展开配置（与树互斥）。 |
| `checkboxConfig` | `TableCheckboxConfig \| null` | `null` | 多选：级联 / `checkMethod` / `checkRowKeys` / `trigger` / `reserve`。 |
| `radioConfig` | `TableRadioConfig \| null` | `null` | 单选：`strict` / `checkMethod` / `trigger`。 |
| `expandable` | `boolean` | `false` | 显示展开列（也可由 `#expansion` 或 `expandConfig` 启用）。 |
| `striped` | `boolean` | `false` | 斑马纹行。 |
| `bordered` | `boolean` | `false` | 单元格边框。 |
| `highlightCurrent` | `boolean` | `false` | 高亮当前行，配合 `v-model:current-row-key`。 |
| `rowHover` | `boolean` | `true` | 行 hover 高亮。 |
| `sortField` / `sortOrder` | — | — | 受控排序字段与方向。 |
| `sortMode` | `'client' \| 'emit'` | `'client'` | 客户端排序或仅抛出排序事件。 |
| `searchField` / `searchValue` | — | — | 客户端搜索。 |
| `filterOptions` | `TableFilterOption[]` | `null` | 结构化筛选条件。 |
| `loading` | `boolean` | `false` | 加载中。 |
| `emptyText` | `string` | — | 空数据文案。 |
| `emptyDescription` | `string` | — | 空数据补充说明。 |
| `maxHeight` | `number \| null` | `null` | 表格最大高度，超出滚动。 |
| `showOverflowTooltip` | `boolean` | `false` | 全局单元格溢出 Tooltip。 |
| `rowKey` | `string` | `'id'` | 行唯一键字段。 |
| `size` | `'sm' \| 'md' \| 'lg'` | — | 表格密度。 |
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
| `filters` | `Record<string, unknown> \| null` | — | — |
| `fixedCheckbox` | `boolean` | — | — |
| `fixedExpand` | `boolean` | — | — |
| `fixedHeader` | `boolean` | — | — |
| `fixedIndex` | `boolean` | — | — |
| `headerClassName` | `string` | — | — |
| `headerItemClassName` | `TableHeaderItemClassName` | — | — |
| `headerTextDirection` | `TableTextDirection` | — | — |
| `indexColumnWidth` | `number` | — | — |
| `multiSort` | `boolean` | — | — |
| `mustSort` | `boolean` | — | — |
| `showIndex` | `boolean` | — | — |
| `showIndexSymbol` | `string` | — | — |
| `tableClassName` | `string` | — | — |
| `tableHeight` | `number \| null` | — | — |
| `tableMinHeight` | `number` | — | — |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots

| 插槽 | 说明 |
| --- | --- |
| `cell-{key}` | 列 `{key}` 单元格，作用域 `{ row, value, column }`（可自行实现编辑器）。 |
| `footer` | 自定义表尾。 |
| `body-cell` | 任意单元格，作用域 `{ row, column, value }`。 |
| `expansion` | 展开行内容，作用域 `{ row }`。 |
| `empty` | 自定义空态。 |
| `loading` | 自定义加载态。 |
| `pagination` | 自定义分页区域。 |
| `body` | 自定义 `body` 内容。 |
| `body-append` | 自定义 `body-append` 内容。 |
| `body-prepend` | 自定义 `body-prepend` 内容。 |
| `customize-headers` | 自定义 `customize-headers` 内容。 |
| `header` | 自定义 `header` 内容。 |
| `header-{key}` | 列头插槽（键名大小写与 `columns[].key` 一致）。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `sort` | `{ sortField?, sortOrder? }` | 排序变化。 |
| `row-click` | `{ row, index }`, `Event` | 行单击。 |
| `row-dblclick` | `{ row, index }`, `Event` | 行双击。 |
| `row-contextmenu` | `item`, `MouseEvent` | 行右键。 |
| `select-row` | `TableItem` | 选中一行。 |
| `deselect-row` | `TableItem` | 取消选中一行。 |
| `select-all` | — | 全选当前页。 |
| `current-change` | `row \| null, oldRow \| null` | 当前高亮行变化。 |
| `expand` | `{ row, expanded }` | 行展开。 |
| `update:selection` | `TableItem[]` | 多选 v-model。 |
| `update:page` | `number` | 页码 v-model。 |
| `update:server-options` | `TableServerOptions` | 服务端选项 v-model。 |
| `update:current-row-key` | `string \| number \| null` | 当前行键 v-model。 |
| `filter` | — | — |
| `update:expandedRowKeys` | — | — |
| `update:filters` | — | — |
| `update:columnWidths` | `Record<string, number>` | 列宽 v-model。 |
| `update:hiddenColumns` | `string[]` | 隐藏列 v-model。 |
| `update:columnOrder` | `string[]` | 列顺序 v-model。 |
| `update:selectedItem` | — | — |

## 实例方法

通过 `ref` 可访问分页、筛选、选择、滚动与展开控制：

| 方法 / 属性 | 说明 |
| --- | --- |
| `currentPageFirstIndex` | 当前页首条记录的索引（无数据时为 `-1`）。 |
| `currentPageLastIndex` | 当前页末条记录的索引。 |
| `clientItemsLength` | 数据总条数（服务端模式下为服务端总数）。 |
| `maxPaginationNumber` | 最大页码。 |
| `currentPaginationNumber` | 当前页码。 |
| `isLastPage` / `isFirstPage` | 是否末页 / 首页。 |
| `nextPage()` / `prevPage()` | 下一页 / 上一页。 |
| `updatePage(page)` | 跳到指定页码。 |
| `rowsPerPageOptions` | 每页条数选项。 |
| `rowsPerPageActiveOption` | 当前生效的每页条数。 |
| `updateRowsPerPageActiveOption(n)` | 修改每页条数。 |
| `setFilters(filters)` / `clearFilter()` | 设置 / 清空筛选。 |
| `clearSort()` | 清空排序。 |
| `getCheckboxRecords()` | 当前多选行。 |
| `setCheckboxRow(rows, checked)` | 设置行选中状态。 |
| `clearCheckboxRow()` | 清空多选。 |
| `isCheckedByCheckboxRow(row)` | 行是否选中。 |
| `isAllCheckboxChecked()` | 当前页是否全选。 |
| `getCheckboxIndeterminateRecords()` | 半选行（树级联）。 |
| `scrollTo(...)` / `scrollToRow(row)` | 滚动定位。 |
| `setRowExpand` / `setAllRowExpand` / `toggleRowExpand` / `clearRowExpand` / `isRowExpandByRow` / `getRowExpandRecords` | 详情展开（非树模式）。 |
| `setTreeExpand` / `setAllTreeExpand` / `toggleTreeExpand` / `clearTreeExpand` / `isTreeExpandByRow` / `getTreeExpandRecords` | 树节点展开。 |

## 类型

<h4 id="TableItem">TableItem</h4>

完整定义见源码 `types.ts`。

```ts
type TableItem = Record<string, unknown>
```

<h4 id="TableTextDirection">TableTextDirection</h4>

完整定义见源码 `types.ts`。

```ts
type TableTextDirection = 'left' | 'center' | 'right'
```

<h4 id="TableFilterOption">TableFilterOption</h4>

完整定义见源码 `types.ts`。

```ts
type TableFilterOption = | { field: string; comparison: 'between'; criteria: [number, number] }
  | { field: string; comparison: '=' | '!='; criteria: number | string }
  | { field: string; comparison: '>' | '>=' | '<' | '<='; criteria: number }
  | { field: number | string; comparison: 'in'; criteria: number[] | string[] }
  | { field: string; comparison: (value: unknown, criteria: string) => boolean; criteria: string }
```

<h4 id="TableHeaderItemClassName">TableHeaderItemClassName</h4>

完整定义见源码 `types.ts`。

```ts
type TableHeaderItemClassName = string | ((header: TableHeader, columnNumber: number) => string)
```

<h4 id="TableBodyRowClassName">TableBodyRowClassName</h4>

完整定义见源码 `types.ts`。

```ts
type TableBodyRowClassName = string | ((item: TableItem, rowNumber: number) => string)
```

<h4 id="TableBodyItemClassName">TableBodyItemClassName</h4>

完整定义见源码 `types.ts`。

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

列定义，传给 `columns`：

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
}
```

<h4 id="TableServerOptions">TableServerOptions</h4>

服务端分页/排序时传给 `serverOptions`，配合 `serverTotal`：

```ts
interface TableServerOptions {
  page: number
  rowsPerPage: number
  sortBy?: string | string[]
  sortType?: 'asc' | 'desc' | ('asc' | 'desc')[]
}
```

更多见 [API 类型](/docs/types)。
