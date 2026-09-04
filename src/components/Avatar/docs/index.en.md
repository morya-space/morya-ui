---
title: Avatar
category: 03 / DATA
description: Avatar displays a user or entity identity. Supports image, icon, and text fallback; shape and size are configurable.
---

# Avatar

Avatar displays a user or entity identity. Display priority: `image` > `icon` > `label`.

## Import

```ts
import { WdAvatar } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdAvatar } from '@wex-design/ui'
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

## Group

`WdAvatarGroup` stacks avatars. Extra items beyond `max` show as `+N`. A failed image falls back to `icon` / `label` and emits `error`.

```vue preview
<script setup lang="ts">
import { WdAvatar, WdAvatarGroup } from '@wex-design/ui'
</script>

<template>
  <WdAvatarGroup :max="3">
    <WdAvatar label="AL" />
    <WdAvatar label="BK" />
    <WdAvatar label="CN" />
    <WdAvatar label="DY" />
  </WdAvatarGroup>
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

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `error` | `Event` | Image failed to load. |

`WdAvatarGroup`: `max` limits visible avatars; `size` styles the overflow marker.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Fallback when `src` is omitted. |
