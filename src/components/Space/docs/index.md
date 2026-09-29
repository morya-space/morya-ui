---
title: Space
category: 01 / BASIC
description: 在子元素之间自动加入一致间距的布局容器。
---

# Space

在子元素之间自动加入间距。新项目更推荐使用 [`Flex`](/components/Flex/)（直接用 `gap`）。


## 何时使用

- 在子元素之间自动加入一致间距的布局容器。
- 优先组合文档中的 `M*` API；共性约定见 [Common Props](/docs/common-props)。

## 引入

```ts
import { MSpace } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Vertical

```vue preview src="./demos/Vertical.vue"
```

## Size

`size` 支持 token 映射：`small` → `--m-space-2`、`medium` → `--m-space-3`、`large` → `--m-space-4`，也可传数字 / CSS 长度 / `[列, 行]`。

```vue preview src="./demos/Size.vue"
```

未传 `size` 时默认 `medium`。可用 `MConfigProvider` 的 `componentDefaults.Space.size` 改全局间距（与控件 `size` 无关）。

## Compact（按钮紧凑）

相邻按钮拼合请用 [`MButtonGroup`](/components/Button/#button-group)；表单控件 addon 请用各自组件的前缀/后缀能力，不在 `MSpace` 上重复实现。

## Without Item Wrapper

`wrapItem=false` 时不再包一层，子节点直接参与 flex 布局（适合已有自身间距的元素）。

```vue preview src="./demos/WithoutItemWrapper.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | — | 交叉轴对齐。 |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | 主轴对齐。 |
| `inline` | `boolean` | `false` | 是否为 `inline-flex`。 |
| `vertical` | `boolean` | `false` | 纵向排列。 |
| `reverse` | `boolean` | `false` | 主轴反向。 |
| `size` | `'small' \| 'medium' \| 'large' \| number \| string \| [number \| string, number \| string]` | `'medium'` | 间距。数字按 `px`；字符串可为 CSS 长度（如 `8px`、`1rem`、`var(--m-space-4)`）。 |
| `wrap` | `boolean` | `true` | 是否换行。 |
| `wrapItem` | `boolean` | `true` | 是否用容器包裹每个子节点。 |
| `itemClass` / `itemStyle` | — | — | 包裹层 class / style（`wrapItem` 为 true 时生效）。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 间距子项。 |
