---
title: VirtualScroller
category: 06 / DATA
description: Render long lists by the visible viewport.
---

# VirtualScroller

Windowed rendering of list items based on scroll position.

## Import

```ts
import { WiVirtualScroller } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiVirtualScroller } from '@well-insight/ui'

const items = Array.from({ length: 1000 }, (_, i) => `Row ${i + 1}`)
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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `unknown[]` | — | Full data set. |
| `itemSize` | `number` | — | Item height in px. |
| `height` | `number \| string` | `240` | Viewport height. |
| `buffer` | `number` | `3` | Extra rows rendered above and below the viewport. |

## Slots

| Slot | Description |
| --- | --- |
| `item` | `{ item, index }` item content. |
