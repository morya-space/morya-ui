---
title: TimePicker
category: 02 / FORM
description: Dedicated time picker entry; equivalent to `MDatePicker` with `type="time"`.
---

# TimePicker

Pick hours and minutes (optional seconds). Thin wrapper around `MDatePicker` with `type` fixed to `time`.

## When to use

- Forms that need a clock time only (no day grid)
- Discoverability from the component overview / search as TimePicker
- Prefer this export; `MDatePicker type="time"` still works

For dates, date-times, and ranges, use [DatePicker](/components/DatePicker).

## Import

```ts
import { MTimePicker } from 'morya-ui'
```

## Basic

Value is `HH:mm`, or `HH:mm:ss` when `showSeconds` is set.

```vue preview src="./demos/Basic.en.vue"
```

## Props

Inherits [DatePicker](/components/DatePicker) props except `type` (always `time`). Common ones:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| Date \| null` | `null` | `HH:mm` or `HH:mm:ss` with seconds |
| `showSeconds` | `boolean` | `false` | Include seconds column |
| `format` | `string` | `'HH:mm'` | Input display pattern |
| `label` | `string` | — | Label |
| `placeholder` | `string` | locale | Placeholder (`timePickerPlaceholder`) |
| `clearable` | `boolean` | `true` | Clear button |
| `fluid` | `boolean` | `false` | Full width |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | Size |
| `disabled` / `invalid` | `boolean` | `false` | Disabled / invalid |
| `teleport` / `appendTo` | — | same as DatePicker | Panel mount |
| `transition` | `string \| false` | `'scale-fade'` | Motion |

## Events

Same as DatePicker: `update:modelValue`, `change`, `clear`, `show`, `hide`.

## FAQ

### Difference from `MDatePicker type="time"`?

Same behavior. `MTimePicker` is a dedicated entry and clearer types (no `type` prop).

### When to use this one?

Use it when you need a time only (no date) and a narrower API (`severity` / `size` / `showSeconds`, etc.).
