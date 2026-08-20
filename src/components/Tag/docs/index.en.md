---
title: Tag
category: 01 / PRIMITIVE
description: Tag for status or category.
---

# Tag

Tags display status or category.

## Import

```ts
import { WiTag } from '@well-insight/ui'
```

## Basic

Show text via `value` or the default slot.

```vue preview
<script setup lang="ts">
import { WiTag } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiTag value="Primary" />
    <WiTag>Slot Label</WiTag>
    <WiTag value="Rounded" rounded />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted. The legacy value `warning` is mapped to `warn`.

```vue preview
<script setup lang="ts">
import { WiTag } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiTag value="Primary" />
    <WiTag value="Secondary" severity="secondary" />
    <WiTag value="Success" severity="success" />
    <WiTag value="Info" severity="info" />
    <WiTag value="Warn" severity="warn" />
    <WiTag value="Danger" severity="danger" />
    <WiTag value="Contrast" severity="contrast" />
  </div>
</template>
```

## Icons

Pass a `WiIcon` icon name to `icon`.

```vue preview
<script setup lang="ts">
import { WiTag } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiTag value="New" icon="plus" severity="info" />
    <WiTag value="Done" icon="check" severity="success" />
    <WiTag value="Alert" icon="info" severity="warn" rounded />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Tag text. The default slot takes precedence when present. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | Semantic color. `warning` is a compatibility alias mapped to `warn`. |
| `rounded` | `boolean` | `false` | Fully rounded. |
| `icon` | `IconName` | — | `WiIcon` icon name. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Tag content; takes precedence over `value`. |
