---
title: Chip
category: 07 / MISC
description: Chip displays tagged information, optionally with an icon, image, and remove action.
---

# Chip

Chip displays short tagged information, with optional icon/image and a remove button.

## Import

```ts
import { WiChip } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiChip } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiChip label="Basic" />
    <WiChip label="With Icon" icon="check" />
    <WiChip label="Removable" removable />
    <WiChip label="Disabled" removable disabled />
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

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `remove` | `MouseEvent` | Fired when the remove button is clicked. |
