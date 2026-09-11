---
title: SpeedDial
category: 04 / NAVIGATION
description: Floating shortcut action button group.
---

# SpeedDial

A main button that expands a set of directional shortcut actions.

## Import

```ts
import { MSpeedDial } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MSpeedDial } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const items = [
  { label: 'Edit', icon: '✎' },
  { label: 'Delete', icon: '🗑' },
  { label: 'Share', icon: '↗' },
]
</script>

<template>
  <div style="min-height:8rem;display:flex;align-items:flex-end;justify-content:center">
    <MSpeedDial v-model="open" :model="items" direction="up" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `SpeedDialItem[]` | `[]` | Action items. |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Expand direction. |
| `modelValue` | `boolean` | `false` | Whether it is expanded. |
| `disabled` | `boolean` | `false` | Disabled. |
| `ariaLabel` | `string` | locale `speedDial` | Accessible label for the main button. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the expanded state changes. |

## Slots

| Slot | Description |
| --- | --- |
| `button` | Custom main button. |
| `item` | Action `{ item }`. |

## Types

<h4 id="SpeedDialItem">SpeedDialItem</h4>

See source `types.ts` for the full definition.

```ts
interface SpeedDialItem extends Omit<MenuNodeBase, 'label'> {
  label: string
}
```
