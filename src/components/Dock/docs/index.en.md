---
title: Dock
category: 04 / NAVIGATION
description: macOS-style icon dock.
---

# Dock

Shortcut entries shown as an icon list.

## Import

```ts
import { WiDock } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiDock } from '@well-insight/ui'

const model = [
  { label: 'Home', icon: '⌂' },
  { label: 'Search', icon: '⌕' },
  { label: 'Settings', icon: '⚙' },
]
</script>

<template>
  <WiDock :model="model" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `DockItem[]` | `[]` | Icon items. |
| `position` | `'bottom' \| 'top'` | `'bottom'` | Visual position modifier. |

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Dock items. |
