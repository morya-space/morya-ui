---
title: VirtualScroller
category: 03 / DATA
description: Renders long lists within the visible viewport.
---

# VirtualScroller

Windowed list rendering based on scroll position. Best for large, **equal-height** rows.

## Import

```ts
import { MVirtualScroller } from 'morya-ui'
```

## Basic usage

`itemSize` is a fixed row height in px. Truncate overflowing content inside `#item`.

```vue preview src="./demos/BasicUsage.en.vue"
```

## Performance notes

- Only viewport rows plus `buffer` extras are mounted; DOM nodes are reused while scrolling.
- Requires **uniform row height**—use pagination or a plain list for variable heights.
- A larger `buffer` reduces flicker when scrolling fast at the cost of more DOM.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `unknown[]` | — | Full data set. |
| `itemSize` | `number` | — | Row height in px. |
| `height` | `number \| string` | `240` | Viewport height. |
| `buffer` | `number` | `3` | Extra rows rendered above/below the viewport. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |
| `role` | `string` | — | `role` of the container. |
| `ariaLabel` | `string` | — | Accessible name for the container. |


## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `item` | `{ item, index }` | Row content; container height follows `itemSize`. |

## Methods

| Method | Description |
| --- | --- |
| `scrollToIndex(index)` | Scroll to the row at the given index. |

## Accessibility

- The scroll region uses native overflow. Keep a sensible tab order when rows contain controls.
- Pair long lists with search or filtering instead of scroll-only discovery.

## Events

No custom events.
