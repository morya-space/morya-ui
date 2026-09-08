---
title: Tag
category: 01 / BASIC
description: Tag for status or category.
---

# Tag

Tags display status or category.

## Import

```ts
import { WkTag } from '@wise-kit/ui'
```

## Basic

Show text via `value` or the default slot.

```vue preview
<script setup lang="ts">
import { WkTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkTag value="Primary" />
    <WkTag>Slot Label</WkTag>
    <WkTag value="Rounded" rounded />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted. The legacy value `warning` is mapped to `warn`.

```vue preview
<script setup lang="ts">
import { WkTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkTag value="Primary" />
    <WkTag value="Secondary" severity="secondary" />
    <WkTag value="Success" severity="success" />
    <WkTag value="Info" severity="info" />
    <WkTag value="Warn" severity="warn" />
    <WkTag value="Danger" severity="danger" />
    <WkTag value="Contrast" severity="contrast" />
  </div>
</template>
```

## Icons

Pass a `WkIcon` icon name to `icon`.

```vue preview
<script setup lang="ts">
import { WkTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkTag value="New" icon="plus" severity="info" />
    <WkTag value="Done" icon="check" severity="success" />
    <WkTag value="Alert" icon="info" severity="warn" rounded />
  </div>
</template>
```

## Closable

```vue preview
<script setup lang="ts">
import { WkTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkTag value="Draft" closable bordered />
    <WkTag value="Small" size="small" severity="success" closable />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Tag text. The default slot takes precedence when present. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | Semantic color. `warning` is a compatibility alias mapped to `warn`. |
| `rounded` | `boolean` | `false` | Fully rounded. |
| `icon` | `IconName` | — | `WkIcon` icon name. |
| `closable` | `boolean` | `false` | Show a close control. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `bordered` | `boolean` | `false` | Draw a border. |
| `color` | `string` | — | Custom color. |
| `disabled` | `boolean` | `false` | Disable the close control. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `close` | `MouseEvent` | Fired when close is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Tag content; takes precedence over `value`. |
