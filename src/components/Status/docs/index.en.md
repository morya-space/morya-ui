---
title: Status
category: 01 / DATA
description: Inline status marker with a colored dot or semantic icon plus label.
---

# Status

Lightweight status for tables and detail headers. Prefer [Tag](/components/Tag) when you need a chip-like label or closable control.

Non-neutral severities show a semantic icon by default so the status reads as a marker, not plain tinted text.

## Import

```ts
import { MStatus } from "morya-ui";
```

## Basic

Pass `label` or use the default slot. Neutral status uses a dot; success / danger / etc. get an icon automatically.

```vue preview src="./demos/Basic.vue"

```

## Severity

Use `severity` for semantic color; defaults to `secondary` (dot, neutral).

```vue preview src="./demos/Severity.vue"

```

## Size & Processing

`size` supports `small` / `large`. `processing` pulses the indicator.

```vue preview src="./demos/Processing.vue"

```

## Tag · Text · Custom icon

- `variant="tag"`: soft pill with dot or auto icon.
- `variant="text"`: label only — no indicator, no auto icon.
- `icon` / `#icon`: overrides the auto icon.
- `disabled`: muted inactive look.

```vue preview src="./demos/Variants.vue"

```

## Props

| Prop         | Type                                                                                                         | Default       | Description                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------ | ------------- | -------------------------------------------------------- |
| `label`      | `string`                                                                                                     | —             | Status text. Slot content wins when present.             |
| `severity`   | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'secondary'` | Semantic color. Non-neutral tones get a default icon.    |
| `processing` | `boolean`                                                                                                    | `false`       | Pulse animation on the indicator.                        |
| `size`       | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'`                                                                 | —             | Size.                                                    |
| `color`      | `string`                                                                                                     | —             | Custom color; overrides `severity`.                      |
| `variant`    | `'dot' \| 'tag' \| 'text'`                                                                                   | `'dot'`       | Presentation: marker / soft pill / text only.            |
| `icon`       | [IconName](/docs/types#IconName)                                                                             | —             | Leading icon; overrides auto icon.                       |
| `disabled`   | `boolean`                                                                                                    | `false`       | Muted disabled appearance.                               |

## Slots

| Slot      | Description          |
| --------- | -------------------- |
| `default` | Status text.         |
| `icon`    | Custom leading icon. |

## Accessibility

- Root uses `role="status"`.
- Do not rely on color alone; keep visible text.

## Events

No custom events.
