---
title: VirtualScroller
category: 06 / DATA
description: 按可视窗口渲染长列表。
---

# VirtualScroller

根据滚动位置**窗口化**渲染列表项，适合成千上万条等行高数据。

## 引入

```ts
import { WiVirtualScroller } from '@well-insight/ui'
```

## 基础用法

`itemSize` 为固定行高（px）；内容超出时请在 `#item` 插槽内自行截断。

```vue preview
<script setup lang="ts">
import { WiVirtualScroller } from '@well-insight/ui'

const items = Array.from({ length: 1000 }, (_, i) => `行 ${i + 1}`)
</script>

<template>
  <WiVirtualScroller :items="items" :item-size="36" :height="220">
    <template #item="{ item, index }">
      <div style="padding:0 0.75rem;display:flex;align-items:center;height:100%;border-bottom:1px solid var(--wi-color-border)">
        {{ item }} <span style="margin-left:auto;color:var(--wi-color-text-muted);font-size:0.75rem">#{{ index }}</span>
      </div>
    </template>
  </WiVirtualScroller>
</template>
```

## 性能说明

- 仅渲染视口内行 + `buffer` 缓冲行，滚动时复用 DOM。
- 要求**统一行高**；动态高度列表请改用分页或普通列表。
- 增大 `buffer` 可减少快速滚动时的空白，但会增加 DOM 数量。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `unknown[]` | — | 全部数据。 |
| `itemSize` | `number` | — | 单项高度（px）。 |
| `height` | `number \| string` | `240` | 视口高度。 |
| `buffer` | `number` | `3` | 视口上下额外渲染行数。 |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `item` | `{ item, index }` | 单行内容；容器高度由 `itemSize` 决定。 |

## 无障碍

- 滚动区域为原生 overflow；若行内有关交互控件，请保证键盘焦点顺序合理。
- 长列表建议配合搜索或过滤，避免仅依赖滚动浏览。
