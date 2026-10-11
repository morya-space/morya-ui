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

## Range Shortcuts

`shortcuts` shine for `daterange` / `datetimerange`: return a `[start, end]` tuple to select a range in one click. The shortcut matching the current value is highlighted automatically.

```vue preview src="./demos/RangeShortcuts.en.vue"
```

## Custom Format

`format` only affects display; the emitted value still follows the `type` convention (`YYYY-MM-DD`, etc.). Mix `YYYY` / `MM` / `DD` / `HH` / `mm` / `ss` with free text.

```vue preview src="./demos/Format.en.vue"
```

## Datetime

`datetime` and `datetimerange` combine the calendar and time columns in one panel. `show-seconds` includes seconds; `need-confirm` lets users finish the two-step pick before committing.

```vue preview src="./demos/Datetime.en.vue"
```

## Custom Trigger

The `#trigger` slot takes full control of the trigger element with scope `{ value, open }` — handy for buttons, icons, or composite layouts.

```vue preview src="./demos/CustomTrigger.en.vue"
```

## Disabled Ranges

Dates outside `min-date` / `max-date` are disabled in the calendar. Use them alone or together.

```vue preview src="./demos/DisabledDates.en.vue"
```

## Inline Panel

`:teleport="false"` with `append-to="self"` renders the panel inline, outside the overlay stacking context — useful inside cards, drawers, or complex forms.

```vue preview src="./demos/InlinePanel.en.vue"
```

## Panel Mode Cycling

Click the panel header label to cycle through days → months → years sub-panels, handy for jumping to a target year/month before returning to the day grid.

## Status

`status` accepts `'warning'` or `'error'` for visual emphasis (`invalid` / `errorMessage` imply `error`). Use `warning` with `helpText` for friendly reminders that don't block submission.

```vue preview src="./demos/Status.en.vue"
```

## Footer & Custom Cell

The `#footer` slot renders an action area at the bottom of the panel (scope `{ close }`); `#cell` customizes the day cell (scope includes `date / inMonth / selected / inRange / rangeStart / rangeEnd / isToday / disabled`) — great for holiday dots, schedule markers, or custom layouts.

```vue preview src="./demos/FooterAndCell.en.vue"
```

## needConfirm

With `need-confirm`, picking a value only writes to a draft; **OK** commits and closes, **Cancel** rolls back. Recommended for `datetime` / `datetimerange` / `time` where selection takes multiple steps.

```vue preview src="./demos/NeedConfirm.en.vue"
```

## Multiple Dates

`multiple` (only valid for `type='date'`) makes `modelValue` a `string[]`; each click toggles selection and the panel stays open.

```vue preview src="./demos/Multiple.en.vue"
```

## Multiple in Practice: Shift Planning

Combine `multiple` with `MTag` to display picked days in a friendly, readable way.

```vue preview src="./demos/WorkSchedule.en.vue"
```

## Form Integration

Combine `required`, `error-message` and `min-date` for a complete date-range validation form.

```vue preview src="./demos/FormIntegration.en.vue"
```

## Input Mask

`mask` makes the input editable, auto-inserting `-` / `/` / `:` separators matching the display `format`. Press **Enter** to commit, **Esc** or blur to revert. Supported on `date` / `datetime` / `time` only.

```vue preview src="./demos/Mask.en.vue"
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
| `shortcuts`    | `DatePickerShortcut[]`                                                                  | `[]`           | Panel shortcuts; the one matching the current value is highlighted.                          |
| `status`       | `'default' \| 'warning' \| 'error'`                                                     | `'default'`    | Visual status; `invalid` / `errorMessage` imply `error`.                                     |
| `needConfirm`  | `boolean`                                                                               | `false`        | Defer commit until OK; Cancel rolls back.                                                    |
| `multiple`     | `boolean`                                                                               | `false`        | Pick many dates (`type='date'` only); `modelValue` is `string[]`.                            |
| `mask`         | `boolean`                                                                               | `false`        | Editable input with auto separators; Enter commits, Esc/blur reverts.                        |
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

| Slot      | Description                                                                                                                  |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `trigger` | Custom trigger `{ value, open }`.                                                                                            |
| `footer`  | Panel bottom action area, scope `{ close }`. When `need-confirm` is on and no footer is given, default OK/Cancel is shown.   |
| `cell`    | Custom day cell, scope `{ date, inMonth, selected, inRange, rangeStart, rangeEnd, isToday, disabled }`.                       |

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

## Boundaries

Date, range, and time modes are selected via `type` (`daterange`, `datetime`, `time`, etc.).
