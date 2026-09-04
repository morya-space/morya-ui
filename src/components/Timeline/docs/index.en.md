---
title: Timeline
category: 03 / DATA
description: Vertical or horizontal timeline with icon markers and custom slots.
---

# Timeline

Display event nodes in chronological order.

## Import

```ts
import { WdTimeline } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdTimeline } from '@wex-design/ui'

const events = [
  { status: 'Ordered', date: '15/10/2024', content: 'Order placed', icon: 'check', severity: 'success' },
  { status: 'Shipped', date: '16/10/2024', content: 'On the way', icon: 'upload', severity: 'info' },
  { status: 'Delivered', date: '17/10/2024', content: 'Arrived', icon: 'home', severity: 'success' },
]
</script>

<template>
  <WdTimeline :value="events" align="alternate" />
</template>
```

## Horizontal

```vue preview
<script setup lang="ts">
import { WdTimeline } from '@wex-design/ui'

const events = [
  { status: 'Start', date: 'Monday', content: 'Kickoff', icon: 'check' },
  { status: 'Build', date: 'Wednesday', content: 'Implementation', icon: 'settings' },
  { status: 'Ship', date: 'Friday', content: 'Release', icon: 'check-circle' },
]
</script>

<template>
  <WdTimeline :value="events" layout="horizontal" />
</template>
```

## Pending & item slot

`pending` (`true` or a string) appends a trailing item. `#item` replaces the whole event.

```vue preview
<script setup lang="ts">
import { WdTimeline } from '@wex-design/ui'

const events = [
  { status: 'Done', date: 'Mon', content: 'Shipped' },
]
</script>

<template>
  <WdTimeline :value="events" pending="Waiting">
    <template #item="{ item }">
      <span>{{ item.content || item.status }}</span>
    </template>
  </WdTimeline>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TimelineEvent[]` | — | Events. |
| `align` | `'left' \| 'right' \| 'alternate'` | `'left'` | Alignment for vertical layout. |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Direction. |
| `pending` | `boolean \| string` | — | Append a trailing pending item; a string is used as the label. |

`TimelineEvent`: `status` / `content` / `date` / `icon` (`IconName` or text) / `color` / `severity`.

## Slots

| Slot | Description |
| --- | --- |
| `item` | Whole event, `{ item, index }`; falls back to opposite / marker / content. |
| `content` | Main content, `{ item, index }`. |
| `opposite` | Opposite-side content; shows `date` by default. |
| `marker` | Custom node marker. |
| `connector` | Custom connector line. |

## Events

No custom events.
