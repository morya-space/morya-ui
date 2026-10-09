---
title: Badge
category: 01 / BASIC
description: Status badge or dot.
---

# Badge

Status badge or dot for counts and status cues.

## Import

```ts
import { MBadge } from 'morya-ui'
```

## Basic

Pass `value` to show text or a number; omit `value` to render a dot.

```vue preview src="./demos/Basic.vue"
```

## Type

Use `type` for semantic color; defaults to primary when omitted.

```vue preview src="./demos/Types.vue"
```

## Size

`size` supports `small` / `large`, plus aliases `sm` / `lg`.

```vue preview src="./demos/Size.vue"
```

## Overlay

Wrap content with the default slot. `max` caps numeric values; `processing` pulses.

```vue preview src="./demos/Overlay.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | — | Badge content. Renders as a dot when omitted. |
| `type` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'contrast'` | `'primary'` | Semantic color. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size; `sm` / `lg` are aliases. |
| `max` | `number` | — | Cap numeric values as `{max}+`. |
| `offset` | `[number, number]` | — | Offset `[x, y]` when wrapping content. |
| `processing` | `boolean` | `false` | Pulse animation. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM pass-through; see [attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `default` | Content to overlay. |

## Accessibility

- When badge counts matter, update nearby visible text or an `aria-live` region.
- Do not rely on the badge alone as the only status indicator.

## Events

No custom events.
