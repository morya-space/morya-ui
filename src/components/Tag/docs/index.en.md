---
title: Tag
category: 01 / DATA
description: Tag for status or category.
---

# Tag

Tags display status or category.

## Import

```ts
import { MTag } from 'morya-ui'
```

## Basic

Show text via `value` or the default slot.

```vue preview src="./demos/Basic.vue"
```

## Type

Use `type` for semantic color; defaults to primary when omitted.

```vue preview src="./demos/Types.vue"
```

## Icons

Pass a `MIcon` icon name to `icon`.

```vue preview src="./demos/Icons.vue"
```

## Bordered

`bordered` draws a tone-colored outline. Default is borderless with a filled tone background.

```vue preview src="./demos/Bordered.vue"
```

## Closable

```vue preview src="./demos/Closable.vue"
```

## Checkable

`checkable` + `v-model:checked` toggles selection. When combined with `closable`, the close control is hidden.

```vue preview src="./demos/Checkable.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Tag text. The default slot takes precedence when present. |
| `type` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'help' \| 'danger' \| 'contrast'` | `'primary'` | Semantic color. Custom `color` overrides `type`. |
| `rounded` | `boolean` | `false` | Fully rounded. |
| `icon` | [IconName](/docs/types#IconName) | — | `MIcon` icon name. |
| `closable` | `boolean` | `false` | Show a close control (ignored when `checkable`). |
| `size` | `'small' \| 'medium' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `bordered` | `boolean` | `false` | Draw a border. |
| `color` | `string` | — | Custom color; overrides `type`. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `checkable` | `boolean` | `false` | Toggleable selection. |
| `checked` | `boolean` | `false` | Checked state; use with `v-model:checked`. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM pass-through; see [attrs](/docs/attrs). |


## Events

| Event | Payload | Description |
| --- | --- | --- |
| `close` | `MouseEvent` | Fired when close is clicked. |
| `update:checked` | `boolean` | Checked state change (`v-model:checked`). |
| `change` | `boolean` | Checked state change. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Tag content; takes precedence over `value`. |
