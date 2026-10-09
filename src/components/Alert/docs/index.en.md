---
title: Alert
category: 05 / FEEDBACK
description: Inline page notice with type, close, and action slot.
---

# Alert

Persistent **in-page** notice for form intros, permission hints, and read-only warnings. Prefer [Message](/components/Message) / [Toast](/components/Toast) for brief action feedback, and [Result](/components/Result) for full-page outcomes.

## Import

```ts
import { MAlert } from 'morya-ui'
```

## Basic

`type` sets tone and default icon: `info` / `success` / `warning` / `danger`.

```vue preview src="./demos/Basic.vue"
```

## Closable

`closable` shows a close control; click emits `close` and removes the content.

```vue preview src="./demos/Closable.vue"
```

## Action

Use `#action` for secondary actions (e.g. Undo); `#title` / default slot customize copy.

```vue preview src="./demos/WithAction.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `AlertType` | `'info'` | Tone and default icon |
| `title` | `string` | — | Title |
| `description` | `string` | — | Description (or default slot) |
| `showIcon` | `boolean` | `true` | Show leading icon |
| `closable` | `boolean` | `false` | Show close control |
| `size` | `AlertSize` | — | Density; also accepts `sm` / `lg` |
| `banner` | `boolean` | `false` | Full-bleed weak border |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Events

| Event | Description |
| --- | --- |
| `close` | Fired when close is clicked |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Description body |
| `title` | Title |
| `icon` | Custom icon |
| `action` | Trailing actions |

## Types

### AlertType

```ts
type AlertType = 'info' | 'success' | 'warning' | 'danger'
```

### AlertSize

```ts
type AlertSize = MSizeInput
```
