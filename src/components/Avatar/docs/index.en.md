---
title: Avatar
category: 07 / MISC
description: Avatar displays a user or entity identity. Supports image, icon, and text fallback; shape and size are configurable.
---

# Avatar

Avatar displays a user or entity identity. Display priority: `image` > `icon` > `label`.

## Import

```ts
import { WiAvatar } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiAvatar } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiAvatar label="AB" />
    <WiAvatar icon="check" />
    <WiAvatar label="SQ" shape="square" />
    <WiAvatar label="LG" size="large" />
    <WiAvatar label="XL" size="xlarge" />
  </div>
</template>
```

## Group

`WiAvatarGroup` stacks avatars. Extra items beyond `max` show as `+N`. A failed image falls back to `icon` / `label` and emits `error`.

```vue preview
<script setup lang="ts">
import { WiAvatar, WiAvatarGroup } from '@well-insight/ui'
</script>

<template>
  <WiAvatarGroup :max="3">
    <WiAvatar label="AL" />
    <WiAvatar label="BK" />
    <WiAvatar label="CN" />
    <WiAvatar label="DY" />
  </WiAvatarGroup>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Text fallback when there is no image or icon. |
| `image` | `string` | — | Image URL; highest priority. |
| `icon` | `IconName` | — | `WiIcon` icon name. |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape. |
| `size` | `'normal' \| 'large' \| 'xlarge' \| 'sm' \| 'lg'` | `'normal'` | Size; `sm`/`lg` are aliases. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `error` | `Event` | Image failed to load. |

`WiAvatarGroup`: `max` limits visible avatars; `size` styles the overflow marker.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Fallback when `src` is omitted. |
