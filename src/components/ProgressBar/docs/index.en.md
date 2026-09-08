---
title: ProgressBar
category: 03 / DATA
description: Progress bar for determinate or indeterminate progress.
---

# ProgressBar

Shows task completion, or an indeterminate loading state.

## Import

```ts
import { WkProgressBar } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkProgressBar } from '@wise-kit/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WkProgressBar :value="35" />
    <WkProgressBar :value="70" :show-value="false" />
    <WkProgressBar mode="indeterminate" />
  </div>
</template>
```

## Circle & status

```vue preview
<script setup lang="ts">
import { WkProgressBar } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <WkProgressBar :value="72" type="circle" status="success" />
    <WkProgressBar :value="40" status="warn" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Progress 0–100 (determinate). |
| `mode` | `'determinate' \| 'indeterminate'` | `'determinate'` | Determinate / indeterminate mode. |
| `showValue` | `boolean` | `true` | Whether to show the percentage label. |
| `type` | `'line' \| 'circle'` | `'line'` | Line or circle. |
| `status` | `'success' \| 'info' \| 'warn' \| 'danger' \| 'error'` | — | Semantic fill. |
| `color` | `string` | — | Custom fill color. |

## Events

No custom events.

## Slots

No slots.
