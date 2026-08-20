---
title: MegaMenu
category: 09 / MENU
description: Horizontal menu with children shown in a multi-column panel.
---

# MegaMenu

Top-level horizontal navigation; expanded children are shown in columns.

## Import

```ts
import { WiMegaMenu } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiMegaMenu } from '@well-insight/ui'

const model = [
  {
    label: 'Products',
    items: [
      [{ label: 'Components' }, { label: 'Themes' }],
      [{ label: 'Icons' }, { label: 'Templates' }],
    ],
  },
  { label: 'About' },
]
</script>

<template>
  <WiMegaMenu :model="model" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MegaMenuItem[]` | `[]` | Menu items; `items` is an array of columns. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
