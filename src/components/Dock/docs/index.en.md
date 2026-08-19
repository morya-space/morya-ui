---
title: Dock
category: 09 / MENU
description: macOS-style icon dock.
---

# Dock

Shortcut entries shown as an icon list.

## Import

```ts
import { WdDock } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdDock } from '@well-insight/ui'

const model = [
  { label: 'Home', icon: '⌂' },
  { label: 'Search', icon: '⌕' },
  { label: 'Settings', icon: '⚙' },
]
</script>

<template>
  <WdDock :model="model" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `DockItem[]` | `[]` | Icon items. |
| `position` | `'bottom' \| 'top'` | `'bottom'` | Visual position modifier. |
