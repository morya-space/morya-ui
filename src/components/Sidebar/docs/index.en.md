---
title: Sidebar
category: 04 / NAVIGATION
description: Collapsible navigation rail.
---

# Sidebar

Application navigation sidebar (not a Drawer overlay). Exported as `WiSidebar`.

## Import

```ts
import { WiSidebar } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiButton, WiSidebar } from '@well-insight/ui'
import { ref } from 'vue'

const collapsed = ref(false)
const model = [
  { label: 'Overview', icon: '▦' },
  {
    label: 'Projects',
    icon: '☰',
    items: [{ label: 'All' }, { label: 'Archive' }],
  },
  { label: 'Settings', icon: '⚙' },
]
</script>

<template>
  <div style="display:flex;gap:1rem;align-items:flex-start">
    <WiSidebar :model="model" :collapsed="collapsed" />
    <WiButton :label="collapsed ? 'Expand' : 'Collapse'" size="small" @click="collapsed = !collapsed" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `SidebarItem[]` | `[]` | Menu items. |
| `collapsed` | `boolean` | `false` | Icon-only mode. |

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Sidebar content. |
