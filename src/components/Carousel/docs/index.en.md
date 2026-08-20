---
title: Carousel
category: 11 / MEDIA
description: Carousel for a set of content items.
---

# Carousel

Slides content in a window of `numVisible` items.

## Import

```ts
import { WiCarousel } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiCarousel } from '@well-insight/ui'

const value = ['Spring', 'Summer', 'Autumn', 'Winter']
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

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `unknown[]` | — | Content list. |
| `numVisible` | `number` | `1` | Number of items visible at once. |
| `circular` | `boolean` | `false` | Loop paging. |

## Slots

| Slot | Description |
| --- | --- |
| `item` | `{ item, index }` for each item. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:page` | `number` | Page change. |
