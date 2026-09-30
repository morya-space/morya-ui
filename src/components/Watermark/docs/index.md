---
title: Watermark
category: 07 / OTHER
description: Canvas 平铺水印，包裹业务内容。
---

# Watermark

在子元素上方叠加 repeating 水印。颜色与透明度走 `--m-*` 解析后的 canvas 绘制。

## 引入

```ts
import { MWatermark } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `content` | `string \| string[]` | — | 文本水印 |
| `image` | `string` | — | 图片 URL |
| `width` / `height` | `number` | `120` / `64` | 单块尺寸 |
| `rotate` | `number` | `-22` | 旋转角度 |
| `gap` | `[number, number]` | `[100, 100]` | 平铺间距 |
| `offset` | `[number, number]` | 居中于 gap | 起始偏移 |
| `font` | `WatermarkFont` | — | 字体样式 |
| `zIndex` | `number` | `9` | 层级 |
| `inherit` | `boolean` | `true` | 预留：子树继承（样式标记） |
| `pt` | `RootPassThrough` | — | 根透传 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 被水印覆盖的内容。 |

## 防篡改（轻量）

若水印 DOM 被移除，组件会通过 `MutationObserver` 重新绘制 overlay（非安全边界，仅防误删）。

