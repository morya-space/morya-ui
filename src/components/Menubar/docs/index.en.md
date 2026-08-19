---
title: Menubar
category: 09 / MENU
description: Horizontal menubar with one level of dropdowns.
---

# Menubar

Horizontal navigation menu. Child items appear in a single-level dropdown.

## Import

```ts
import { WdMenubar } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdMenubar } from '@well-insight/ui'

const model = [
  {
    label: 'File',
    items: [{ label: 'New' }, { label: 'Open' }],
  },
  { label: 'Edit' },
]
</script>

<template>
  <WdMenubar :model="model" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenubarItem[]` | — | Menu items. May include one level of `items`. |
| `teleport` | `boolean` | `true` | Overlay Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. `'self'` / `false` renders in place. |
