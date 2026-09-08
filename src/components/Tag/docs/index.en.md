---
title: Tag
category: 01 / BASIC
description: Tag for status or category.
---

# Tag

Tags display status or category.

## Import

```ts
import { RdTag } from '@wise-kit/ui'
```

## Basic

Show text via `value` or the default slot.

```vue preview
<script setup lang="ts">
import { RdTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <RdTag value="Primary" />
    <RdTag>Slot Label</RdTag>
    <RdTag value="Rounded" rounded />
  </div>
</template>
```

## Severity

Use `severity` for semantic color; defaults to primary when omitted. The legacy value `warning` is mapped to `warn`.

```vue preview
<script setup lang="ts">
import { RdTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <RdTag value="Primary" />
    <RdTag value="Secondary" severity="secondary" />
    <RdTag value="Success" severity="success" />
    <RdTag value="Info" severity="info" />
    <RdTag value="Warn" severity="warn" />
    <RdTag value="Danger" severity="danger" />
    <RdTag value="Contrast" severity="contrast" />
  </div>
</template>
```

## Icons

Pass a `RdIcon` icon name to `icon`.

```vue preview
<script setup lang="ts">
import { RdTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <RdTag value="New" icon="plus" severity="info" />
    <RdTag value="Done" icon="check" severity="success" />
    <RdTag value="Alert" icon="info" severity="warn" rounded />
  </div>
</template>
```

## Closable

```vue preview
<script setup lang="ts">
import { RdTag } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <RdTag value="Draft" closable bordered />
    <RdTag value="Small" size="small" severity="success" closable />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Tag text. The default slot takes precedence when present. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'primary'` | Semantic color. `warning` is a compatibility alias mapped to `warn`. |
| `rounded` | `boolean` | `false` | Fully rounded. |
| `icon` | `IconName` | — | `RdIcon` icon name. |
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
