---
title: Skeleton
category: 03 / DATA
description: Loading placeholder skeleton. Supports rectangle/circle shapes, custom sizes, and a wave animation.
---

# Skeleton

Loading placeholder skeleton for visual feedback while content is not ready.

## Import

```ts
import { RdSkeleton } from '@roost-design/ui'
```

## Basic

Rectangle by default, `100%` wide, with a `wave` animation.

```vue preview
<script setup lang="ts">
import { RdSkeleton } from '@roost-design/ui'
</script>

<template>
  <div style="display:grid;gap:0.75rem;width:min(24rem,100%)">
    <RdSkeleton height="1.25rem" />
    <RdSkeleton height="1.25rem" width="70%" />
    <RdSkeleton height="6rem" border-radius="0.5rem" />
  </div>
</template>
```

## Shape

`shape` supports `rectangle` (default) and `circle`.

```vue preview
<script setup lang="ts">
import { RdSkeleton } from '@roost-design/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <RdSkeleton shape="circle" width="3rem" height="3rem" />
    <RdSkeleton width="10rem" height="3rem" />
  </div>
</template>
```

## Animation

`animation` is `wave` (default) or `none`.

```vue preview
<script setup lang="ts">
import { RdSkeleton } from '@roost-design/ui'
</script>

<template>
  <div style="display:grid;gap:0.75rem;width:min(24rem,100%)">
    <RdSkeleton height="1.25rem" animation="wave" />
    <RdSkeleton height="1.25rem" animation="none" />
  </div>
</template>
```

## Text & repeat

`text` renders a text-line skeleton; `repeat` duplicates rows.

```vue preview
<script setup lang="ts">
import { RdSkeleton } from '@roost-design/ui'
</script>

<template>
  <RdSkeleton text :repeat="3" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `shape` | `'rectangle' \| 'circle'` | `'rectangle'` | Shape. |
| `width` | `string` | `'100%'` | Width (CSS value). |
| `height` | `string` | — | Height (CSS value). |
| `borderRadius` | `string` | — | Border-radius override. Forced to a full circle when the shape is circular. |
| `animation` | `'wave' \| 'none'` | `'wave'` | Loading animation. |
| `text` | `boolean` | `false` | Render as a text-line height. |
| `repeat` | `number` | `1` | Number of repeated rows. |

## Events

No custom events.

## Slots

No slots.
