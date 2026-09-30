---
title: MegaMenu
category: 04 / NAVIGATION
description: Horizontal menu with multi-column mega panels.
---

# MegaMenu

Horizontal top navigation. Sub-links render in a **multi-column panel**—suited to site-wide nav.

## Import

```ts
import type {MegaMenuItem} from 'morya-ui';
import {  MMegaMenu } from 'morya-ui'
```

## Basic usage

```vue preview src="./demos/BasicUsage.en.vue"
```

## Panel shape

`items` is an array of **columns**. Each column is a list of links at the same level.

```ts
{
  label: 'Products',
  items: [
    [ { label: 'Col A · item 1' }, { label: 'Col A · item 2' } ],
    [ { label: 'Col B · item 1' } ],
  ],
}
```

Top-level entries without `items` behave as plain links via `command`.

## Item fields

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | Display text. |
| `icon` | `string` | Optional leading character. |
| `command` | `() => void` | Runs on activate. |
| `disabled` | `boolean` | Disabled item. |
| `items` | `MegaMenuItem[][]` | Column groups for the mega panel. |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MegaMenuItem[]` | `[]` | Top-level items. |
| `teleport` | `boolean` | `true` | Panel Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. |
| `transition` | `string \| false` | `'scale-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Accessibility

- Top items expose button/link semantics; ensure submenu links are keyboard reachable.
- Pair with skip links and `aria-current` on the active page when used as primary nav.

## Events

No custom events.

## Slots

No slots.

## Types

<h4 id="MegaMenuItem">MegaMenuItem</h4>

See source `types.ts` for the full definition.

```ts
interface MegaMenuItem extends Omit<MenuNodeBase, 'label' | 'items'> {
  label: string
  /** Column groups for mega panel; each entry is a column of items. */
  items?: MegaMenuItem[][]
}
```
