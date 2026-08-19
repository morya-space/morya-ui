---
title: Avatar
category: 07 / MISC
description: Avatar displays a user or entity identity. Supports image, icon, and text fallback; shape and size are configurable.
---

# Avatar

Avatar displays a user or entity identity. Display priority: `image` > `icon` > `label`.

## Import

```ts
import { WdAvatar } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdAvatar } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdAvatar label="AB" />
    <WdAvatar icon="check" />
    <WdAvatar label="SQ" shape="square" />
    <WdAvatar label="LG" size="large" />
    <WdAvatar label="XL" size="xlarge" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Text fallback when there is no image or icon. |
| `image` | `string` | — | Image URL; highest priority. |
| `icon` | `IconName` | — | `WdIcon` icon name. |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape. |
| `size` | `'normal' \| 'large' \| 'xlarge' \| 'sm' \| 'lg'` | `'normal'` | Size; `sm`/`lg` are aliases. |
