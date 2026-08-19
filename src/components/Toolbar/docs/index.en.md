---
title: Toolbar
category: 05 / PANEL
description: Toolbar layout with start / center / end regions.
---

# Toolbar

Horizontal action bar, commonly used as a list page header.

## Import

```ts
import { WdToolbar, WdButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdToolbar, WdButton } from '@well-insight/ui'
</script>

<template>
  <WdToolbar>
    <template #start>
      <WdButton label="New" size="small" />
    </template>
    <template #center>
      <span>Toolbar</span>
    </template>
    <template #end>
      <WdButton label="Export" severity="secondary" size="small" />
    </template>
  </WdToolbar>
</template>
```

## Slots

| Slot | Description |
| --- | --- |
| `start` | Start (left) area. |
| `center` | Center area. |
| `end` | End (right) area. |
