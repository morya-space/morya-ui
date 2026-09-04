---
title: Chip
category: 01 / BASIC
description: Chip displays tagged information, optionally with an icon, image, and remove action.
---

# Chip

Chip displays short tagged information, with optional icon/image and a remove button.

## Import

```ts
import { WdChip } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdChip } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdChip label="Basic" />
    <WdChip label="With Icon" icon="check" />
    <WdChip label="Removable" removable />
    <WdChip label="Success" severity="success" size="small" />
    <WdChip label="Disabled" removable disabled />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Chip text. |
| `icon` | `IconName` | — | Leading icon name. |
| `image` | `string` | — | Leading image URL (takes precedence over icon). |
| `removable` | `boolean` | `false` | Show × remove button. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `severity` | `WdTagSeverity \| 'warning'` | — | Semantic color. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `remove` | `MouseEvent` | Fired when the remove button is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Label content. |
| `icon` | Leading icon. |
