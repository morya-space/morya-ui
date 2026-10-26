---
title: Breadcrumb
category: 04 / NAVIGATION
description: 展示当前页面在层级中的位置。
---

# Breadcrumb

面包屑导航。有 `to` 时渲染为链接，否则为文本。

## 引入

```ts
import { MBreadcrumb } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Separator

`separator` 自定义分隔符；也可用 `#separator` 插槽。

```vue preview src="./demos/Separator.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `{ label: string; to?: string; disabled?: boolean }[]` | — | 路径项。 |
| `home` | `{ label?: string; to?: string }` | — | 首页项；默认文案 `Home`。 |
| `separator` | `string` | `'/'` | 分隔符。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots

| 插槽名 | 说明 |
| --- | --- |
| `separator` | 自定义分隔符。 |
| `item` | 自定义 `item` 内容。 |

## Events

无自定义事件。
