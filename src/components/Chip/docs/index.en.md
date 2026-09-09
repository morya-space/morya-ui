---
title: Chip
category: 01 / BASIC
description: Chip displays tagged information, optionally with an icon, image, and remove action.
---

# Chip

Chip displays short tagged information, with optional icon/image and a remove button.

## Import

```ts
import { MChip } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MChip } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <MChip label="Basic" />
    <MChip label="With Icon" icon="check" />
    <MChip label="Removable" removable />
    <MChip label="Success" severity="success" size="small" />
    <MChip label="Disabled" removable disabled />
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
| `severity` | `MTagSeverity \| 'warning'` | — | Semantic color. |
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
