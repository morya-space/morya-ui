---
title: VirtualScroller
category: 06 / DATA
description: 按可视窗口渲染长列表。
---

# VirtualScroller

根据滚动位置窗口化渲染列表项。

## 引入

```ts
import { WiVirtualScroller } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiVirtualScroller } from '@well-insight/ui'

const items = Array.from({ length: 1000 }, (_, i) => `行 ${i + 1}`)
</script>

<template>
  <WiVirtualScroller :items="items" :item-size="36" :height="220">
    <template #item="{ item }">
      <div style="padding:0 0.75rem;display:flex;align-items:center;height:100%;border-bottom:1px solid var(--wi-color-border)">
        {{ item }}
      </div>
    </template>
  </WiVirtualScroller>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `unknown[]` | — | 全部数据。 |
| `itemSize` | `number` | — | 单项高度（px）。 |
| `height` | `number \| string` | `240` | 视口高度。 |
| `buffer` | `number` | `3` | 上下额外渲染行数。 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `item` | `{ item, index }` 单项内容。 |
