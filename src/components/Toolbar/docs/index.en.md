---
title: Toolbar
category: 06 / LAYOUT
description: Toolbar layout with start / center / end regions.
---

# Toolbar

Horizontal action bar, commonly used as a list page header.

## Import

```ts
import { WkButton, WkToolbar } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkButton, WkToolbar } from '@wise-kit/ui'
</script>

<template>
  <WkToolbar>
    <template #start>
      <WkButton label="New" size="small" />
    </template>
    <template #center>
      <span>Toolbar</span>
    </template>
    <template #end>
      <WkButton label="Export" severity="secondary" size="small" />
    </template>
  </WkToolbar>
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
