---
title: Page
category: 06 / LAYOUT
description: 业务页面组合区块，封装间距、边框与标题层级，少写或不写页面 CSS。
---

# Page

业务页面组合组件。与 `MLayout` 搭配使用，把列表页筛选区、工具栏、表单分组、KPI 卡片等常见区块的间距和边框内聚到组件内，**优先用 Page 组件拼装页面，而不是每页手写 scoped CSS**。

## 引入

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

## 列表页组合

`MPageContent` 负责内容区 **padding**（默认 `--m-space-6`）与子区块 **gap**（默认 `--m-space-4`），文档预览中外框仅模拟 `MLayoutContent` 边界。

**列表高度（按需）**：仅当这是 `MLayout fillViewport` 下的**后台主列表**、表格是页面主任务时，再用 `MPageContent fill` + `MTable fill paginator`（表体滚动、分页贴底）。嵌入表、短页、整页文档滚动不要硬套 `fill`。

`MPageFilters` 默认是 **无框的控件行**（`variant="plain"`）；需要一条可辨识的工具带时再用 `variant="filled"`（与 Table header 相同的 `--m-color-fill-light`，无圆角）。`MPageHeader` 是页面身份（约 `--m-font-size-xl`）；`MPageToolbar` 是列表操作条（`--m-font-size-md`），不要当成第二页头。

```vue preview src="./demos/ListPageStack.zh.vue"
```

字段较多时：`MPageFilters collapsible` + `#advanced` 折叠高级项；已选条件用 `MPageFilterChips` 包一层 `MTag closable`（不要用自定义 dashed 壳）。

```vue preview src="./demos/ListFiltersAdvanced.zh.vue"
```

**面包屑**：路由级 trail 放在 `MLayoutHeader` 的 `MBreadcrumb`；若页内还需要上下文，用 `MPageHeader` 的 `#breadcrumb` 插槽——**不要**在 Layout 与 Page 各写一遍相同标题链。

## 表单页组合

`MPageContent width="narrow"` 限制表单宽度；`MPageSection variant="form"` 提供表单表面；`variant="actions"` 用于底栏操作。

```vue preview src="./demos/Demo2.vue"
```

## 仪表盘 KPI

默认 `MPageStat` 为 Card 表面；密集条带可用 `layout="plain"` + `orientation="inline"` + `density="compact"`。

```vue preview src="./demos/Kpi.vue"
```

```vue preview src="./demos/StatVariants.zh.vue"
```

## 组合规则

| 场景 | 推荐组件 | 避免 |
| --- | --- | --- |
| 内容区垂直堆叠 | `MPageContent` | 手写 `gap` / `padding` |
| 筛选区 | `MPageFilters` + `MSpace` / `MFlex` | 额外包一层 `MCard` |
| 页面身份 + 页级操作 | `MPageHeader` | 无层级的裸 `h1` |
| 列表操作条 | `MPageToolbar` | 把 Toolbar 当成第二页头 |
| 表单主体 | `MPageSection variant="form"`（内部即 `MCard` 表面） | 再包一层 `MCard` |
| 列表表格 | 直接放 `MTable` | `MCard` 再包 `MTable bordered` |
| KPI | `MPageStat` | 每页自定义 stat CSS |
| 图表占位 | `MPagePlaceholder` 或 `MCard` + `MEmpty` | 虚线框 / 光晕手写样式 |

完整黄金样例用 MCP `get_golden_page`。**局部修改**时用 MCP `get_page_snippet`（如 `filters`、`toolbar`、`form-actions`）。

## API

### MPageContent

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `density` | `'default' \| 'compact' \| 'spacious'` | `'default'` | 子区块垂直间距。 |
| `width` | `'full' \| 'narrow'` | `'full'` | `narrow` 约 42rem，适合表单页。 |
| `bands` | `'auto' \| 'uniform'` | `'auto'` | `auto` 收紧 Header/筛选/Toolbar 与表格之间的 band；`uniform` 仅用 `gap`。 |
| `fill` | `boolean` | `false` | 撑满 `MLayoutContent` 剩余高度；仅全视口主列表与 `MTable fill` 联用。 |

`bands="auto"` 时可通过 CSS 变量微调：`--m-page-content-body-lead`、`--m-page-content-tools-pull`（见 `styles.css`）。

### MPageFilters

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | 筛选区无障碍名称。 |
| `variant` | `'plain' \| 'filled'` | `'plain'` | 表面处理；`filled` 与 Table header 同色浅底，无圆角。 |
| `collapsible` | `boolean` | `false` | 为 true 且提供 `#advanced` 时显示展开/收起。 |
| `expanded` | `boolean` | `false` | 高级区展开状态（`v-model:expanded`）。 |
| `expandLabel` / `collapseLabel` | `string` | — | 覆盖默认展开/收起文案。 |

| Slot | 说明 |
| --- | --- |
| `default` | 常用筛选控件行。 |
| `advanced` | 折叠区（需 `collapsible`）。 |
| `active` | 可选；已选摘要（更常见是下方 `MPageFilterChips`）。 |

### MPageFilterChips

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 弱前缀，如「已选」。 |
| `ariaLabel` | `string` | — | 已选条件列表的无障碍名称。 |

默认插槽放 `MTag closable` 或同类可移除标记。

### MPageToolbar

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 操作条组名（`--m-font-size-md`），不是页面标题。 |
| `headingLevel` | `1–6` | `1` | 标题层级。 |

| Slot | 说明 |
| --- | --- |
| `default` | 无 `title` 时的左侧内容。 |
| `actions` | 右侧操作区。 |

### MPageHeader

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 页面标题（`--m-font-size-xl`）。 |
| `description` | `string` | — | 副标题/说明。 |
| `headingLevel` | `1–6` | `1` | 标题层级。 |

| Slot | 说明 |
| --- | --- |
| `breadcrumb` | 标题上方的面包屑（放 `MBreadcrumb`）。 |
| `tags` | 标题右侧的状态/分类标记（放 `MTag` / `MStatus`）。 |
| `actions` | 右侧操作。 |

### MPageSection

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'muted' \| 'form' \| 'actions'` | `'default'` | 视觉变体；`muted` 与 Table header 同色浅底；`form` 渲染为 `MCard` 表面。 |
| `title` | `string` | — | 可选分组标题。 |

| Slot | 说明 |
| --- | --- |
| `actions` | 标题行右侧操作区。 |

### MPageStat

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 指标名称。 |
| `value` | `string \| number` | — | 主数值（等宽数字）。 |
| `trend` | `string` | — | 变化量，渲染为与 `MStatus` 同色的文本。 |
| `trendSeverity` | `'primary' \| 'success' \| 'warn' \| 'danger' \| 'secondary'` | `'primary'` | 趋势色。 |
| `trendDirection` | `'up' \| 'down'` | — | 在趋势旁显示升/降箭头。 |
| `trendLabel` | `string` | — | 趋势后的弱说明，如「较上月」。 |
| `icon` | `string` | — | 右侧弱化图标名。 |
| `loading` | `boolean` | `false` | 用骨架屏代替数值与趋势。 |
| `shadow` | `'never' \| 'hover' \| 'always'` | `'always'` | 透传 `MCard.shadow`（`layout="plain"` 时无效）。 |
| `layout` | `'card' \| 'plain'` | `'card'` | `plain` 无 Card 壳，适合横排 KPI 条。 |
| `density` | `'default' \| 'compact'` | `'default'` | `compact` 缩小主数值字号。 |
| `orientation` | `'stacked' \| 'inline'` | `'stacked'` | `inline` 标签与数值同一行。 |

### MPagePlaceholder

内部组合 `MEmpty`：默认展示空态插画与说明，可通过默认插槽自定义内容、`#icon` 自定义图标、`#extra` 放置下一步操作。

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `description` | `string` | — | 占位说明。 |
| `ariaLabel` | `string` | `'Placeholder'` | 无障碍标签。 |
| `minHeight` | `number \| string` | `'12rem'` | 最小高度。 |

| Slot | 说明 |
| --- | --- |
| `default` | 自定义说明内容。 |
| `icon` | 自定义图标/插画。 |
| `extra` | 下一步操作区（如按钮）。 |
