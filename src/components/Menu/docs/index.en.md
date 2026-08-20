---
title: Menu
category: 09 / MENU
description: Vertical menu list with optional popup mode.
---

# Menu

Vertical menu rendered from a `model`.

## Import

```ts
import { WiMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiMenu } from '@well-insight/ui'

const model = [
  { label: 'New', command: () => undefined },
  { label: 'Open' },
  { separator: true },
  { label: 'Disabled', disabled: true },
]
</script>

<template>
  <WiMenu :model="model" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenuItem[]` | — | Menu items. |
| `popup` | `boolean` | `false` | Whether to use popup mode. |
| `modelValue` | `boolean` | `false` | Popup visibility. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Popup visibility changed. |
