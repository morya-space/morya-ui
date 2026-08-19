---
title: Carousel
category: 11 / MEDIA
description: 轮播展示一组内容项。
---

# Carousel

按 `numVisible` 窗口滑动展示内容。

## 引入

```ts
import { WdCarousel } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdCarousel } from '@well-insight/ui'

const value = ['春', '夏', '秋', '冬']
</script>

<template>
  <WdCarousel :value="value" :num-visible="1" circular>
    <template #item="{ item }">
      <div style="padding:2rem;text-align:center;background:var(--wd-color-surface-muted, #f3f4f6);border-radius:var(--wd-radius-md)">
        {{ item }}
      </div>
    </template>
  </WdCarousel>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `unknown[]` | — | 内容列表。 |
| `numVisible` | `number` | `1` | 同时可见项数。 |
| `circular` | `boolean` | `false` | 循环翻页。 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `item` | `{ item, index }` 单项。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:page` | `number` | 页码变化。 |
