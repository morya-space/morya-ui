---
title: VirtualScroller
category: 03 / DATA
description: Renders long lists within the visible viewport.
---

# VirtualScroller

Windowed list rendering based on scroll position. Best for large, **equal-height** rows.

## Import

```ts
import { WiVirtualScroller } from '@well-insight/ui'
```

## Basic usage

`itemSize` is a fixed row height in px. Truncate overflowing content inside `#item`.

```vue preview
<script setup lang="ts">
import { WiVirtualScroller } from '@well-insight/ui'

const items = Array.from({ length: 1000 }, (_, i) => `Row ${i + 1}`)
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

## Performance notes

- Only viewport rows plus `buffer` extras are mounted; DOM nodes are reused while scrolling.
- Requires **uniform row height**—use pagination or a plain list for variable heights.
- A larger `buffer` reduces flicker when scrolling fast at the cost of more DOM.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `unknown[]` | — | Full data set. |
| `itemSize` | `number` | — | Row height in px. |
| `height` | `number \| string` | `240` | Viewport height. |
| `buffer` | `number` | `3` | Extra rows rendered above/below the viewport. |

## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `item` | `{ item, index }` | Row content; container height follows `itemSize`. |

## Accessibility

- The scroll region uses native overflow. Keep a sensible tab order when rows contain controls.
- Pair long lists with search or filtering instead of scroll-only discovery.

## Events

No custom events.
