---
title: DatePicker
category: 02 / FORM
description: Calendar overlay for a date or date range. Values are ISO date strings. Supports min/max, shortcuts, format, and clearable.
---

# DatePicker

Date picker with month navigation and a day grid.

## Import

```ts
import { MDatePicker } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Size

```vue preview src="./demos/Size.vue"
```

## Min / Max

Dates outside the range are disabled in the calendar.

```vue preview src="./demos/MinMax.en.vue"
```

## Invalid

```vue preview src="./demos/Invalid.en.vue"
```

## Disabled

```vue preview src="./demos/Disabled.en.vue"
```

## Fluid

```vue preview src="./demos/Fluid.en.vue"
```

## Teleport

The panel Teleports to `body` by default. Use `append-to="self"` or `teleport={false}` to render in place.

```vue preview src="./demos/Teleport.en.vue"
```

## Range

With `type="daterange"`, click the start date then the end date. The value is `[start, end]` (ISO dates).

```vue preview src="./demos/Range.en.vue"
```

## Shortcuts

```vue preview src="./demos/Shortcuts.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| Date \| [string, string] \| null` | `null` | Single day emits `YYYY-MM-DD`; range emits `[start, end]`. |
| `type` | `'date' \| 'daterange'` | `'date'` | Single day or range. |
| `label` | `string` | — | Label. |
| `minDate` | `string \| Date \| null` | — | Optional lower bound. |
| `maxDate` | `string \| Date \| null` | — | Optional upper bound. |
| `placeholder` | `string` | locale | Placeholder. |
| `format` | `string` | `'YYYY-MM-DD'` | Input display pattern; the emitted value stays ISO. |
| `clearable` | `boolean` | `true` | Show a clear button. |
| `shortcuts` | `DatePickerShortcut[]` | `[]` | Panel shortcuts. |
| `fluid` | `boolean` | `false` | Stretch to full width. |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `invalid` | `boolean` | `false` | Invalid state. |
| `teleport` | `boolean` | `true` | Panel Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `transition` | `string \| false` | `'scale-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| [string, string] \| null` | Value change. |
| `clear` | — | Fired when the clear button is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | Custom trigger `{ value, open }`. |

## Types

<h4 id="DatePickerShortcut">DatePickerShortcut</h4>

See source `types.ts` for the full definition.

```ts
interface DatePickerShortcut {
  label: string
  value:
    | DatePickerDateValue
    | [DatePickerDateValue, DatePickerDateValue]
    | (() => DatePickerDateValue | [DatePickerDateValue, DatePickerDateValue])
}
```
