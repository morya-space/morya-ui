---
title: Sidebar
category: 04 / NAVIGATION
description: Collapsible navigation rail.
---

# Sidebar

Application navigation sidebar (not a Drawer overlay). Exported as `MSidebar`.

## Import

```ts
import { MSidebar } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `SidebarItem[]` | `[]` | Menu items. |
| `collapsed` | `boolean` | `false` | Icon-only mode. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Sidebar content. |

## Types

<h4 id="SidebarItem">SidebarItem</h4>

See source `types.ts` for the full definition.

```ts
interface SidebarItem extends Omit<MenuNodeBase, 'label' | 'items'> {
  label: string
  items?: SidebarItem[]
}
```
