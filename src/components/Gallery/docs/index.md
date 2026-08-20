---
title: Gallery
category: 11 / MEDIA
description: 主图 + 缩略图的图片画廊。
---

# Gallery

浏览图片列表并同步 `activeIndex`。

## 引入

```ts
import { WiGallery } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiGallery } from '@well-insight/ui'

const activeIndex = ref(0)
const images = [
  'https://picsum.photos/seed/wd1/640/360',
  'https://picsum.photos/seed/wd2/640/360',
  'https://picsum.photos/seed/wd3/640/360',
]
</script>

<template>
  <WiGallery v-model:active-index="activeIndex" :images="images" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `images` | `string[]` | — | 图片 URL。 |
| `activeIndex` | `number` | `0` | 当前索引。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:activeIndex` | `number` | 索引变化。 |
