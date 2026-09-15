---
title: ScrollTop
category: 04 / NAVIGATION
description: Shows a back-to-top button after scrolling past a threshold.
---

# ScrollTop

Listens to window or parent scroll and jumps back to the top.

## Import

```ts
import { MScrollTop } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## With MScrollbar

When `target="parent"`, ScrollTop walks up the DOM for the nearest `.m-scrollbar__wrap` (or native overflow container). Place `MScrollTop` inside the `MScrollbar` default slot and keep `teleport` enabled (default) so the button stays pinned to the viewport corner.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `threshold` | `number` | `400` | Show threshold in px. |
| `target` | `'window' \| 'parent'` | `'window'` | Scroll target. |
| `right` | `string \| number` | — | Distance from the right edge; a number is pixels. |
| `bottom` | `string \| number` | — | Distance from the bottom edge; a number is pixels. |
| `teleport` | `boolean` | `true` | Overlay Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. `'self'` / `false` renders in place. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

No slots.
