---
title: Watermark
category: 07 / OTHER
description: Canvas repeating watermark overlay for children.
---

# Watermark

Repeating canvas watermark over the default slot.

## Import

```ts
import { MWatermark } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string \| string[]` | — | Text watermark |
| `image` | `string` | — | Image URL |
| `width` / `height` | `number` | `120` / `64` | Cell size |
| `rotate` | `number` | `-22` | Rotation in degrees |
| `gap` | `[number, number]` | `[100, 100]` | Repeat gap |
| `offset` | `[number, number]` | gap center | Pattern offset |
| `font` | `WatermarkFont` | — | Font options |
| `zIndex` | `number` | `9` | Stacking |
| `inherit` | `boolean` | `true` | Inherit flag (class hook) |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Anti-tamper (lightweight)

If the overlay node is removed from the DOM, a `MutationObserver` re-renders it (not a security boundary—guards accidental removal).

