---
title: Divider
category: 01 / BASIC
description: Content divider.
---

# Divider

Content divider, optionally with a label.

## Import

```ts
import { MDivider } from 'morya-ui'
```

## Basic

Default horizontal solid divider.

```vue preview src="./demos/Basic.vue"
```

## Type

`type` supports `solid`, `dashed`, and `dotted`.

```vue preview src="./demos/Type.vue"
```

## Align

When the divider is horizontal and has a label, use `align` to control the label position.

```vue preview src="./demos/Align.vue"
```

## Title placement

`titlePlacement` is an alias of `align`.

```vue preview src="./demos/TitlePlacement.vue"
```

## Layout

`layout` controls horizontal / vertical orientation.

```vue preview src="./demos/Layout.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `type` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Line style. |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Label alignment for a horizontal divider with a label. |
| `titlePlacement` | `'left' \| 'center' \| 'right'` | — | Alias of `align`; takes precedence when set. |
| `label` | `string` | — | Center label text. The default slot takes precedence when present. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `default` | Label content, takes precedence over `label`. |

## Events

No custom events.
