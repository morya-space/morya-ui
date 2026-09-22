---
title: Dropdown
category: 04 / NAVIGATION
description: Action menu overlay (not a form select). Unlike Select, it is used to trigger actions such as edit and delete.
---

# Dropdown

Action menu overlay. Opens a set of actions from a trigger.

**Difference from Select:** `MDropdown` is a menu overlay; for form option selection, use `MSelect`.

Supports groups (`type: 'group'`), dividers (`separator` / `type: 'divider'`), nested `items`, and `trigger: 'hover'` with `showDelay` / `hideDelay`. Keyboard highlight still covers top-level leaves only.

## Import

```ts
import { MButton, MDropdown } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Nested / group / hover

```vue preview src="./demos/NestedGroupHover.en.vue"
```

## Scrolling & nested flyouts

Both the root menu and nested `items` flyouts use built-in `MScrollbar` with `max-height: min(18rem, 45vh)`. Nested submenus are **also teleported to `body`** and positioned against the parent item so they are not clipped when the root menu scrolls; a short hover delay keeps the flyout open while moving the pointer into it.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether the menu is open. |
| `items` | `DropdownItem[]` | — | Menu items; may include `type` / `separator` / `items` / `icon` / `command`. |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | Alignment. |
| `closeOnSelect` | `boolean` | `true` | Close after selection. |
| `trigger` | `'click' \| 'hover'` | `'click'` | How the menu opens. |
| `showDelay` / `hideDelay` | `number` | `0` / `200` | Hover delays in ms. |
| `teleport` | `boolean` | `true` | Teleport the menu; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `transition` | `string \| false` | `'scale-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Theme · Motion presets](/docs/guide/theme). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Open state change. |
| `select` | `DropdownItem` | Emitted when an enabled item is selected. |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | Trigger. |
| `item` | Custom menu item, scope `{ item }`. |

## Types

<h4 id="DropdownItem">DropdownItem</h4>

See source `types.ts` for the full definition.

```ts
interface DropdownItem extends MenuNodeBase {
  type?: DropdownItemType
  items?: DropdownItem[]
}
```
