---
title: Space
category: 01 / BASIC
description: Layout helper that adds consistent gaps between children.
---

# Space

Adds consistent spacing between children. Prefer [`Flex`](/components/Flex/) for new layouts (native CSS `gap`).

## Import

```ts
import { MSpace } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Vertical

```vue preview src="./demos/Vertical.vue"
```

## Size

```vue preview src="./demos/Size.vue"
```

When `size` is omitted it defaults to `medium`. Override the global gap with `MConfigProvider` `componentDefaults.Space.size` (independent of control `size`).

## Without Item Wrapper

Set `wrapItem=false` to skip the per-child wrapper (useful when children manage their own layout).

```vue preview src="./demos/WithoutItemWrapper.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | — | Cross-axis alignment. |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | Main-axis alignment. |
| `inline` | `boolean` | `false` | Use `inline-flex`. |
| `vertical` | `boolean` | `false` | Column direction. |
| `reverse` | `boolean` | `false` | Reverse main axis. |
| `size` | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` | Gap size. |
| `wrap` | `boolean` | `true` | Allow wrapping. |
| `wrapItem` | `boolean` | `true` | Wrap each child in a container. |
| `itemClass` / `itemStyle` | — | — | Wrapper class / style when `wrapItem` is true. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Spaced children. |
