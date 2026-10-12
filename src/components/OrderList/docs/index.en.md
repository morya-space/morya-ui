---
title: OrderList
category: 03 / DATA
description: Reorder a list with drag handles and up/down buttons.
---

# OrderList

Reorder items with drag handles (native HTML5 DnD, no external library), with up/down and top/bottom buttons as a keyboard-friendly alternative.

## Import

```ts
import { MOrderList } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Disabled

```vue preview src="./demos/Disabled.en.vue"
```

## Custom item

Customize rendering via the `#item` slot with scope `{ item, index, selected, dragging }`.

```vue preview src="./demos/CustomItem.en.vue"
```

## Keyboard

| Key | Action |
| --- | --- |
| `↑` / `↓` | Move the selection highlight. |
| `Ctrl/⌘ + ↑` / `Ctrl/⌘ + ↓` | Move the selected item up / down one step. |
| `Ctrl/⌘ + Home` / `Ctrl/⌘ + End` | Move the selected item to top / bottom. |
| `Home` / `End` | Highlight the first / last item. |

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `unknown[]` | `[]` | List data. |
| `selection` | `number \| null` | — | Controlled selected index, with `v-model:selection`. |
| `dataKey` | `string` | — | Unique key for object items. |
| `listStyle` | `string \| object` | — | List style. |
| `dragdrop` | `boolean` | `true` | Enable drag-and-drop reorder. |
| `disabled` | `boolean` | `false` | Disable all interactions (buttons, drag, selection). |
| `emptyMessage` | `string` | — | Empty state message; defaults to locale `emptyMessage`. |
| `pt` | [OrderListPassThrough](/docs/types#OrderListPassThrough) | — | DOM pass-through; see [Styling & attrs](/docs/attrs). |

## Slots

| Slot | Description |
| --- | --- |
| `item` | `{ item, index, selected, dragging }` custom item. |
| `empty` | Custom empty content. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `unknown[]` | New order after reorder. |
| `update:selection` | `number \| null` | Selected index change. |
| `reorder` | `{ item, from, to }` | Detail of a single move (item, original index, new index). |

## Accessibility

- The list is `role="listbox"` and items are `role="option"` with `aria-selected`.
- Dragging only starts after the handle is pressed, avoiding accidental drags; every reorder is fully keyboard-operable.
- When `disabled`, the list is marked `aria-disabled`; items are not focusable or draggable.
