---
title: Flex
category: 05 / PANEL
description: Flexbox layout container for direction, alignment, and gap.
---

# Flex

Flexbox layout container. Prefer CSS `gap` for spacing between children.

## Import

```ts
import { WiFlex } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiButton, WiFlex } from '@well-insight/ui'
</script>

<template>
  <WiFlex>
    <WiButton label="One" size="small" />
    <WiButton label="Two" size="small" severity="secondary" />
    <WiButton label="Three" size="small" severity="secondary" />
  </WiFlex>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { WiButton, WiFlex } from '@well-insight/ui'
</script>

<template>
  <WiFlex vertical>
    <WiButton label="Top" size="small" />
    <WiButton label="Middle" size="small" severity="secondary" />
    <WiButton label="Bottom" size="small" severity="secondary" />
  </WiFlex>
</template>
```

## Justify & Align

```vue preview
<script setup lang="ts">
import { WiButton, WiFlex, WiTag } from '@well-insight/ui'
</script>

<template>
  <WiFlex justify="space-between" align="center" style="width:min(28rem,100%)">
    <WiTag value="Tag" />
    <WiButton label="Action" size="small" />
  </WiFlex>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | — | Cross-axis alignment. |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | Main-axis alignment. |
| `inline` | `boolean` | `false` | Use `inline-flex`. |
| `vertical` | `boolean` | `false` | Column direction. |
| `reverse` | `boolean` | `false` | Reverse main axis. |
| `size` | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` | Gap between items. |
| `wrap` | `boolean` | `true` | Allow wrapping (forced off when vertical). |

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Layout children. |
