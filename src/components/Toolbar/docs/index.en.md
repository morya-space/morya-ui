---
title: Toolbar
category: 06 / LAYOUT
description: Toolbar layout with start / center / end regions.
---

# Toolbar

Horizontal action bar, commonly used as a list page header.

## Import

```ts
import { RdButton, RdToolbar } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdButton, RdToolbar } from '@wise-kit/ui'
</script>

<template>
  <RdToolbar>
    <template #start>
      <RdButton label="New" size="small" />
    </template>
    <template #center>
      <span>Toolbar</span>
    </template>
    <template #end>
      <RdButton label="Export" severity="secondary" size="small" />
    </template>
  </RdToolbar>
</template>
```

## Slots

| Slot | Description |
| --- | --- |
| `start` | Start (left) area. |
| `center` | Center area. |
| `end` | End (right) area. |

## Events

No custom events.
