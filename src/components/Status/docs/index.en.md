---
title: Status
category: 01 / BASIC
description: Inline status with a colored dot and label.
---

# Status

Lightweight status for tables and detail headers: a colored dot plus label. Prefer [Tag](/components/Tag) when you need a chip-like label or closable control.

## Import

```ts
import { MStatus } from 'morya-ui'
```

## Basic

Pass `label` or use the default slot.

```vue preview src="./demos/Basic.vue"
```

## Severity

Use `severity` for semantic color; defaults to `secondary`. Legacy `warning` maps to `warn`.

```vue preview src="./demos/Severity.vue"
```

## Size & Processing

`size` supports `small` / `large`. `processing` pulses the dot.

```vue preview src="./demos/Processing.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Status text. Slot content wins when present. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'secondary'` | Semantic color. `warning` maps to `warn`. |
| `processing` | `boolean` | `false` | Pulse animation on the dot. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `color` | `string` | — | Custom color; overrides `severity`. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Status text. |

## Accessibility

- Root uses `role="status"`.
- Do not rely on color alone; keep visible text.

## Events

No custom events.
