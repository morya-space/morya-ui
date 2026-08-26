---
title: Menu
category: 09 / MENU
description: Vertical menu list with optional popup mode.
---

# Menu

Vertical menu rendered from a `model`. Nested `items` expand in place. `collapsed` is icon-only density (nested items still expand in place; no flyout).

## Import

```ts
import { WiMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiMenu } from '@well-insight/ui'

const model = [
  { label: 'New', command: () => undefined },
  { label: 'Open' },
  { separator: true },
  { label: 'Disabled', disabled: true },
]
</script>

<template>
  <WiMenu :model="model" />
</template>
```

## Nested / selectedKey / collapsed

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiMenu } from '@well-insight/ui'

const selectedKey = ref('home')
const model = [
  {
    key: 'file',
    label: 'File',
    icon: 'edit',
    items: [
      { key: 'home', label: 'Home', icon: 'home' },
      { key: 'open', label: 'Open' },
    ],
  },
]
</script>

<template>
  <div style="display:flex;gap:1.5rem;align-items:flex-start">
    <WiMenu v-model:selected-key="selectedKey" :model="model" />
    <WiMenu :model="model" collapsed />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenuItem[]` | — | Menu items; may nest `items`. Items may include `key` / `icon`. |
| `popup` | `boolean` | `false` | Whether to use popup mode. |
| `modelValue` | `boolean` | `false` | Popup visibility. |
| `selectedKey` | `string \| null` | — | Selected item (`item.key` or `item.label`). |
| `collapsed` | `boolean` | `false` | Icon-only; nested items still expand in place. |
| `indent` | `number` | `16` | Extra padding-left per level, in px. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Popup visibility changed. |
| `update:selectedKey` | `string \| null` | Selected item changed. |
| `select` | `MenuItem` | Emitted when a leaf is clicked. |
