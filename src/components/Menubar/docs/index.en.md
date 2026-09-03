---
title: Menubar
category: 04 / NAVIGATION
description: Horizontal menubar with one level of dropdowns.
---

# Menubar

Horizontal navigation menu. Child items appear in a single-level dropdown. `selectedKey` / `icon` cover highlight and icons. Responsive collapse is out of scope this batch.

## Import

```ts
import { WiMenubar } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiMenubar } from '@well-insight/ui'
import { ref } from 'vue'

const selectedKey = ref<string | null>(null)
const model = [
  {
    key: 'file',
    label: 'File',
    icon: 'edit',
    items: [{ key: 'new', label: 'New' }, { key: 'open', label: 'Open' }],
  },
  { key: 'edit', label: 'Edit', icon: 'home' },
]
</script>

<template>
  <WiMenubar v-model:selected-key="selectedKey" :model="model" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenubarItem[]` | — | Menu items. May include one level of `items`. Items may include `key` / `icon`. |
| `selectedKey` | `string \| null` | — | Selected item (`item.key` or `item.label`). |
| `teleport` | `boolean` | `true` | Overlay Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. `'self'` / `false` renders in place. |

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
