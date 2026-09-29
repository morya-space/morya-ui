---
title: DatePicker
category: 02 / FORM
description: Calendar overlay for a date, time, month, or year. String shape follows `type`. Supports min/max, shortcuts, format, showSeconds, and clearable.
---

# DatePicker

Date picker with month navigation and a day grid; also supports time columns and month/year panels.

## When to use

- Use for date, date range, date-time, month, or year selection.
- For time-only, prefer the dedicated [TimePicker](/components/TimePicker) entry (`type="time"` still works).

## Import

```ts
import { MDatePicker } from "morya-ui";
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

## Type variants

`type` also supports `month` / `year` / `time` / `datetime` / `datetimerange`. Use `showSeconds` to include seconds.

For time-only, prefer the dedicated [TimePicker](/components/TimePicker); `type="time"` on this component still works.

`datetimerange`: after two date clicks, emits both ends with `00:00` (or `00:00:00`); while the panel stays open, time columns adjust the end time and selecting the finest unit closes.

```vue preview src="./demos/Types.vue"
```

## Shortcuts

```vue preview src="./demos/Shortcuts.en.vue"
```

## Props

| Prop           | Type                                                                                    | Default        | Description                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `modelValue`   | `string \| Date \| [string, string] \| null`                                            | `null`         | By `type`: `YYYY-MM-DD`, `[start,end]`, `YYYY-MM-DD HH:mm`, `HH:mm`, `YYYY-MM`, `YYYY`, etc. |
| `type`         | `'date' \| 'daterange' \| 'datetime' \| 'datetimerange' \| 'time' \| 'month' \| 'year'` | `'date'`       | Panel and value shape.                                                                       |
| `showSeconds`  | `boolean`                                                                               | `false`        | Include seconds for `time` / `datetime` / `datetimerange`.                                   |
| `label`        | `string`                                                                                | —              | Label.                                                                                       |
| `minDate`      | `string \| Date \| null`                                                                | —              | Optional lower bound.                                                                        |
| `maxDate`      | `string \| Date \| null`                                                                | —              | Optional upper bound.                                                                        |
| `placeholder`  | `string`                                                                                | locale         | Placeholder.                                                                                 |
| `format`       | `string`                                                                                | `'YYYY-MM-DD'` | Input display pattern (`YYYY`/`MM`/`DD`/`HH`/`mm`/`ss`); emitted value follows `type`.       |
| `clearable`    | `boolean`                                                                               | `true`         | Show a clear button.                                                                         |
| `shortcuts`    | `DatePickerShortcut[]`                                                                  | `[]`           | Panel shortcuts.                                                                             |
| `fluid`        | `boolean`                                                                               | `false`        | Stretch to full width.                                                                       |
| `size`         | [MSizeInput](/docs/types#MSizeInput)                                                    | —              | `small` / `large`; can inherit from ConfigProvider.                                          |
| `disabled`     | `boolean`                                                                               | `false`        | Disabled.                                                                                    |
| `invalid`      | `boolean`                                                                               | `false`        | Invalid state.                                                                               |
| `teleport`     | `boolean`                                                                               | `true`         | Panel Teleport; mounts to `body` by default.                                                 |
| `appendTo`     | `string \| HTMLElement \| 'self' \| false`                                              | `'body'`       | Mount target; `'self'` / `false` renders in place.                                           |
| `transition`   | `string \| false`                                                                       | `'scale-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion).           |
| `errorMessage` | `string`                                                                                | —              | —                                                                                            |
| `helpText`     | `string`                                                                                | —              | —                                                                                            |
| `id`           | `string`                                                                                | —              | —                                                                                            |
| `pt`           | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }`  | —              | Pass-through; see [Styling & attrs](/docs/attrs).                                            |

## Events

| Event               | Prop                                 | Description                             |
| ------------------- | ------------------------------------ | --------------------------------------- |
| `update:modelValue` | `string \| [string, string] \| null` | Value change.                           |
| `clear`             | —                                    | Fired when the clear button is clicked. |
| `change`            | —                                    | —                                       |
| `hide`              | —                                    | —                                       |
| `show`              | —                                    | —                                       |

## Slots

| Slot      | Description                       |
| --------- | --------------------------------- |
| `trigger` | Custom trigger `{ value, open }`. |

## Types

<h4 id="DatePickerShortcut">DatePickerShortcut</h4>

See source `types.ts` for the full definition.

```ts
interface DatePickerShortcut {
  label: string;
  value:
    | DatePickerDateValue
    | [DatePickerDateValue, DatePickerDateValue]
    | (() => DatePickerDateValue | [DatePickerDateValue, DatePickerDateValue]);
}
```

## vs ant-design

Maps to antd `DatePicker` / `RangePicker` via `type` modes (`daterange`, `datetime`, `time`, etc.); keep morya API vocabulary. See [antd mapping](/docs/antd-mapping).
