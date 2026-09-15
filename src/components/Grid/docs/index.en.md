---
title: Grid
category: 06 / LAYOUT
description: CSS Grid layout with GridItem span / offset control.
---

# Grid

24-column grid layout (override with `cols`). Use `MGridItem` (alias `MGi`) as children.

## Import

```ts
import { MGrid, MGridItem } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Span & Offset

```vue preview src="./demos/SpanAndOffset.vue"
```

## Responsive

`cols` / `xGap` / `yGap` and GridItem `span` / `offset` accept responsive strings such as `1 s:2 m:3` (breakpoints: `xs` `s` `m` `l` `xl` `2xl`).

When `cols` / gaps are plain numbers but items still need responsive `span`, enable `itemResponsive`.

```vue preview src="./demos/Responsive.vue"
```

## Collapsed

```vue preview src="./demos/Collapsed.en.vue"
```

## Grid Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `cols` | `number \| string` | `24` | Columns; supports `"1 s:2 m:3"` responsive syntax. |
| `xGap` / `yGap` | `number \| string` | `0` | Column / row gap in px (responsive strings allowed). |
| `responsive` | `'self' \| 'screen'` | `'self'` | Use container width or viewport width. |
| `itemResponsive` | `boolean` | `false` | Force width queries for item `span` / `offset` even when `cols` is numeric. |
| `collapsed` | `boolean` | `false` | Hide items beyond visible rows. |
| `collapsedRows` | `number` | `1` | Visible rows when collapsed. |
| `layoutShiftDisabled` | `boolean` | `false` | Plain CSS Grid without collapse bookkeeping. |
| `itemStyle` | `string \| object` | — | Style applied to every GridItem. |

## GridItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `span` | `number \| string` | `1` | Column span. |
| `offset` | `number \| string` | `0` | Leading offset columns. |
| `suffix` | `boolean` | `false` | Pin to the end when collapsed. |

## GridItem Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `{ overflow }` | Content; `overflow` is true when items are hidden. |

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Grid children. |
