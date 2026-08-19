---
title: TieredMenu
category: 09 / MENU
description: A vertical layered menu with one submenu level.
---

# TieredMenu

Expand one level of submenu on hover or click.

## Import

```ts
import { WdTieredMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdTieredMenu } from '@well-insight/ui'

const model = [
  {
    label: 'File',
    items: [{ label: 'New' }, { label: 'Export' }],
  },
  { label: 'Help' },
]
</script>

<template>
  <WdTieredMenu :model="model" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `TieredMenuItem[]` | — | Menu items; may include one level of `items`. |
| `popup` | `boolean` | `false` | Whether to use popup mode. |
| `modelValue` | `boolean` | `false` | Popup visibility. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
