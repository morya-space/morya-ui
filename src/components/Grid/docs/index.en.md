---
title: Grid
category: 06 / LAYOUT
description: CSS Grid layout with GridItem span / offset control.
---

# Grid

Two layout systems live on this page:

- **CSS Grid (`MGrid` / `MGridItem`):** a 24-column grid (override with `cols`) with container responsiveness and collapsing. Use `MGridItem` (alias `MGi`) as children.
- **Flex 24-column grid (`MRow` / `MCol`):** aligned with Ant Design's `Row` / `Col` — `gutter` / `span` / `offset` / `push` / `pull` / `order` / `flex` plus six breakpoints.

Both can coexist, but prefer one per level.


## When to use

- CSS Grid layout with GridItem span / offset control
- Prefer composing documented `M*` APIs; see [Common Props](/docs/common-props).

## Import

```ts
import { MGrid, MGridItem, MRow, MCol } from 'morya-ui'
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
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |

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

## Flex 24-column grid (MRow / MCol)

```vue
<MRow :gutter="[16, 24]" justify="space-between" align="middle">
  <MCol :xs="24" :md="12">Left</MCol>
  <MCol :xs="24" :md="12" :offset="6">Right</MCol>
</MRow>
```

Breakpoints: `xs` `<576`, `sm` `≥576`, `md` `≥768`, `lg` `≥992`, `xl` `≥1200`, `xxl` `≥1600`. Responsive values merge **ascending**, so the largest satisfied breakpoint wins — the same result Ant Design's media queries produce.

> Responsiveness is driven by one shared `matchMedia` subscription for the whole app, so column widths update on resize without generating a CSS class for every combination.

### Row Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `gutter` | `number \| [number, number] \| breakpoint object \| breakpoint array` | `0` | Column spacing; `[horizontal, vertical]`, or per-breakpoint such as `{ xs: 8, md: 16 }` |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | Main-axis distribution |
| `align` | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | `'top'` | Cross-axis alignment |
| `wrap` | `boolean` | `true` | Allow wrapping |
| `component` | `string` | `'div'` | Root tag |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM pass-through |

### Col Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `span` | `number` | `24` | Columns out of 24 |
| `offset` | `number` | `0` | Left offset in columns |
| `push` | `number` | `0` | Shift right in columns (does not affect siblings) |
| `pull` | `number` | `0` | Shift left in columns (does not affect siblings) |
| `order` | `number` | — | Flex order |
| `flex` | `number \| string` | — | `flex` value; wins over `span` when set |
| `xs` / `sm` / `md` / `lg` / `xl` / `xxl` | `number \| ColResponsiveConfig` | — | Per-breakpoint override: a number sets `span`, an object sets `{ span, offset, push, pull, order }` |
| `component` | `string` | `'div'` | Root tag |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM pass-through |

### Helper exports

| Export | Description |
| --- | --- |
| `GRID_BREAKPOINTS` / `GRID_BREAKPOINT_ORDER` | Breakpoint pixel values and the ascending list |
| `useGridBreakpoint()` | Reactive list of satisfied breakpoints |
| `mergeColResponsive()` / `resolveGutter()` / `resolveGutterValue()` | Pure helpers for testing and custom layouts |
