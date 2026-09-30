---
title: Calendar
category: 05 / DATA DISPLAY
description: Month/year calendar panels with card mode and cell slots.
---

# Calendar

**Calendar panel** for schedules and month views. Parsing reuses `MDatePicker` `dateUtils`; weekday and month labels come from `useMLocale`.


## When to use

- Month/year calendar panels with card mode and cell slots

## Import

```ts
import { MCalendar } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Card mode

Set `fullscreen={false}` for a compact card calendar (default `true` is full-bleed).

```vue preview src="./demos/Card.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `Date \| string \| null` | `null` | Selected date |
| `mode` | `'month' \| 'year'` | `'month'` | Day grid vs month grid |
| `fullscreen` | `boolean` | `true` | `false` = compact card |
| `showWeek` | `boolean` | `false` | ISO week column |
| `disabledDate` | `(date: Date) => boolean` | — | Disable dates |
| `validRange` | tuple | — | Selectable range |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Events

| Event | Payload |
| --- | --- |
| `update:modelValue` | value |
| `update:mode` | mode |
| `select` | `Date` |
| `panelChange` | `Date`, mode |
| `change` | value |

## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `header` | `{ value, mode, onChange, onModeChange }` | Custom header |
| `dateCell` | `{ date }` | Day cell content |
| `monthCell` | `{ date }` | Month cell content |

Full-cell render hooks are not exposed separately; build the whole cell inside `dateCell` if needed.

