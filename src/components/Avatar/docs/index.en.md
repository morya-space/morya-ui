---
title: Avatar
category: 03 / DATA
description: Avatar displays a user or entity identity. Supports image, icon, and text fallback; shape and size are configurable.
---

# Avatar

Avatar displays a user or entity identity. Display priority: `image` > `icon` > `label`.

## Import

```ts
import { MAvatar } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Group

`MAvatarGroup` stacks avatars. Extra items beyond `max` show as `+N`. A failed image falls back to `icon` / `label` and emits `error`.

```vue preview src="./demos/Group.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Text fallback when there is no image or icon. |
| `image` | `string` | — | Image URL; highest priority. |
| `icon` | [IconName](/docs/types#IconName) | — | `MIcon` icon name. |
| `shape` | `'circle' \| 'square'` | `'circle'` | Shape. |
| `size` | `'normal' \| 'large' \| 'xlarge' \| 'sm' \| 'lg'` | `'normal'` | Size; `sm`/`lg` are aliases. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `error` | `Event` | Image failed to load. |

`MAvatarGroup`: `max` limits visible avatars; `size` styles the overflow marker.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Fallback when `src` is omitted. |
