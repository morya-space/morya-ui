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

`layout` controls horizontal / vertical; `orientation` is an alias.

```vue preview src="./demos/Layout.vue"
```

## Plain

`plain` uses body text styling for the label (default is stronger heading weight).

```vue preview src="./demos/Plain.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `orientation` | `'horizontal' \| 'vertical'` | 鈥?| Alias of `layout`. |
| `type` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Line style (solid / dashed / dotted). |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Label alignment for a horizontal divider with a label. |
| `titlePlacement` | `'left' \| 'center' \| 'right'` | 鈥?| Alias of `align`; takes precedence when set. |
| `plain` | `boolean` | `false` | Use body text style for the label. |
| `size` | `'small' \| 'medium' \| 'large'` | 鈥?| Vertical margin for horizontal dividers (`--m-space-*`). |
| `label` | `string` | 鈥?| Center label text. The default slot takes precedence when present. |


## Slots

| Slot | Description |
| --- | --- |
| `default` | Label content, takes precedence over `label`. |

## Events

No custom events.
