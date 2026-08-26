---
title: Breadcrumb
category: 09 / MENU
description: Shows the current page position in a hierarchy.
---

# Breadcrumb

Breadcrumb navigation. Items with `to` render as links; otherwise as text.

## Import

```ts
import { WiBreadcrumb } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiBreadcrumb } from '@well-insight/ui'

const items = [
  { label: 'Electronics', to: '/electronics' },
  { label: 'Computer', to: '/electronics/computer' },
  { label: 'Accessories' },
]
</script>

<template>
  <WiBreadcrumb :home="{ label: 'Home', to: '/' }" :model="items" />
</template>
```

## Separator

`separator` customizes the delimiter; `#separator` can replace it.

```vue preview
<script setup lang="ts">
import { WiBreadcrumb } from '@well-insight/ui'

const items = [
  { label: 'Library', to: '/lib' },
  { label: 'Docs' },
]
</script>

<template>
  <WiBreadcrumb :model="items" separator=">" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `{ label: string; to?: string; disabled?: boolean }[]` | — | Path items. |
| `home` | `{ label?: string; to?: string }` | — | Home item; default label is `Home`. |
| `separator` | `string` | `'/'` | Separator text. |

## Slots

| Slot | Description |
| --- | --- |
| `separator` | Custom separator. |
