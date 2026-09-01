---
title: Carousel
category: 11 / MEDIA
description: 轮播展示一组内容项。
---

# Carousel

按 `numVisible` 窗口滑动展示内容。

## 引入

```ts
import { WiCarousel } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiCarousel } from '@well-insight/ui'

const value = ['春', '夏', '秋', '冬']
</script>

<template>
  <WiCarousel :value="value" :num-visible="1" circular>
    <template #item="{ item }">
      <div style="padding:2rem;text-align:center;background:var(--wi-color-surface-muted, #f3f4f6);border-radius:var(--wi-radius-md)">
        {{ item }}
      </div>
    </template>
  </WiCarousel>
</template>
```

## Autoplay

`autoplay` 按 `interval`（默认 3000ms）自动翻页。`show-arrows` / `show-indicators` 控制箭头与指示点。

```vue preview
<script setup lang="ts">
import { WiCarousel } from '@well-insight/ui'

const value = ['A', 'B', 'C']
</script>

<template>
  <WiCarousel :value="value" autoplay :interval="4000" :show-arrows="false">
    <template #item="{ item }">
      <div style="padding:1.5rem;text-align:center;background:var(--wi-color-surface-muted, #f3f4f6);border-radius:var(--wi-radius-md)">
        {{ item }}
      </div>
    </template>
  </WiCarousel>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `unknown[]` | — | 内容列表。 |
| `numVisible` | `number` | `1` | 同时可见项数。 |
| `circular` | `boolean` | `false` | 循环翻页。 |
| `autoplay` | `boolean` | `false` | 自动翻页。 |
| `interval` | `number` | `3000` | 自动翻页间隔（毫秒）。 |
| `showArrows` | `boolean` | `true` | 显示左右箭头。 |
| `showIndicators` | `boolean` | `true` | 显示指示点。 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `item` | `{ item, index }` 单项。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:page` | `number` | 页码变化。 |
