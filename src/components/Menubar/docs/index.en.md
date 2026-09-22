---
title: Menubar
category: 04 / NAVIGATION
description: Horizontal menubar with one level of dropdowns.
---

# Menubar

Horizontal navigation menu. Child items appear in a single-level dropdown. `selectedKey` / `icon` cover highlight and icons. Responsive collapse is out of scope this batch.

## Import

```ts
import { MMenubar } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenubarItem[]` | — | Menu items. May include one level of `items`. Items may include `key` / `icon`. |
| `selectedKey` | `string \| null` | — | Selected item (`item.key` or `item.label`). |
| `teleport` | `boolean` | `true` | Overlay Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. `'self'` / `false` renders in place. |
| `transition` | `string \| false` | `'scale-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Theme · Motion presets](/docs/guide/theme). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:selectedKey` | `string \| null` | Selected item changed. |
| `select` | `MenubarItem` | Emitted when a leaf is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `start` | Start of menubar. |
| `end` | End of menubar. |

## Types

<h4 id="MenubarItem">MenubarItem</h4>

See source `types.ts` for the full definition.

```ts
interface MenubarItem extends Omit<MenuNodeBase, 'label' | 'items'> {
  label: string
  items?: MenubarItem[]
}
```
