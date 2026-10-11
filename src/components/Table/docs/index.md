---
title: Table
category: 03 / DATA
description: 数据表格。支持排序、筛选、选择、分页、固定列、列拖拽、列设置、骨架屏与虚拟滚动。列宽支持 width / minWidth / fit。
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
import type { TableColumnDefinition, TableItem, TableSortConfig, TablePassThrough } from 'morya-ui'
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

## 排序（sortConfig）

通过 `sort-config` 统一配置排序：`{ field, order, multiple, must, mode }`。`mode: 'client'`（默认）由表格内部对当前页数据排序；`mode: 'emit'` 时表格只触发 `sort-change` 事件，数据由外部接管（适合服务端排序）。多列排序设 `multiple: true`，禁止取消排序设 `must: true`。

```vue preview src="./demos/Sorting.zh.vue"
```

## 列宽拖拽与表头筛选

列设置 `resizable` 可拖拽改宽（`v-model:column-widths`）；`filterable` 显示表头筛选，列定义里的 `filters` 为多选选项，省略则为文本包含筛选。面板内 **清除** 仅重置草稿，**确认** 后才写入 `v-model:filter-model`（旧 prop 名 `filters` 仍兼容）。

```vue preview src="./demos/ResizeAndFilter.zh.vue"
```

## 列设置面板

开启 `column-setting` 在表头右上角显示「列设置」按钮，弹出面板可勾选显示/隐藏列，配合 `v-model:hidden-columns` 持久化。面板文案随 `MLocale` 切换。

```vue preview src="./demos/ColumnSetting.zh.vue"
```

## 列拖拽排序

开启 `column-drag` 后，拖拽表头单元格可调整叶列顺序，顺序由 `v-model:column-order` 同步。拖放仅在同一层级内进行，不会破坏多级表头结构。

```vue preview src="./demos/ColumnDrag.zh.vue"
```

## 骨架屏加载

通过 `skeleton` 启用骨架屏加载态，替代整页遮罩 spinner；`skeleton-rows` 控制骨架行数（默认 `5`）。骨架屏会让用户提前感知表格布局，加载体验更好。

```vue preview src="./demos/Skeleton.zh.vue"
```

## 虚拟滚动

开启 `virtual`，并提供 `maxHeight` / `tableHeight` / `fill` 之一以形成滚动视口；缺高度时开发环境会 `console.warn`。展开行 / `#expansion` / `expandConfig` 与虚拟滚动互斥，会自动降级为普通渲染（开发环境会提示）。

```vue preview src="./demos/VirtualScroll.zh.vue"
```

## 动态行高虚拟滚动

默认虚拟滚动要求所有行等高（由 `virtual-row-height` 估算）。如果某些行由于内容差异存在不同高度，可开启 `virtual-dynamic-row-height`：表格会通过 `ResizeObserver` 实测每行高度并缓存，配合前缀和 + 二分查找实现 O(log n) 滚动定位，长列表下滚动仍保持流畅。

```vue preview src="./demos/DynamicRowHeight.zh.vue"
```

## 多级表头、表尾与合并

列支持 `children` 多级表头；`show-footer` + `footer-method` 渲染合计（`footerMethod({ columns, data })` 返回行矩阵，或使用 `#footer` 插槽完全自定义）；`span-method` 合并单元格。

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
- 事件：`sortChange` → `sort-change`；`expandRow` → `expand-change`；`contextmenuRow` → `row-contextmenu`；`selectRow` / `deselectRow` / `selectAll` → `select-row` / `deselect-row` / `select-all`
- 新增事件：`filter-change`（列筛选提交）
- 移除事件：`updatePageItems`、`updateTotalItems`、`page`（保留 `update:page`）
- 行交互：始终同时支持单击 / 双击（`row-click` / `row-dblclick`）；右键始终 `preventDefault` 并抛出 `row-contextmenu`
- 排序 props 合并：`sortField` / `sortOrder` / `multiSort` / `mustSort` / `sortMode` 仍兼容，新代码请使用 `sortConfig: TableSortConfig`
- 筛选 v-model：`v-model:filters` 仍兼容，新代码请使用 `v-model:filter-model`

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
| `virtualDynamicRowHeight` | `boolean` | `false` | 动态行高虚拟滚动（实测行高缓存，配合 `ResizeObserver`）。 |
| `virtualOverscan` | `number` | `4` | 虚拟滚动上下额外渲染的行数，减少白屏闪烁。 |
| `hiddenColumns` | `string[] \| null` | `null` | 隐藏列键（`v-model:hidden-columns`）。 |
| `columnOrder` | `string[] \| null` | `null` | 叶列顺序（`v-model:column-order`）。 |
| `columnSetting` | `boolean` | `false` | 显示列设置按钮（显示/隐藏列）。 |
| `columnDrag` | `boolean` | `false` | 表头拖拽排序。 |
| `skeleton` | `boolean` | `false` | 骨架屏加载态。 |
| `skeletonRows` | `number` | `5` | 骨架屏行数。 |
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
| `sortConfig` | `TableSortConfig \| null` | `null` | 统一排序配置 `{ field, order, multiple, must, mode }`。 |
| `sortField` | `string \| null` | `null` | （兼容）单字段排序。建议用 `sortConfig`。 |
| `sortOrder` | `'asc' \| 'desc' \| null` | `null` | （兼容）单字段排序方向。建议用 `sortConfig`。 |
| `multiSort` | `boolean` | `false` | （兼容）多列排序。建议用 `sortConfig.multiple`。 |
| `mustSort` | `boolean` | `false` | （兼容）禁止取消排序。建议用 `sortConfig.must`。 |
| `sortMode` | `'client' \| 'emit'` | `'client'` | （兼容）排序模式。建议用 `sortConfig.mode`。 |
| `searchField` / `searchValue` | — | — | 客户端搜索。 |
| `filterOptions` | `TableFilterOption[]` | `null` | 结构化筛选条件。 |
| `filterModel` | `Record<string, unknown> \| null` | `null` | 列筛选 v-model（与 `update:filter-model` 配合）。 |
| `filters` | `Record<string, unknown> \| null` | `null` | （兼容）旧筛选 v-model 名。 |
| `loading` | `boolean` | `false` | 加载中。 |
| `emptyText` | `string` | — | 空数据文案。 |
| `emptyDescription` | `string` | — | 空数据补充说明。 |
| `maxHeight` | `number \| null` | `null` | 表格最大高度，超出滚动。 |
| `showOverflowTooltip` | `boolean` | `false` | 全局单元格溢出 Tooltip。 |
| `rowKey` | `string` | `'id'` | 行唯一键字段。 |
| `size` | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 表格密度（`large`/`small` 同步单元格 padding）。 |
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
| `pt` | `TablePassThrough` | — | 多部分 DOM 透传：`{ root, scrollbar, thead, tbody, tfoot, pagination, emptyMessage }`。 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `cell-{key}` | 列 `{key}` 单元格，作用域 `{ row, value, column }`（可自行实现编辑器）。 |
| `footer` | 自定义表尾。 |
| `body-cell` | 任意单元格，作用域 `{ row, column, value }`。 |
| `expansion` | 展开行内容，作用域 `{ row }`。 |
| `empty` | 自定义空态。 |
| `loading` | 自定义加载态（`skeleton` 为 true 时不生效）。 |
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
| `sort-change` | `{ sortField?, sortOrder? }` | 排序变化。 |
| `filter-change` | `Record<string, unknown> \| null` | 列筛选提交（与 `update:filter-model` 同步）。 |
| `expand-change` | `{ row, expanded }` | 行展开状态变化（详情展开或树节点展开）。 |
| `row-click` | `{ row, index }`, `Event` | 行单击。 |
| `row-dblclick` | `{ row, index }`, `Event` | 行双击。 |
| `row-contextmenu` | `item`, `MouseEvent` | 行右键。 |
| `select-row` | `TableItem` | 选中一行。 |
| `deselect-row` | `TableItem` | 取消选中一行。 |
| `select-all` | — | 全选当前页。 |
| `current-change` | `row \| null, oldRow \| null` | 当前高亮行变化。 |
| `update:selection` | `TableItem[]` | 多选 v-model。 |
| `update:page` | `number` | 页码 v-model。 |
| `update:server-options` | `TableServerOptions` | 服务端选项 v-model。 |
| `update:current-row-key` | `string \| number \| null` | 当前行键 v-model。 |
| `update:expanded-row-keys` | `Array<string \| number>` | 树/详情展开键 v-model。 |
| `update:filter-model` | `Record<string, unknown> \| null` | 列筛选 v-model。 |
| `update:column-widths` | `Record<string, number>` | 列宽 v-model。 |
| `update:hidden-columns` | `string[]` | 隐藏列 v-model。 |
| `update:column-order` | `string[]` | 列顺序 v-model。 |
| `update:selected-item` | `TableItem \| null` | 单选 v-model。 |

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
| `setColumnWidths(widths)` | 设置列宽（等同 `v-model:column-widths`）。 |
| `setHiddenColumns(keys)` | 设置隐藏列键（等同 `v-model:hidden-columns`）。 |
| `setColumnOrder(keys)` | 设置叶列顺序（等同 `v-model:column-order`）。 |
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

```ts
type TableItem = Record<string, unknown>
```

<h4 id="TableSortConfig">TableSortConfig</h4>

统一排序配置；`field` / `order` 描述当前单列排序状态，`mode` 决定由表格内部或外部接管排序：

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

多部分 DOM 透传，支持 class / style / 任意 attrs：

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
  resizable?: boolean
  filterable?: boolean
  filters?: TableColumnFilter[]
  children?: TableColumnDefinition[]
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
