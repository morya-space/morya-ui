---
title: PickList
category: 03 / DATA
description: 双列表穿梭选择。
---

# PickList

在 source 与 target 列表间移动条目。

## 何时使用

- 需要左右双列表穿梭、把候选项移入已选列表时。
- API 使用 morya 的 `source` / `target`，不要按 antd Transfer 的 props 迁移。

## 引入

```ts
import { MPickList } from "morya-ui";
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## 自定义条目

```vue preview src="./demos/CustomItems.zh.vue"
```

## Props

| 参数           | 类型                                                       | 默认值   | 说明                                      |
| -------------- | ---------------------------------------------------------- | -------- | ----------------------------------------- |
| `source`       | `unknown[]`                                                | `[]`     | 左侧列表。                                |
| `target`       | `unknown[]`                                                | `[]`     | 右侧列表。                                |
| `sourceHeader` | `string`                                                   | `'可选'` | 左侧标题。                                |
| `targetHeader` | `string`                                                   | `'已选'` | 右侧标题。                                |
| `dataKey`      | `string`                                                   | —        | 对象唯一键。                              |
| `emptyMessage` | `string`                                                   | —        | —                                         |
| `pt`           | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | —        | DOM 透传，见 [样式与 attrs](/docs/attrs). |

## Events

| 事件名          | 参数        | 说明           |
| --------------- | ----------- | -------------- |
| `update:source` | `unknown[]` | 源列表变化。   |
| `update:target` | `unknown[]` | 目标列表变化。 |

## Slots

| 插槽    | 参数                  | 说明               |
| ------- | --------------------- | ------------------ |
| `item`  | `{ item, index }`     | 自定义列表项内容。 |
| `empty` | 自定义 `empty` 内容。 |

## 与 ant-design

对应 antd `Transfer` 的双列表选值角色；数据结构与 props 仍用 morya（`source` / `target`），不复制 Transfer API。详见 [antd 映射](/docs/antd-mapping)。
