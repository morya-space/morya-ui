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
| `value` | `number` | `0` | Progress 0鈥?00 (determinate). |
| `mode` | `'determinate' \| 'indeterminate'` | `'determinate'` | Determinate / indeterminate mode. |
| `showValue` | `boolean` | `true` | Whether to show the percentage label. |
| `type` | `'line' \| 'circle'` | `'line'` | Line or circle. |
| `status` | `'success' \| 'info' \| 'warning' \| 'danger' \| 'exception' \| 'active' \| 'normal' \| 鈥 | 鈥?| Semantic fill. `exception`鈫抎anger; `active`鈫抣ine stripe; `normal`鈫抪rimary. |
| `color` | `string` | 鈥?| Custom fill color. |

## Events

No custom events.

## Slots

No slots.
