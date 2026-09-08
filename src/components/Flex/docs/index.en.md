---
title: Flex
category: 01 / BASIC
description: Flexbox layout container for direction, alignment, and gap.
---

# Flex

Flexbox layout container. Prefer CSS `gap` for spacing between children.

## Import

```ts
import { RdFlex } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdButton, RdFlex } from '@wise-kit/ui'
</script>

<template>
  <RdFlex>
    <RdButton label="One" size="small" />
    <RdButton label="Two" size="small" severity="secondary" />
    <RdButton label="Three" size="small" severity="secondary" />
  </RdFlex>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { RdButton, RdFlex } from '@wise-kit/ui'
</script>

<template>
  <RdFlex vertical>
    <RdButton label="Top" size="small" />
    <RdButton label="Middle" size="small" severity="secondary" />
    <RdButton label="Bottom" size="small" severity="secondary" />
  </RdFlex>
</template>
```

## Justify & Align

```vue preview
<script setup lang="ts">
import { RdButton, RdFlex, RdTag } from '@wise-kit/ui'
</script>

<template>
  <RdFlex justify="space-between" align="center" style="width:min(28rem,100%)">
    <RdTag value="Tag" />
    <RdButton label="Action" size="small" />
  </RdFlex>
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
