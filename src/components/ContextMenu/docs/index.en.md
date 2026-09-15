---
title: ContextMenu
category: 04 / NAVIGATION
description: Right-click context menu with show(event) / hide().
---

# ContextMenu

Context menu that opens at the pointer position. Nested `items` are supported. `useContextMenu()` can bind `v-model` / `v-model:position`.

## Import

```ts
import { MContextMenu, useContextMenu } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Nested + useContextMenu

```vue preview src="./demos/NestedUsecontextmenu.en.vue"
```

## Scrolling & nested flyouts

The menu list and nested `items` flyouts use built-in `MScrollbar` (`max-height: min(18rem, 45vh)`). Nested panels teleport to `body` and anchor to the parent item so side flyouts are not clipped when the root menu scrolls.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `ContextMenuItem[]` | — | Menu items; may nest `items`. Items may include `key` / `icon`. |
| `modelValue` | `boolean` | `false` | Whether the menu is visible. |
| `position` | `{ x: number; y: number }` | — | Menu coordinates. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
| `update:position` | `{ x; y }` | Position change. |

## Methods

| Method / Property | Description |
| --- | --- |
| `show(event)` | Show from a mouse event or coordinates. |
| `hide()` | Hide the menu. |

`useContextMenu()` returns `{ visible, position, show, hide }` for imperative open.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Trigger element (inline mode). |

## Types

<h4 id="ContextMenuItem">ContextMenuItem</h4>

See source `types.ts` for the full definition.

```ts
interface ContextMenuItem extends MenuNodeBase {
  items?: ContextMenuItem[]
}
```
