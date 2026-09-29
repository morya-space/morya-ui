---
title: Image
category: 03 / DATA
description: 图片展示与点击预览；可用 PreviewGroup 浏览多图。
---

# Image

缩略图点击预览。相册式多图浏览仍可用 [Gallery](/components/Gallery)。


## 何时使用

- 图片展示与点击预览；可用 PreviewGroup 浏览多图。
- 优先组合文档中的 `M*` API；共性约定见 [Common Props](/docs/common-props)。

## 引入

```ts
import { MImage, MImagePreviewGroup } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## 预览组

```vue preview src="./demos/Group.vue"
```

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | — | 图片地址 |
| `alt` | `string` | — | 替代文本 |
| `width` / `height` | `string \| number` | — | 尺寸 |
| `preview` | `boolean` | `true` | 是否可预览 |
| `previewSrc` | `string` | — | 预览大图，默认 `src` |
| `fit` | `ImageFit` | `'cover'` | `object-fit` |
| `pt` | `RootPassThrough` | — | 透传 |

## Events

| 事件 | 说明 |
| --- | --- |
| `click-preview` | 打开预览时 |

## 组件

| 组件 | 说明 |
| --- | --- |
| `MImage` | 单图 |
| `MImagePreviewGroup` | 包裹多个 `MImage`，共享预览层 |
