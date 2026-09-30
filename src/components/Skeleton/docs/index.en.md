---
title: Skeleton
category: 03 / DATA
description: Loading placeholder skeleton. Supports rectangle/circle shapes, custom sizes, and a wave animation.
---

# Skeleton

Loading placeholder skeleton for visual feedback while content is not ready.

## Import

```ts
import { MSkeleton } from 'morya-ui'
```

## Basic

Rectangle by default, `100%` wide, with a `wave` animation.

```vue preview src="./demos/Basic.vue"
```

## Shape

`shape` supports `rectangle` (default) and `circle`.

```vue preview src="./demos/Shape.vue"
```

## Animation

`animation` is `wave` (default) or `none`.

```vue preview src="./demos/Animation.vue"
```

## Text & repeat

`text` renders a text-line skeleton; `repeat` duplicates rows.

```vue preview src="./demos/TextAndRepeat.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `shape` | `'rectangle' \| 'circle'` | `'rectangle'` | Shape. |
| `width` | `string` | `'100%'` | Width (CSS value). |
| `height` | `string` | — | Height (CSS value). |
| `borderRadius` | `string` | — | Border-radius override. Forced to a full circle when the shape is circular. |
| `animation` | `'wave' \| 'none'` | `'wave'` | Loading animation. |
| `text` | `boolean` | `false` | Render as a text-line height. |
| `repeat` | `number` | `1` | Number of repeated rows. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

No slots.
