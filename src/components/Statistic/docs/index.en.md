---
title: Statistic
category: 05 / DATA DISPLAY
description: Numeric KPI display with prefix/suffix and countdown.
---

# Statistic

**KPI numbers** for dashboards and detail headers. Uses `--m-*` typography tokens; `loading` shows `MSkeleton`.

## Import

```ts
import { MStatistic, MStatisticCountdown } from 'morya-ui'
// or MStatistic.Countdown
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Countdown

`MStatisticCountdown` (or `MStatistic.Countdown`) formats remaining time; emits `finish` when done.

```vue preview src="./demos/Countdown.vue"
```

## Props — Statistic

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Label |
| `value` | `number \| string` | `0` | Value |
| `precision` | `number` | — | Decimal places |
| `prefix` / `suffix` | `string` | — | Affixes |
| `valueStyle` | `CSSProperties` | — | Value row style |
| `loading` | `boolean` | `false` | Skeleton |
| `formatter` | `(value) => string` | — | Custom format |
| `decimalSeparator` | `string` | `'.'` | Decimal separator |
| `groupSeparator` | `string` | `','` | Group separator |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Props — Countdown

Extends Statistic (except value formatting), plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| string \| Date` | — | Target time |
| `format` | `string` | `'HH:mm:ss'` | Countdown pattern |

## Events — Countdown

| Event | Description |
| --- | --- |
| `finish` | Countdown completed |
| `change` | Remaining ms updated |

