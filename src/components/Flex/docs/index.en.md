---
title: Flex
category: 01 / BASIC
description: Flexbox layout container for direction, alignment, and gap.
---

# Flex

Flexbox layout container. Prefer CSS `gap` for spacing between children.

## Import

```ts
import { WkFlex } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkButton, WkFlex } from '@wise-kit/ui'
</script>

<template>
  <WkFlex>
    <WkButton label="One" size="small" />
    <WkButton label="Two" size="small" severity="secondary" />
    <WkButton label="Three" size="small" severity="secondary" />
  </WkFlex>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { WkButton, WkFlex } from '@wise-kit/ui'
</script>

<template>
  <WkFlex vertical>
    <WkButton label="Top" size="small" />
    <WkButton label="Middle" size="small" severity="secondary" />
    <WkButton label="Bottom" size="small" severity="secondary" />
  </WkFlex>
</template>
```

## Justify & Align

```vue preview
<script setup lang="ts">
import { WkButton, WkFlex, WkTag } from '@wise-kit/ui'
</script>

<template>
  <WkFlex justify="space-between" align="center" style="width:min(28rem,100%)">
    <WkTag value="Tag" />
    <WkButton label="Action" size="small" />
  </WkFlex>
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
