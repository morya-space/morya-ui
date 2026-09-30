---
title: Gallery
category: 03 / DATA
description: 主图 + 缩略图的图片画廊。
---

# Gallery

浏览图片列表并同步 `activeIndex`。

## 引入

```ts
import { MGallery } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `images` | `string[]` | — | 图片 URL。 |
| `activeIndex` | `number` | `0` | 当前索引。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:activeIndex` | `number` | 索引变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `item` | 媒体项 `{ item, index }`。 |
