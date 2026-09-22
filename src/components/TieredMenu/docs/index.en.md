---
title: TieredMenu
category: 04 / NAVIGATION
description: A vertical layered menu with one submenu level.
---

# TieredMenu

Vertical menu with **one** submenu level on hover or click. Use `popup` for overlay mode.

## Import

```ts
import type {TieredMenuItem} from 'morya-ui';
import { MTieredMenu  } from 'morya-ui'
```

## Basic usage

```vue preview src="./demos/BasicUsage.en.vue"
```

## Popup mode

Combine `popup` with `v-model` for toolbar triggers:

```vue preview src="./demos/PopupMode.en.vue"
```

## Scrolling & submenu flyout

The root list and side submenu use built-in `MScrollbar` (`max-height: min(18rem, 45vh)`). Submenus teleport to `body` and anchor to the trigger so they stay visible when the root menu scrolls.

## Item shape

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Display text. |
| `command` | `() => void` | Runs when a leaf item is activated. |
| `disabled` | `boolean` | Disabled item. |
| `separator` | `boolean` | Renders a divider (ignores other fields). |
| `items` | `TieredMenuItem[]` | One submenu level. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `TieredMenuItem[]` | — | Menu items. |
| `popup` | `boolean` | `false` | Popup overlay mode. |
| `modelValue` | `boolean` | `false` | Popup visibility (`v-model`). |
| `teleport` | `boolean` | `true` | Teleport when `popup`; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. |
| `transition` | `string \| false` | `'scale-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Theme · Motion presets](/docs/guide/theme). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Popup visibility change. |

## Slots

No slots.

## Types

<h4 id="TieredMenuItem">TieredMenuItem</h4>

See source `types.ts` for the full definition.

```ts
interface TieredMenuItem {
  label?: string
  command?: () => void
  disabled?: boolean
  separator?: boolean
  items?: TieredMenuItem[]
}
```
