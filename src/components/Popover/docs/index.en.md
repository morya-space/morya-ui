---
title: Popover
category: 05 / FEEDBACK
description: Floating panel positioned relative to a trigger. Supports placement and Teleport. Closes on outside click or Esc.
---

# Popover

Overlay positioned relative to a trigger. Use it for filters, quick actions, or lightweight forms.

## Import

```ts
import { MButton, MPopover } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Placement

```vue preview src="./demos/Placement.vue"
```

## Hover

`trigger` defaults to `manual` (`v-model` only). Use `hover` / `click` / `focus` to let the component open itself.

```vue preview src="./demos/Hover.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Visibility. Use with `v-model`. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'bottom-start' \| 'bottom-end'` | `'bottom'` | Position relative to the trigger. |
| `trigger` | `'manual' \| 'click' \| 'hover' \| 'focus'` | `'manual'` | How it opens. |
| `showDelay` / `hideDelay` | `number` | `0` / `200` | Hover/focus delay in ms. |
| `teleport` | `boolean` | `true` | Overlay Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. `'self'` / `false` renders in place. |
| `transition` | `string \| false` | `'popover'` | Enter/exit motion preset; `false` / `'none'` disables. See [Theme · Motion presets](/docs/guide/theme). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when visibility changes. |
| `show` | — | Emitted when opened. |
| `hide` | — | Emitted after close. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Trigger element. |
| `content` | Overlay content. |
