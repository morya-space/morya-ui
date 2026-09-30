---
title: Grid
category: 06 / LAYOUT
description: 基于 CSS Grid 的响应式栅格，配合 GridItem 控制跨列。
---

# Grid

本页含两套布局：

- **CSS Grid（`MGrid` / `MGridItem`）**：24 列栅格（可用 `cols` 调整），支持容器响应式与折叠。子项请使用 `MGridItem`（别名 `MGi`）。
- **Flex 24 栅格（`MRow` / `MCol`）**：支持 `gutter` / `span` / `offset` / `push` / `pull` / `order` / `flex` 与六档断点。

两套可混用，但同一层级内建议只选一套。


## 何时使用

- 基于 CSS Grid 的响应式栅格，配合 GridItem 控制跨列。

## 引入

```ts
import { MGrid, MGridItem, MRow, MCol } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Span & Offset

```vue preview src="./demos/SpanAndOffset.vue"
```

## Responsive

`cols` / `xGap` / `yGap` 与 `MGridItem` 的 `span` / `offset` 均支持响应式字符串，例如 `1 s:2 m:3`（断点：`xs` `s` `m` `l` `xl` `2xl`）。

当 `cols` / 间距是普通数字、但 item 仍要用响应式 `span` 时，请打开 `itemResponsive`。

```vue preview src="./demos/Responsive.vue"
```

## Collapsed

```vue preview src="./demos/Collapsed.zh.vue"
```

## Grid Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `cols` | `number \| string` | `24` | 列数，支持 `"1 s:2 m:3"` 响应式写法。 |
| `xGap` / `yGap` | `number \| string` | `0` | 列 / 行间距（px），同样支持响应式字符串。 |
| `responsive` | `'self' \| 'screen'` | `'self'` | 响应式依据容器宽度或视口宽度。 |
| `itemResponsive` | `boolean` | `false` | 强制按宽度解析 item 的 `span` / `offset`（即使 `cols` 为数字）。 |
| `collapsed` | `boolean` | `false` | 折叠超出行数的项。 |
| `collapsedRows` | `number` | `1` | 折叠时可见行数。 |
| `layoutShiftDisabled` | `boolean` | `false` | 关闭折叠/布局计算，退化为纯 CSS Grid。 |
| `itemStyle` | `string \| object` | — | 应用到每个 GridItem 的样式。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |

## GridItem Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `span` | `number \| string` | `1` | 跨列数。 |
| `offset` | `number \| string` | `0` | 左侧偏移列数。 |
| `suffix` | `boolean` | `false` | 折叠时固定在末尾（常用于「展开」）。 |

## GridItem Slots

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `{ overflow }` | 内容；`overflow` 表示是否有被折叠隐藏的项。 |

## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 栅格子项。 |

## Flex 24 栅格（MRow / MCol）

```vue
<MRow :gutter="[16, 24]" justify="space-between" align="middle">
  <MCol :xs="24" :md="12">左侧</MCol>
  <MCol :xs="24" :md="12" :offset="6">右侧</MCol>
</MRow>
```

断点：`xs` `<576`、`sm` `≥576`、`md` `≥768`、`lg` `≥992`、`xl` `≥1200`、`xxl` `≥1600`。响应式值按**从小到大**合并，命中的最大断点生效。

> 响应式由共享的 `matchMedia` 订阅驱动（全局仅一套监听），因此列宽随视口变化即时更新，无需为每个组合生成 CSS 类。

### Row Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `gutter` | `number \| [number, number] \| 断点对象 \| 断点对象数组` | `0` | 列间距；数组形式为 `[水平, 垂直]`，对象形式如 `{ xs: 8, md: 16 }` |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | 主轴分布 |
| `align` | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | `'top'` | 交叉轴对齐 |
| `wrap` | `boolean` | `true` | 是否换行 |
| `component` | `string` | `'div'` | 根标签 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传 |

### Col Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `span` | `number` | `24` | 占 24 栅格中的列数 |
| `offset` | `number` | `0` | 左侧偏移列数 |
| `push` | `number` | `0` | 向右位移列数（不影响兄弟元素） |
| `pull` | `number` | `0` | 向左位移列数（不影响兄弟元素） |
| `order` | `number` | — | flex 排序 |
| `flex` | `number \| string` | — | `flex` 值；设置后优先于 `span` |
| `xs` / `sm` / `md` / `lg` / `xl` / `xxl` | `number \| ColResponsiveConfig` | — | 断点覆盖：数字等价于 `span`，对象可写 `{ span, offset, push, pull, order }` |
| `component` | `string` | `'div'` | 根标签 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传 |

### 辅助导出

| 导出 | 说明 |
| --- | --- |
| `GRID_BREAKPOINTS` / `GRID_BREAKPOINT_ORDER` | 断点像素值与升序列表 |
| `useGridBreakpoint()` | 响应式返回当前命中的断点数组 |
| `mergeColResponsive()` / `resolveGutter()` / `resolveGutterValue()` | 纯函数，便于测试与自定义布局 |
