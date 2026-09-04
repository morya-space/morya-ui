---
title: Flex
category: 01 / BASIC
description: Flexbox layout container for direction, alignment, and gap.
---

# Flex

Flexbox layout container. Prefer CSS `gap` for spacing between children.

## Import

```ts
import { WdFlex } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdButton, WdFlex } from '@wex-design/ui'
</script>

<template>
  <WdFlex>
    <WdButton label="One" size="small" />
    <WdButton label="Two" size="small" severity="secondary" />
    <WdButton label="Three" size="small" severity="secondary" />
  </WdFlex>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { WdButton, WdFlex } from '@wex-design/ui'
</script>

<template>
  <WdFlex vertical>
    <WdButton label="Top" size="small" />
    <WdButton label="Middle" size="small" severity="secondary" />
    <WdButton label="Bottom" size="small" severity="secondary" />
  </WdFlex>
</template>
```

## Justify & Align

```vue preview
<script setup lang="ts">
import { WdButton, WdFlex, WdTag } from '@wex-design/ui'
</script>

<template>
  <WdFlex justify="space-between" align="center" style="width:min(28rem,100%)">
    <WdTag value="Tag" />
    <WdButton label="Action" size="small" />
  </WdFlex>
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
