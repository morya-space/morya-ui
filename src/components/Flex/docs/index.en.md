---
title: Flex
category: 01 / BASIC
description: Flexbox layout container for direction, alignment, and gap.
---

# Flex

Flexbox layout container. Prefer CSS `gap` for spacing between children.

## Import

```ts
import { MFlex } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Vertical

```vue preview src="./demos/Vertical.en.vue"
```

## Justify & Align

```vue preview src="./demos/JustifyAndAlign.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | — | Cross-axis alignment. |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | Main-axis alignment. |
| `inline` | `boolean` | `false` | Use `inline-flex`. |
| `vertical` | `boolean` | `false` | Column direction. |
| `reverse` | `boolean` | `false` | Reverse main axis. |
| `size` | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` | Gap between items. |
| `wrap` | `boolean` | `true` | Allow wrapping (forced off when vertical). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Layout children. |
