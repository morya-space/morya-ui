---
title: Tag
category: 01 / BASIC
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

## Severity

Use `severity` for semantic color; defaults to primary when omitted. The legacy value `warning` is mapped to `warn`.

```vue preview src="./demos/Severity.vue"
```

## Icons

Pass a `MIcon` icon name to `icon`.

```vue preview src="./demos/Icons.vue"
```

## Closable

```vue preview src="./demos/Closable.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Tag text. The default slot takes precedence when present. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | Semantic color. `warning` is a compatibility alias mapped to `warn`. |
| `rounded` | `boolean` | `false` | Fully rounded. |
| `icon` | [IconName](/docs/types#IconName) | — | `MIcon` icon name. |
| `closable` | `boolean` | `false` | Show a close control. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `bordered` | `boolean` | `false` | Draw a border. |
| `color` | `string` | — | Custom color. |
| `disabled` | `boolean` | `false` | Disable the close control. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Payload | Description |
| --- | --- | --- |
| `close` | `MouseEvent` | Fired when close is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Tag content; takes precedence over `value`. |
