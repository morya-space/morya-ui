# 文档-实现漂移清单（docs drift report）

> 由 `ai-design-config/scripts/check-docs-drift.mjs` 生成（报告模式，exit code 恒 0）。
> 重新生成：`node ai-design-config/scripts/check-docs-drift.mjs --md`
> 基准日期：2026-09-02；扫描组件 88 个；漂移条目 141 条。

## 类别说明

- **文档有实现无**：`docs/index.md` 声明了 prop / event / slot，但 `types.ts` 与模板中不存在。
- **实现有文档无**：实现存在但文档未记载（仅 public API 层面，`@internal` 标记已忽略）。
- **类型疑似不一致**：同名 prop 的文档类型与实现类型在字面量 / 基础类型层面冲突（保守启发式，需人工确认）。
- **声明未接线（疑似）**：`types.ts` 已声明，但组件源码中检索不到 prop 引用或 `emit()` 调用（启发式，可能因间接使用误报，需人工确认）。

## 汇总

| 组件 | 文档有实现无 | 实现有文档无 | 类型疑似不一致 | 声明未接线(疑似) | 合计 |
| --- | --- | --- | --- | --- | --- |
| [AutoComplete](#autocomplete) | 2 | 0 | 0 | 0 | 2 |
| [Avatar](#avatar) | 0 | 1 | 0 | 0 | 1 |
| [BlockUI](#blockui) | 0 | 1 | 0 | 0 | 1 |
| [CascadeSelect](#cascadeselect) | 2 | 0 | 0 | 0 | 2 |
| [Chip](#chip) | 2 | 0 | 0 | 0 | 2 |
| [ConfigProvider](#configprovider) | 0 | 9 | 0 | 0 | 9 |
| [ConfirmDialog](#confirmdialog) | 0 | 2 | 0 | 0 | 2 |
| [ContextMenu](#contextmenu) | 1 | 0 | 0 | 0 | 1 |
| [DatePicker](#datepicker) | 1 | 0 | 0 | 0 | 1 |
| [Dock](#dock) | 1 | 0 | 0 | 0 | 1 |
| [Form](#form) | 0 | 1 | 0 | 0 | 1 |
| [Gallery](#gallery) | 1 | 0 | 0 | 0 | 1 |
| [Input](#input) | 0 | 1 | 0 | 0 | 1 |
| [InputColor](#inputcolor) | 1 | 0 | 0 | 0 | 1 |
| [InputNumber](#inputnumber) | 2 | 1 | 0 | 0 | 3 |
| [InputPassword](#inputpassword) | 0 | 1 | 0 | 0 | 1 |
| [InputTags](#inputtags) | 1 | 0 | 0 | 0 | 1 |
| [Layout](#layout) | 0 | 8 | 0 | 0 | 8 |
| [Listbox](#listbox) | 1 | 0 | 0 | 0 | 1 |
| [Menubar](#menubar) | 2 | 0 | 0 | 0 | 2 |
| [Message](#message) | 0 | 1 | 0 | 0 | 1 |
| [MeterGroup](#metergroup) | 1 | 0 | 0 | 0 | 1 |
| [ProgressSpinner](#progressspinner) | 0 | 1 | 0 | 0 | 1 |
| [Rating](#rating) | 1 | 0 | 0 | 0 | 1 |
| [ScrollTop](#scrolltop) | 0 | 1 | 0 | 0 | 1 |
| [Scrollbar](#scrollbar) | 0 | 18 | 0 | 0 | 18 |
| [Select](#select) | 2 | 1 | 0 | 0 | 3 |
| [Sidebar](#sidebar) | 1 | 0 | 0 | 0 | 1 |
| [Slider](#slider) | 0 | 1 | 0 | 0 | 1 |
| [SpeedDial](#speeddial) | 2 | 1 | 0 | 0 | 3 |
| [SplitButton](#splitbutton) | 1 | 0 | 0 | 0 | 1 |
| [Stepper](#stepper) | 1 | 1 | 0 | 0 | 2 |
| [Table](#table) | 0 | 53 | 0 | 3 | 56 |
| [Textarea](#textarea) | 0 | 1 | 0 | 0 | 1 |
| [Toast](#toast) | 0 | 1 | 0 | 0 | 1 |
| [ToggleButton](#togglebutton) | 1 | 0 | 0 | 0 | 1 |
| [Tree](#tree) | 1 | 2 | 0 | 0 | 3 |
| [TreeSelect](#treeselect) | 2 | 0 | 0 | 0 | 2 |
| [TreeTable](#treetable) | 1 | 0 | 0 | 0 | 1 |
| **合计** | **31** | **107** | **0** | **3** | **141** |

## AutoComplete

### 文档有实现无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `item` | slot | docs/index.md:103 | — | 模板中无对应 <slot> 或 slots 引用 |
| `empty` | slot | docs/index.md:104 | — | 模板中无对应 <slot> 或 slots 引用 |

## Avatar

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `max` | prop | — | types.ts:26 | 文档 Props 表未记载 |

## BlockUI

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | — | BlockUI.vue:18 | 文档 Slots 表未记载 |

## CascadeSelect

### 文档有实现无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | slot | docs/index.md:99 | — | 模板中无对应 <slot> 或 slots 引用 |
| `option` | slot | docs/index.md:100 | — | 模板中无对应 <slot> 或 slots 引用 |

## Chip

### 文档有实现无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | docs/index.md:57 | — | 模板中无对应 <slot> 或 slots 引用 |
| `icon` | slot | docs/index.md:58 | — | 模板中无对应 <slot> 或 slots 引用 |

## ConfigProvider

### 实现有文档无（9）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `config` | prop | — | ConfigProvider.vue:14 | 文档无 Props 章节 |
| `appendTo` | prop | — | ConfigProvider.vue:16 | 文档无 Props 章节 |
| `size` | prop | — | ConfigProvider.vue:18 | 文档无 Props 章节 |
| `inputVariant` | prop | — | ConfigProvider.vue:20 | 文档无 Props 章节 |
| `zIndex` | prop | — | ConfigProvider.vue:22 | 文档无 Props 章节 |
| `density` | prop | — | ConfigProvider.vue:24 | 文档无 Props 章节 |
| `locale` | prop | — | ConfigProvider.vue:26 | 文档无 Props 章节 |
| `componentDefaults` | prop | — | ConfigProvider.vue:28 | 文档无 Props 章节 |
| `globalDensity` | prop | — | ConfigProvider.vue:34 | 文档无 Props 章节 |

## ConfirmDialog

### 实现有文档无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `header` | slot | — | ConfirmDialog.vue:126 | 文档 Slots 表未记载 |
| `footer` | slot | — | ConfirmDialog.vue:139 | 文档 Slots 表未记载 |

## ContextMenu

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | docs/index.md:110 | — | 模板中无对应 <slot> 或 slots 引用 |

## DatePicker

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `trigger` | slot | docs/index.md:201 | — | 模板中无对应 <slot> 或 slots 引用 |

## Dock

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | docs/index.md:50 | — | 模板中无对应 <slot> 或 slots 引用 |

## Form

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `for` | prop | — | types.ts:71 | 文档 Props 表未记载 |

## Gallery

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `item` | slot | docs/index.md:54 | — | 模板中无对应 <slot> 或 slots 引用 |

## Input

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `errorMessage` | prop | — | types.ts:10 | 文档 Props 表未记载 |

## InputColor

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `trigger` | slot | docs/index.md:68 | — | 模板中无对应 <slot> 或 slots 引用 |

## InputNumber

### 文档有实现无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `prefix` | slot | docs/index.md:92 | — | 模板中无对应 <slot> 或 slots 引用 |
| `suffix` | slot | docs/index.md:93 | — | 模板中无对应 <slot> 或 slots 引用 |

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | prop | — | types.ts:21 | 文档 Props 表未记载 |

## InputPassword

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | prop | — | types.ts:33 | 文档 Props 表未记载 |

## InputTags

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `tag` | slot | docs/index.md:70 | — | 模板中无对应 <slot> 或 slots 引用 |

## Layout

### 实现有文档无（8）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `height` | prop | — | types.ts:11 | 文档 Props 表未记载 |
| `padding` | prop | — | types.ts:31 | 文档 Props 表未记载 |
| `radius` | prop | — | types.ts:32 | 文档 Props 表未记载 |
| `update:collapsed` | event | — | types.ts:91 | 文档 Events 表未记载 |
| `collapse` | event | — | types.ts:92 | 文档 Events 表未记载 |
| `expand` | event | — | types.ts:93 | 文档 Events 表未记载 |
| `after-enter` | event | — | types.ts:94 | 文档 Events 表未记载 |
| `after-leave` | event | — | types.ts:95 | 文档 Events 表未记载 |

## Listbox

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `option` | slot | docs/index.md:58 | — | 模板中无对应 <slot> 或 slots 引用 |

## Menubar

### 文档有实现无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `start` | slot | docs/index.md:61 | — | 模板中无对应 <slot> 或 slots 引用 |
| `end` | slot | docs/index.md:62 | — | 模板中无对应 <slot> 或 slots 引用 |

## Message

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `auto` | prop | — | types.ts:49 | 文档 Props 表未记载 |

## MeterGroup

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | slot | docs/index.md:50 | — | 模板中无对应 <slot> 或 slots 引用 |

## ProgressSpinner

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | — | ProgressSpinner.vue:65 | 文档 Slots 表未记载 |

## Rating

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `icon` | slot | docs/index.md:83 | — | 模板中无对应 <slot> 或 slots 引用 |

## ScrollTop

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | — | ScrollTop.vue:106 | 文档 Slots 表未记载 |

## Scrollbar

### 实现有文档无（18）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `height` | prop | — | types.ts:20 | 文档 Props 表未记载 |
| `maxHeight` | prop | — | types.ts:22 | 文档 Props 表未记载 |
| `native` | prop | — | types.ts:24 | 文档 Props 表未记载 |
| `wrapStyle` | prop | — | types.ts:26 | 文档 Props 表未记载 |
| `wrapClass` | prop | — | types.ts:28 | 文档 Props 表未记载 |
| `viewStyle` | prop | — | types.ts:30 | 文档 Props 表未记载 |
| `viewClass` | prop | — | types.ts:32 | 文档 Props 表未记载 |
| `noresize` | prop | — | types.ts:34 | 文档 Props 表未记载 |
| `tag` | prop | — | types.ts:36 | 文档 Props 表未记载 |
| `always` | prop | — | types.ts:38 | 文档 Props 表未记载 |
| `trigger` | prop | — | types.ts:40 | 文档 Props 表未记载 |
| `minSize` | prop | — | types.ts:42 | 文档 Props 表未记载 |
| `tabindex` | prop | — | types.ts:44 | 文档 Props 表未记载 |
| `id` | prop | — | types.ts:46 | 文档 Props 表未记载 |
| `role` | prop | — | types.ts:48 | 文档 Props 表未记载 |
| `ariaLabel` | prop | — | types.ts:50 | 文档 Props 表未记载 |
| `ariaOrientation` | prop | — | types.ts:52 | 文档 Props 表未记载 |
| `distance` | prop | — | types.ts:54 | 文档 Props 表未记载 |

## Select

### 文档有实现无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | slot | docs/index.md:325 | — | 模板中无对应 <slot> 或 slots 引用 |
| `option` | slot | docs/index.md:326 | — | 模板中无对应 <slot> 或 slots 引用 |

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `errorMessage` | prop | — | types.ts:22 | 文档 Props 表未记载 |

## Sidebar

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | docs/index.md:59 | — | 模板中无对应 <slot> 或 slots 引用 |

## Slider

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `ariaLabel` | prop | — | types.ts:17 | 文档 Props 表未记载 |

## SpeedDial

### 文档有实现无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `button` | slot | docs/index.md:61 | — | 模板中无对应 <slot> 或 slots 引用 |
| `item` | slot | docs/index.md:62 | — | 模板中无对应 <slot> 或 slots 引用 |

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `icon` | slot | — | SpeedDial.vue:130 | 文档 Slots 表未记载 |

## SplitButton

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | docs/index.md:57 | — | 模板中无对应 <slot> 或 slots 引用 |

## Stepper

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `icon` | slot | docs/index.md:79 | — | 模板中无对应 <slot> 或 slots 引用 |

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | — | Stepper.vue:68 | 文档 Slots 表未记载 |

## Table

### 实现有文档无（53）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `multiSort` | prop | — | types.ts:79 | 文档 Props 表未记载 |
| `mustSort` | prop | — | types.ts:80 | 文档 Props 表未记载 |
| `filters` | prop | — | types.ts:82 | 文档 Props 表未记载 |
| `rowsItems` | prop | — | types.ts:86 | 文档 Props 表未记载 |
| `currentRowKey` | prop | — | types.ts:96 | 文档 Props 表未记载 |
| `showHeader` | prop | — | types.ts:99 | 文档 Props 表未记载 |
| `fixedHeader` | prop | — | types.ts:101 | 文档 Props 表未记载 |
| `tableHeight` | prop | — | types.ts:102 | 文档 Props 表未记载 |
| `tableMinHeight` | prop | — | types.ts:103 | 文档 Props 表未记载 |
| `showIndex` | prop | — | types.ts:104 | 文档 Props 表未记载 |
| `showIndexSymbol` | prop | — | types.ts:105 | 文档 Props 表未记载 |
| `indexColumnWidth` | prop | — | types.ts:106 | 文档 Props 表未记载 |
| `fixedCheckbox` | prop | — | types.ts:107 | 文档 Props 表未记载 |
| `fixedExpand` | prop | — | types.ts:108 | 文档 Props 表未记载 |
| `fixedIndex` | prop | — | types.ts:109 | 文档 Props 表未记载 |
| `expandColumnWidth` | prop | — | types.ts:110 | 文档 Props 表未记载 |
| `checkboxColumnWidth` | prop | — | types.ts:111 | 文档 Props 表未记载 |
| `hideHeader` | prop | — | types.ts:112 | 文档 Props 表未记载 |
| `hideRowsPerPage` | prop | — | types.ts:113 | 文档 Props 表未记载 |
| `buttonsPagination` | prop | — | types.ts:114 | 文档 Props 表未记载 |
| `expandedRowKeys` | prop | — | types.ts:116 | 文档 Props 表未记载 |
| `clickRowToExpand` | prop | — | types.ts:117 | 文档 Props 表未记载 |
| `clickEventType` | prop | — | types.ts:118 | 文档 Props 表未记载 |
| `headerTextDirection` | prop | — | types.ts:119 | 文档 Props 表未记载 |
| `bodyTextDirection` | prop | — | types.ts:120 | 文档 Props 表未记载 |
| `headerItemClassName` | prop | — | types.ts:121 | 文档 Props 表未记载 |
| `bodyRowClassName` | prop | — | types.ts:122 | 文档 Props 表未记载 |
| `bodyExpandRowClassName` | prop | — | types.ts:123 | 文档 Props 表未记载 |
| `bodyItemClassName` | prop | — | types.ts:124 | 文档 Props 表未记载 |
| `tableClassName` | prop | — | types.ts:125 | 文档 Props 表未记载 |
| `headerClassName` | prop | — | types.ts:126 | 文档 Props 表未记载 |
| `rowsPerPageMessage` | prop | — | types.ts:127 | 文档 Props 表未记载 |
| `rowsOfPageSeparatorMessage` | prop | — | types.ts:128 | 文档 Props 表未记载 |
| `preventContextMenuRow` | prop | — | types.ts:129 | 文档 Props 表未记载 |
| `tableNodeId` | prop | — | types.ts:130 | 文档 Props 表未记载 |
| `ariaLabel` | prop | — | types.ts:132 | 文档 Props 表未记载 |
| `contextmenuRow` | event | — | types.ts:138 | 文档 Events 表未记载 |
| `selectRow` | event | — | types.ts:139 | 文档 Events 表未记载 |
| `deselectRow` | event | — | types.ts:140 | 文档 Events 表未记载 |
| `filter` | event | — | types.ts:143 | 文档 Events 表未记载 |
| `update:selectedItem` | event | — | types.ts:145 | 文档 Events 表未记载 |
| `updatePageItems` | event | — | types.ts:147 | 文档 Events 表未记载 |
| `updateTotalItems` | event | — | types.ts:148 | 文档 Events 表未记载 |
| `selectAll` | event | — | types.ts:149 | 文档 Events 表未记载 |
| `update:expandedRowKeys` | event | — | types.ts:154 | 文档 Events 表未记载 |
| `update:filters` | event | — | types.ts:155 | 文档 Events 表未记载 |
| `customize-headers` | slot | — | Table.vue:606 | 文档 Slots 表未记载 |
| `header-*` | slot | — | Table.vue:641 | 文档 Slots 表未记载 |
| `header` | slot | — | Table.vue:643 | 文档 Slots 表未记载 |
| `body` | slot | — | Table.vue:656 | 文档 Slots 表未记载 |
| `body-prepend` | slot | — | Table.vue:661 | 文档 Slots 表未记载 |
| `body-append` | slot | — | Table.vue:780 | 文档 Slots 表未记载 |
| `buttonsPagination` | slot | — | TablePaginationArrows.vue:55 | 文档 Slots 表未记载 |

### 声明未接线(疑似)（3）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `filter` | event | — | types.ts:143 | types.ts 已声明，但未检索到 emit() 调用（疑似未接线，需人工确认） |
| `update:expandedRowKeys` | event | — | types.ts:154 | types.ts 已声明，但未检索到 emit() 调用（疑似未接线，需人工确认） |
| `update:filters` | event | — | types.ts:155 | types.ts 已声明，但未检索到 emit() 调用（疑似未接线，需人工确认） |

## Textarea

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `errorMessage` | prop | — | types.ts:13 | 文档 Props 表未记载 |

## Toast

### 实现有文档无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `auto` | prop | — | types.ts:45 | 文档 Props 表未记载 |

## ToggleButton

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `default` | slot | docs/index.md:73 | — | 模板中无对应 <slot> 或 slots 引用 |

## Tree

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `node-select` | event | docs/index.md:168 | — | types.ts / 模板均未声明或抛出该事件 |

### 实现有文档无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `update:selectionKeys` | event | — | types.ts:38 | 文档 Events 表未记载 |
| `update:modelValue` | event | — | types.ts:39 | 文档 Events 表未记载 |

## TreeSelect

### 文档有实现无（2）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | slot | docs/index.md:132 | — | 模板中无对应 <slot> 或 slots 引用 |
| `option` | slot | docs/index.md:133 | — | 模板中无对应 <slot> 或 slots 引用 |

## TreeTable

### 文档有实现无（1）

| 名称 | 类别 | 文档位置 | 实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| `expansion` | slot | docs/index.md:62 | — | 模板中无对应 <slot> 或 slots 引用 |

---

## 附：人工抽查记录（Select / Tree / Dock）

> 抽查日期 2026-09-02；逐条人工对照 `docs/index.md` 与 `types.ts` / 组件模板源码。三个组件的清单条目全部与源码一致。

### Select（3 条，全部属实）

- `value` / `option` 插槽「文档有实现无」：`docs/index.md:325-326` Slots 表声明，但 `Select.vue`（及子组件 `WiSelectOption.ts`）无任何 `<slot>` / `useSlots` 引用，确为幽灵插槽（对应审计 P1-2）。✓
- `errorMessage` prop「实现有文档无」：`types.ts:22` `SelectProps.errorMessage` 存在，docs Props 表（:35-50，共 17 行）未记载。✓
- 反向核对：其余 17 个 props、4 个事件（`update:modelValue` / `change` / `show` / `hide`）在 docs 与 `SelectProps` / `SelectEmits` 间一一对应，无漏报。✓

### Tree（3 条，全部属实）

- `node-select` 事件「文档有实现无」：仅出现在文档（`index.md`、`index.en.md`），`TreeEmits`（types.ts:37-46）未声明，组件全目录检索不到 `emit('node-select')`，确为幽灵事件（对应审计 T1.4）。✓
- `update:selectionKeys` / `update:modelValue` 事件「实现有文档无」：`types.ts:38-39` 已声明且 `Tree.vue:196-203` 实际抛出，docs Events 表未记载。✓
- `default` 插槽未误报：`Tree.vue` 经 `useSlots()` + `slots.default?.()` 程序化渲染，正确判定为已实现。✓
- 反向核对：14 个 props 两侧完全一致，无漏报。✓

### Dock（1 条，属实）

- `default` 插槽「文档有实现无」：`docs/index.md:50` 声明，但 `Dock.vue` 与 `DockItem.vue` 均检索不到 `<slot>` / `useSlots`（对应审计 P1-2）。✓
- 反向核对：8 个 props 两侧一致；实现无 `DockEmits`，docs「无自定义事件」表述与之一致，无漏报。✓

### 启发式的已知边界（供后续修复任务参考）

- 「声明未接线」基于组件目录全文本检索，间接引用会导致漏报：如 Table `sortMode` 因 `<TableColumn>` 模板中仍有字面引用而未被捕获，实际为死 prop（T1.8 需人工下线）。
- Table 的 3 条「声明未接线」事件（`filter` / `update:expandedRowKeys` / `update:filters`）与审计 T1.10「filters 未实现、expandedRowKeys 声明未接线」完全吻合。
- 本清单为生成时刻的快照；组件源码或文档后续改动后，重新运行 `node ai-design-config/scripts/check-docs-drift.mjs --md` 即可刷新。

