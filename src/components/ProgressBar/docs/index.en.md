---
title: ProgressBar
category: 03 / DATA
description: Progress bar for determinate or indeterminate progress.
---

# ProgressBar

Shows task completion, or an indeterminate loading state.

## Import

```ts
import { MProgressBar } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Circle & status

```vue preview src="./demos/CircleAndStatus.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Progress 0–100 (determinate). |
| `mode` | `'determinate' \| 'indeterminate'` | `'determinate'` | Determinate / indeterminate mode. |
| `showValue` | `boolean` | `true` | Whether to show the percentage label. |
| `type` | `'line' \| 'circle'` | `'line'` | Line or circle. |
| `status` | `'success' \| 'info' \| 'warning' \| 'danger' \| 'exception' \| 'active' \| 'normal' \| …` | — | Semantic fill. `exception`→danger; `active`→line stripe; `normal`→primary. |
| `color` | `string` | — | Custom fill color. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |

## Events

No custom events.

## Slots

No slots.
