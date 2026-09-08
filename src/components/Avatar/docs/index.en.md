---
title: Avatar
category: 03 / DATA
description: Avatar displays a user or entity identity. Supports image, icon, and text fallback; shape and size are configurable.
---

# Avatar

Avatar displays a user or entity identity. Display priority: `image` > `icon` > `label`.

## Import

```ts
import { RdAvatar } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdAvatar } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <RdAvatar label="AB" />
    <RdAvatar icon="check" />
    <RdAvatar label="SQ" shape="square" />
    <RdAvatar label="LG" size="large" />
    <RdAvatar label="XL" size="xlarge" />
  </div>
</template>
```

## Group

`RdAvatarGroup` stacks avatars. Extra items beyond `max` show as `+N`. A failed image falls back to `icon` / `label` and emits `error`.

```vue preview
<script setup lang="ts">
import { RdAvatar, RdAvatarGroup } from '@wise-kit/ui'
</script>

<template>
  <RdAvatarGroup :max="3">
    <RdAvatar label="AL" />
    <RdAvatar label="BK" />
    <RdAvatar label="CN" />
    <RdAvatar label="DY" />
  </RdAvatarGroup>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Text fallback when there is no image or icon. |
| `image` | `string` | — | Image URL; highest priority. |
| `icon` | `IconName` | — | `RdIcon` icon name. |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape. |
| `size` | `'normal' \| 'large' \| 'xlarge' \| 'sm' \| 'lg'` | `'normal'` | Size; `sm`/`lg` are aliases. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `error` | `Event` | Image failed to load. |

`RdAvatarGroup`: `max` limits visible avatars; `size` styles the overflow marker.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Fallback when `src` is omitted. |
