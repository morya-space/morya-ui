---
title: ProgressBar
category: 07 / MISC
description: Progress bar for determinate or indeterminate progress.
---

# ProgressBar

Shows task completion, or an indeterminate loading state.

## Import

```ts
import { WiProgressBar } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiProgressBar } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WiProgressBar :value="35" />
    <WiProgressBar :value="70" :show-value="false" />
    <WiProgressBar mode="indeterminate" />
  </div>
</template>
```

## Circle & status

```vue preview
<script setup lang="ts">
import { WiProgressBar } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <WiProgressBar :value="72" type="circle" status="success" />
    <WiProgressBar :value="40" status="warn" />
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
