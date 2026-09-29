---
title: Descriptions
category: 03 / DATA
description: 详情字段列表，支持多列、边框与横/纵向布局。
---

# Descriptions

用于详情页、抽屉只读信息等「标签 + 内容」展示。


## 何时使用

- 详情字段列表，支持多列、边框与横/纵向布局。
- 优先组合文档中的 `M*` API；共性约定见 [Common Props](/docs/common-props)。

## 引入

```ts
import { MDescriptions, MDescriptionsItem } from 'morya-ui'
```

## 基础用法

`column` 控制每行列数；`MDescriptionsItem` 的 `span` 可跨列。

```vue preview src="./demos/Basic.vue"
```

## 边框与纵向

`bordered` 画单元格边框；`layout="vertical"` 让标签在上、内容在下。

```vue preview src="./demos/Bordered.vue"
```

## Props — Descriptions

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题 |
| `bordered` | `boolean` | `false` | 边框 |
| `column` | `number` | `3` | 每行列数 |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 标签布局 |
| `size` | `DescriptionsSize` | — | 密度 |
| `colon` | `boolean` | `true` | 标签后冒号 |
| `pt` | `RootPassThrough` | — | 透传 |

## Props — DescriptionsItem

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 标签 |
| `span` | `number` | `1` | 跨列数 |

## Slots

| 插槽 | 组件 | 说明 |
| --- | --- | --- |
| `default` | Descriptions | Item 列表 |
| `title` / `extra` | Descriptions | 标题区 / 右侧操作 |
| `default` / `label` | Item | 内容 / 标签 |
