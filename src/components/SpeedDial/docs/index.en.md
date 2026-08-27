---
title: SpeedDial
category: 01 / PRIMITIVE
description: Floating shortcut action button group.
---

# SpeedDial

A main button that expands a set of directional shortcut actions.

## Import

```ts
import { WiSpeedDial } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiSpeedDial } from '@well-insight/ui'
import { ref } from 'vue'

const open = ref(false)
const items = [
  { label: 'Edit', icon: '✎' },
  { label: 'Delete', icon: '🗑' },
  { label: 'Share', icon: '↗' },
]
</script>

<template>
  <div style="min-height:8rem;display:flex;align-items:flex-end;justify-content:center">
    <WiSpeedDial v-model="open" :model="items" direction="up" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `SpeedDialItem[]` | `[]` | Action items. |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Expand direction. |
| `modelValue` | `boolean` | `false` | Whether it is expanded. |
| `disabled` | `boolean` | `false` | Disabled. |
| `ariaLabel` | `string` | locale `speedDial` | Accessible label for the main button. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the expanded state changes. |
