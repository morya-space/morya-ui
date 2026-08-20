---
title: Timeline
category: 06 / DATA
description: Vertical or horizontal timeline with icon markers and custom slots.
---

# Timeline

Display event nodes in chronological order.

## Import

```ts
import { WiTimeline } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiTimeline } from '@well-insight/ui'

const events = [
  { status: 'Ordered', date: '15/10/2024', content: 'Order placed', icon: 'check', severity: 'success' },
  { status: 'Shipped', date: '16/10/2024', content: 'On the way', icon: 'upload', severity: 'info' },
  { status: 'Delivered', date: '17/10/2024', content: 'Arrived', icon: 'home', severity: 'success' },
]
</script>

<template>
  <WiTimeline :value="events" align="alternate" />
</template>
```

## Horizontal

```vue preview
<script setup lang="ts">
import { WiTimeline } from '@well-insight/ui'

const events = [
  { status: 'Start', date: 'Monday', content: 'Kickoff', icon: 'check' },
  { status: 'Build', date: 'Wednesday', content: 'Implementation', icon: 'settings' },
  { status: 'Ship', date: 'Friday', content: 'Release', icon: 'check-circle' },
]
</script>

<template>
  <WiTimeline :value="events" layout="horizontal" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TimelineEvent[]` | — | Events. |
| `align` | `'left' \| 'right' \| 'alternate'` | `'left'` | Alignment for vertical layout. |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Direction. |

`TimelineEvent`: `status` / `content` / `date` / `icon` (`IconName` or text) / `color` / `severity`.

## Slots

| Slot | Description |
| --- | --- |
| `content` | Main content, `{ item, index }`. |
| `opposite` | Opposite-side content; shows `date` by default. |
| `marker` | Custom node marker. |
| `connector` | Custom connector line. |
