---
title: MegaMenu
category: 04 / NAVIGATION
description: Horizontal menu with multi-column mega panels.
---

# MegaMenu

Horizontal top navigation. Sub-links render in a **multi-column panel**—suited to site-wide nav.

## Import

```ts
import { WdMegaMenu, type MegaMenuItem } from '@wex-design/ui'
```

## Basic usage

```vue preview
<script setup lang="ts">
import { WdMegaMenu } from '@wex-design/ui'

const model = [
  {
    label: 'Products',
    items: [
      [{ label: 'Component library', command: () => {} }, { label: 'Themes' }],
      [{ label: 'Icons' }, { label: 'Templates' }],
    ],
  },
  { label: 'About', command: () => window.alert('About') },
]
</script>

<template>
  <WdMegaMenu :model="model" />
</template>
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

## Accessibility

- Top items expose button/link semantics; ensure submenu links are keyboard reachable.
- Pair with skip links and `aria-current` on the active page when used as primary nav.

## Events

No custom events.

## Slots

No slots.
