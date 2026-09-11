---
title: ContextMenu
category: 04 / NAVIGATION
description: Right-click context menu with show(event) / hide().
---

# ContextMenu

Context menu that opens at the pointer position. Nested `items` are supported. `useContextMenu()` can bind `v-model` / `v-model:position`.

## Import

```ts
import { useContextMenu, MContextMenu } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MContextMenu } from 'morya-ui'

const model = [
  { label: 'Copy' },
  { label: 'Paste' },
  { separator: true },
  { label: 'Delete', disabled: true },
]
</script>

<template>
  <MContextMenu :model="model">
    <div
      style="border: 1px dashed var(--m-color-border); padding: 2rem; border-radius: var(--m-radius-md)"
    >
      Right-click here to open the menu
    </div>
  </MContextMenu>
</template>
```

## Nested + useContextMenu

```vue preview
<script setup lang="ts">
import { useContextMenu, MContextMenu } from 'morya-ui'

const menu = useContextMenu()
const model = [
  { label: 'Copy', command: () => undefined },
  { label: 'More', items: [{ label: 'Nested' }] },
]
</script>

<template>
  <div
    style="border: 1px dashed var(--m-color-border); padding: 2rem; border-radius: var(--m-radius-md)"
    @contextmenu="menu.show"
  >
    Right-click here (composable)
  </div>
  <MContextMenu v-model="menu.visible" v-model:position="menu.position" :model="model" />
</template>
```

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
