---
title: ProgressSpinner
category: 05 / FEEDBACK
description: SVG circular loading indicator with configurable stroke width and animation duration.
---

# ProgressSpinner

SVG circular loading indicator.

## Import

```ts
import { MProgressSpinner } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Wrap

When wrapping content, `show` toggles the overlay and `delay` waits before it appears.

```vue preview src="./demos/Wrap.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `strokeWidth` | `string` | `'2'` | SVG circle stroke width. |
| `animationDuration` | `string` | `'1s'` | Rotation animation duration. |
| `ariaLabel` | `string` | locale `loading` | Accessible name. |
| `show` | `boolean` | `true` | Overlay visibility when wrapping content. |
| `delay` | `number` | `0` | Delay before showing (ms). |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `description` | `string` | — | Caption under the spinner. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

No slots.
