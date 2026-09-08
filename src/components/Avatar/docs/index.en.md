---
title: Avatar
category: 03 / DATA
description: Avatar displays a user or entity identity. Supports image, icon, and text fallback; shape and size are configurable.
---

# Avatar

Avatar displays a user or entity identity. Display priority: `image` > `icon` > `label`.

## Import

```ts
import { WkAvatar } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkAvatar } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkAvatar label="AB" />
    <WkAvatar icon="check" />
    <WkAvatar label="SQ" shape="square" />
    <WkAvatar label="LG" size="large" />
    <WkAvatar label="XL" size="xlarge" />
  </div>
</template>
```

## Group

`WkAvatarGroup` stacks avatars. Extra items beyond `max` show as `+N`. A failed image falls back to `icon` / `label` and emits `error`.

```vue preview
<script setup lang="ts">
import { WkAvatar, WkAvatarGroup } from '@wise-kit/ui'
</script>

<template>
  <WkAvatarGroup :max="3">
    <WkAvatar label="AL" />
    <WkAvatar label="BK" />
    <WkAvatar label="CN" />
    <WkAvatar label="DY" />
  </WkAvatarGroup>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Text fallback when there is no image or icon. |
| `image` | `string` | — | Image URL; highest priority. |
| `icon` | `IconName` | — | `WkIcon` icon name. |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape. |
| `size` | `'normal' \| 'large' \| 'xlarge' \| 'sm' \| 'lg'` | `'normal'` | Size; `sm`/`lg` are aliases. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `error` | `Event` | Image failed to load. |

`WkAvatarGroup`: `max` limits visible avatars; `size` styles the overflow marker.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Fallback when `src` is omitted. |
