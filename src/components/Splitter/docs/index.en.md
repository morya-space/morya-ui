---
title: Splitter
category: 06 / LAYOUT
description: Two-pane resizable split layout (horizontal / vertical).
---

# Splitter

Split content into two panes with a draggable gutter.

## Import

```ts
import { MSplitter } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Vertical / direction

`layout` and `direction` are equivalent (`direction` is an alias).

```vue preview src="./demos/VerticalDirection.vue"
```

## Size modes

- `number > 1`: percent (e.g. `35` → 35%)
- `number ≤ 1`: ratio (e.g. `0.35` → 35%)
- `string`: pixels (e.g. `'120px'`)

```vue preview src="./demos/SizeModes.vue"
```

## Disabled

```vue preview src="./demos/Disabled.en.vue"
```

## Custom gutter

Style the divider with `resizeTriggerClass` / `resizeTriggerStyle`, and put a handle or icon in `#resize-trigger` (alias `#gutter`). Keep thickness on `resizeTriggerSize` (used for drag usable-size math). `pt.gutter` is also supported.

```vue preview src="./demos/CustomGutter.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Split direction. |
| `direction` | same | — | Alias of `layout`. |
| `size` | `number \| string` | — | Controlled size; `>1` = `%`, `≤1` = ratio, `'Npx'` = pixels. |
| `defaultSize` | `number \| string` | `50` | Uncontrolled initial size. |
| `min` / `max` | `number \| string` | mode-based | Bounds (same unit family as `size`). |
| `disabled` | `boolean` | `false` | Disable drag and keyboard resize. |
| `resizeTriggerSize` | `number` | `6` | Gutter thickness in px. |
| `resizeTriggerClass` / `resizeTriggerStyle` | — | — | Gutter class / style. |
| `pane1Class` / `pane1Style` | — | — | Primary pane class / style. |
| `pane2Class` / `pane2Style` | — | — | Secondary pane class / style. |
| `pt` | [SplitterPassThrough](/docs/types#SplitterPassThrough) `{ root?, gutter?, panel1?, panel2? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `panel1` / `1` | Left / top pane. |
| `panel2` / `2` | Right / bottom pane. |
| `resize-trigger` / `gutter` | Custom gutter content (handle, icon, …). |
| `default` | First two children when named slots are unused. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:size` | `number \| string` | Size changed. |
| `resize` | same | Convenience listener. |
| `drag-start` / `drag-move` / `drag-end` | `Event` | Drag lifecycle. |
