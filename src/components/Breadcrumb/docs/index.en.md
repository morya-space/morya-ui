---
title: Breadcrumb
category: 04 / NAVIGATION
description: Shows the current page position in a hierarchy.
---

# Breadcrumb

Breadcrumb navigation. Items with `to` render as links; otherwise as text.

## Import

```ts
import { WdBreadcrumb } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdBreadcrumb } from '@wex-design/ui'

const items = [
  { label: 'Electronics', to: '/electronics' },
  { label: 'Computer', to: '/electronics/computer' },
  { label: 'Accessories' },
]
</script>

<template>
  <WdBreadcrumb :home="{ label: 'Home', to: '/' }" :model="items" />
</template>
```

## Separator

`separator` customizes the delimiter; `#separator` can replace it.

```vue preview
<script setup lang="ts">
import { WdBreadcrumb } from '@wex-design/ui'

const items = [
  { label: 'Library', to: '/lib' },
  { label: 'Docs' },
]
</script>

<template>
  <WdBreadcrumb :model="items" separator=">" />
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

## Events

No custom events.
