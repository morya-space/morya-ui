---
title: Alert
category: 05 / FEEDBACK
description: Inline page notice with severity, close, and action slot.
---

# Alert

Persistent **in-page** notice for form intros, permission hints, and read-only warnings. Prefer [Message](/components/Message) / [Toast](/components/Toast) for brief action feedback, and [Result](/components/Result) for full-page outcomes.


## When to use

- Inline page notice with severity, close, and action slot

## Import

```ts
import { MAlert } from 'morya-ui'
```

## Basic

`severity` sets tone and default icon: `info` / `success` / `warning` / `error`.

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
| `severity` | `AlertSeverity` | `'info'` | Tone and default icon |
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

### AlertSeverity

```ts
type AlertSeverity = 'info' | 'success' | 'warning' | 'error'
```

### AlertSize

```ts
type AlertSize = MSizeInput
```
