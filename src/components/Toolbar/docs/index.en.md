---
title: Toolbar
category: 06 / LAYOUT
description: Toolbar layout with start / center / end regions.
---

# Toolbar

Horizontal action bar, commonly used as a list page header.

## Import

```ts
import { MButton, MToolbar } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MButton, MToolbar } from 'morya-ui'
</script>

<template>
  <MToolbar>
    <template #start>
      <MButton label="New" size="small" />
    </template>
    <template #center>
      <span>Toolbar</span>
    </template>
    <template #end>
      <MButton label="Export" severity="secondary" size="small" />
    </template>
  </MToolbar>
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
